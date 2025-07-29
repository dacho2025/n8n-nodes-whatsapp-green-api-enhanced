// nodes/GreenApiTrigger/GreenApiTrigger.node.ts
import {
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeApiError,
	NodeConnectionType,
} from 'n8n-workflow';

import { TriggerProperties } from './properties/TriggerProperties';
import { isValidEvent, getWebhookType } from '../../utils/EventTypes';

export class GreenApiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Trigger',
		name: 'greenApiTrigger',
		icon: 'file:greenApi.svg',
		group: ['trigger'],
		version: 1,
		description: 'Enhanced WhatsApp trigger with file support and advanced filtering',
		defaults: {
			name: 'Green API Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'greenApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: TriggerProperties,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const headerData = this.getHeaderData() as IDataObject;
		const bodyData = this.getBodyData() as IDataObject;
		
		// Get node parameters
		const events = this.getNodeParameter('events') as string[];
		const downloadFiles = this.getNodeParameter('downloadFiles', true) as boolean;
		const fileTypes = this.getNodeParameter('fileTypes', ['image', 'audio', 'document']) as string[];
		const chatFilter = this.getNodeParameter('chatFilter', '') as string;
		const senderFilter = this.getNodeParameter('senderFilter', '') as string;
		
		// Advanced options
		const advancedOptions = this.getNodeParameter('advancedOptions', {}) as IDataObject;
		const instanceIdFilter = advancedOptions.instanceIdFilter as string || '';
		const includeQuoted = advancedOptions.includeQuoted as boolean || false;
		const parseMentions = advancedOptions.parseMentions as boolean || false;
		const includeRawData = advancedOptions.includeRawData as boolean || false;
		
		// Filters
		const filters = this.getNodeParameter('filters', {}) as IDataObject;
		const keywords = filters.keywords as string || '';
		const messageTypes = filters.messageTypes as string[] || [];
		const chatTypes = filters.chatTypes as string || 'all';
		const excludeBots = filters.excludeBots as boolean ?? true;
		const excludeForwarded = filters.excludeForwarded as boolean || false;
		const minLength = filters.minLength as number || 0;
		const maxLength = filters.maxLength as number || 0;

		// Validate webhook data
		if (!bodyData || !bodyData.typeWebhook) {
			throw new NodeApiError(this.getNode(), {
				message: 'Invalid webhook data - missing typeWebhook',
				description: 'This does not appear to be a valid Green API webhook',
			});
		}

		const webhookType = bodyData.typeWebhook as string;
		const messageData = bodyData.messageData as IDataObject;
		const instanceData = bodyData.instanceData as IDataObject;

		// Filter by events
		const isEventMatch = events.some(event => {
			if (!isValidEvent(event)) return false;
			return getWebhookType(event) === webhookType;
		});

		if (!isEventMatch) {
			return { noWebhookResponse: true };
		}

		// Filter by instance ID
		if (instanceIdFilter && instanceData?.idInstance !== instanceIdFilter) {
			return { noWebhookResponse: true };
		}

		// Filter by chat ID
		if (chatFilter && messageData?.chatId !== chatFilter) {
			return { noWebhookResponse: true };
		}

		// Filter by sender
		if (senderFilter && messageData?.senderId !== senderFilter) {
			return { noWebhookResponse: true };
		}

		// Filter by chat type
		if (chatTypes !== 'all' && messageData?.chatId) {
			const isGroup = (messageData.chatId as string).includes('@g.us');
			if (chatTypes === 'group' && !isGroup) return { noWebhookResponse: true };
			if (chatTypes === 'private' && isGroup) return { noWebhookResponse: true };
		}

		// Filter by message type
		if (messageTypes.length > 0 && messageData?.typeMessage) {
			if (!messageTypes.includes(messageData.typeMessage as string)) {
				return { noWebhookResponse: true };
			}
		}

		let returnData: IDataObject = {
			event: webhookType,
			timestamp: new Date().toISOString(),
			instanceId: instanceData?.idInstance || null,
		};

		try {
			// Process message data if available
			if (messageData) {
				// Extract message text inline
				const messageText = extractMessageText(messageData);
				
				// Apply text-based filters
				if (keywords) {
					const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
					const hasKeyword = keywordList.some(keyword => 
						messageText.toLowerCase().includes(keyword)
					);
					if (!hasKeyword) {
						return { noWebhookResponse: true };
					}
				}

				// Bot filter
				if (excludeBots && isBotMessage(messageText)) {
					return { noWebhookResponse: true };
				}

				// Forwarded filter
				if (excludeForwarded && messageData.quotedMessage) {
					return { noWebhookResponse: true };
				}

				// Length filters
				if (minLength > 0 && messageText.length < minLength) {
					return { noWebhookResponse: true };
				}
				if (maxLength > 0 && messageText.length > maxLength) {
					return { noWebhookResponse: true };
				}

				// Process message
				const messageDataObj: IDataObject = {
					messageId: messageData.idMessage,
					chatId: messageData.chatId,
					senderId: messageData.senderId,
					senderName: messageData.senderName,
					textMessage: messageText,
					timestamp: messageData.timestamp,
					type: messageData.typeMessage,
					isGroup: ((messageData.chatId as string) || '').includes('@g.us'),
				};

				returnData.messageData = messageDataObj;

				// Process quoted message if requested
				if (includeQuoted && messageData.quotedMessage) {
					const quotedMessage = messageData.quotedMessage as IDataObject;
					(returnData.messageData as IDataObject).quotedMessage = {
						messageId: quotedMessage.stanzaId,
						text: quotedMessage.textMessage,
						type: quotedMessage.typeMessage,
					};
				}

				// Parse mentions if requested
				if (parseMentions) {
					(returnData.messageData as IDataObject).mentions = extractMentions(messageText);
				}

				// Add basic file info if available (no download in trigger)
				if (hasFileMessage(messageData)) {
					returnData.hasFile = true;
					returnData.fileType = messageData.typeMessage;
				}
			}

			// Add instance data
			if (instanceData) {
				returnData.instance = {
					id: instanceData.idInstance,
					webhookUrl: instanceData.webhookUrl,
					senderData: instanceData.senderData,
				};
			}

			// Add raw data if requested
			if (includeRawData) {
				returnData.rawData = bodyData;
			}

			// Add headers
			returnData.headers = headerData;

		} catch (error) {
			returnData.error = (error as Error).message;
		}

		return {
			workflowData: [
				[
					{
						json: returnData,
					},
				],
			],
		};
	}

}

// Helper functions outside the class
function extractMessageText(messageData: IDataObject): string {
	// Try different possible text fields
	const textSources = [
		messageData.textMessage,
		messageData.text,
		messageData.caption,
	];

	// Check for nested text data
	const textMessageData = messageData.textMessageData as IDataObject;
	if (textMessageData) {
		textSources.unshift(textMessageData.textMessage);
	}

	// Check for image/video/document caption
	const imageData = messageData.imageMessageData as IDataObject;
	if (imageData?.caption) {
		textSources.unshift(imageData.caption);
	}

	const videoData = messageData.videoMessageData as IDataObject;
	if (videoData?.caption) {
		textSources.unshift(videoData.caption);
	}

	const documentData = messageData.documentMessageData as IDataObject;
	if (documentData?.caption) {
		textSources.unshift(documentData.caption);
	}

	// Return first non-empty text found
	for (const source of textSources) {
		if (source && typeof source === 'string' && source.trim()) {
			return source.trim();
		}
	}

	return '';
}

function isBotMessage(messageText: string): boolean {
	const botIndicators = [
		'bot', 'automated', 'auto-reply', 'automatic', 
		'אוטומטי', 'בוט', 'רובוט', 'אוטומטית'
	];
	const lowerText = messageText.toLowerCase();
	return botIndicators.some(indicator => lowerText.includes(indicator));
}

function extractMentions(messageText: string): string[] {
	const mentionRegex = /@(\w+)/g;
	const mentions: string[] = [];
	let match;
	
	while ((match = mentionRegex.exec(messageText)) !== null) {
		mentions.push(match[1]);
	}
	
	return mentions;
}

function hasFileMessage(messageData: IDataObject): boolean {
	const fileTypes = [
		'imageMessage',
		'audioMessage', 
		'videoMessage',
		'documentMessage',
		'voiceMessage',
		'stickerMessage'
	];
	return fileTypes.includes(messageData.typeMessage as string);
}