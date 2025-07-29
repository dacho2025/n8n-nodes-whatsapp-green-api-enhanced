import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';

export class GreenApiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Trigger',
		name: 'greenApiTrigger',
		icon: 'file:greenApi.svg',
		group: ['trigger'],
		version: 1,
		description: 'Enhanced WhatsApp webhook trigger with comprehensive event handling',
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
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Incoming Message',
						value: 'incomingMessageReceived',
						description: 'Triggered when a message is received',
					},
					{
						name: 'Outgoing Message Received',
						value: 'outgoingMessageReceived',
						description: 'Confirmation that outgoing message was received',
					},
					{
						name: 'Outgoing Message Status',
						value: 'outgoingMessageStatus',
						description: 'Status update for outgoing messages',
					},
					{
						name: 'State Instance Changed',
						value: 'stateInstanceChanged',
						description: 'Instance state has changed',
					},
					{
						name: 'Status Instance Changed',
						value: 'statusInstanceChanged',
						description: 'Instance status has changed',
					},
					{
						name: 'Device Info',
						value: 'deviceInfo',
						description: 'Device information update',
					},
					{
						name: 'Incoming Call',
						value: 'incomingCall',
						description: 'Incoming voice/video call',
					},
					{
						name: 'Outgoing Call',
						value: 'outgoingCall',
						description: 'Outgoing voice/video call',
					},
					{
						name: 'Avatar Info',
						value: 'avatarInfo',
						description: 'Avatar information update',
					},
					{
						name: 'Contacts',
						value: 'contacts',
						description: 'Contacts update',
					},
					{
						name: 'Chat History',
						value: 'chatHistory',
						description: 'Chat history event',
					},
					{
						name: 'Presence Update',
						value: 'presenceUpdate',
						description: 'Contact presence status update',
					},
					{
						name: 'Group Participants Changed',
						value: 'groupParticipantsChanged',
						description: 'Group participants were added/removed',
					},
					{
						name: 'Group Created',
						value: 'groupCreated',
						description: 'New group was created',
					},
					{
						name: 'Group Updated',
						value: 'groupUpdated',
						description: 'Group information was updated',
					},
					{
						name: 'Group Left',
						value: 'groupLeft',
						description: 'Left a group',
					},
					{
						name: 'Quotas Info',
						value: 'quotasInfo',
						description: 'Account quotas information',
					},
					{
						name: 'Message Deleted',
						value: 'messageDeleted',
						description: 'Message was deleted',
					},
					{
						name: 'File Message',
						value: 'fileMessage',
						description: 'File message received',
					},
					{
						name: 'Audio Message',
						value: 'audioMessage',
						description: 'Audio message received',
					},
					{
						name: 'Video Message',
						value: 'videoMessage',
						description: 'Video message received',
					},
					{
						name: 'Image Message',
						value: 'imageMessage',
						description: 'Image message received',
					},
					{
						name: 'Document Message',
						value: 'documentMessage',
						description: 'Document message received',
					},
					{
						name: 'Sticker Message',
						value: 'stickerMessage',
						description: 'Sticker message received',
					},
					{
						name: 'Location Message',
						value: 'locationMessage',
						description: 'Location message received',
					},
					{
						name: 'Contact Message',
						value: 'contactMessage',
						description: 'Contact message received',
					},
					{
						name: 'Poll Message',
						value: 'pollMessage',
						description: 'Poll message received',
					},
				],
				default: ['incomingMessageReceived'],
				description: 'Events that will trigger the webhook',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Keywords',
						name: 'keywords',
						type: 'string',
						default: '',
						placeholder: 'hello, hi, start',
						description: 'Comma-separated keywords to filter messages (case-insensitive)',
					},
					{
						displayName: 'Chat Type',
						name: 'chatType',
						type: 'options',
						options: [
							{
								name: 'All',
								value: 'all',
							},
							{
								name: 'Private Chat',
								value: 'private',
							},
							{
								name: 'Group Chat',
								value: 'group',
							},
						],
						default: 'all',
						description: 'Filter by chat type',
					},
					{
						displayName: 'Minimum Message Length',
						name: 'minLength',
						type: 'number',
						default: 0,
						description: 'Minimum length of message text to trigger',
					},
					{
						displayName: 'Maximum Message Length',
						name: 'maxLength',
						type: 'number',
						default: 0,
						description: 'Maximum length of message text to trigger (0 = no limit)',
					},
					{
						displayName: 'Sender Filter',
						name: 'senderFilter',
						type: 'string',
						default: '',
						placeholder: '972501234567@c.us',
						description: 'Only trigger for messages from specific sender (Chat ID)',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Raw Data',
						name: 'includeRawData',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw webhook data in the output',
					},
					{
						displayName: 'Auto-detect Media Type',
						name: 'autoDetectMedia',
						type: 'boolean',
						default: true,
						description: 'Automatically detect and classify media message types',
					},
					{
						displayName: 'Extract Metadata',
						name: 'extractMetadata',
						type: 'boolean',
						default: true,
						description: 'Extract additional metadata from messages',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const events = this.getNodeParameter('events') as string[];
		const filters = this.getNodeParameter('filters', {}) as any;
		const options = this.getNodeParameter('options', {}) as any;

		if (!bodyData || typeof bodyData !== 'object') {
			return {
				noWebhookResponse: true,
			};
		}

		const webhookData = bodyData as any;
		
		// Extract event type and data
		const eventType = webhookData.typeWebhook;
		let messageData = webhookData.messageData || webhookData;
		
		// Check if this event should trigger
		if (!events.includes(eventType)) {
			return {
				noWebhookResponse: true,
			};
		}

		// Auto-detect media type if enabled
		if (options.autoDetectMedia && messageData.typeMessage) {
			const mediaTypes: { [key: string]: string } = {
				'textMessage': 'textMessage',
				'imageMessage': 'imageMessage',
				'videoMessage': 'videoMessage',
				'documentMessage': 'documentMessage',
				'audioMessage': 'audioMessage',
				'voiceMessage': 'audioMessage',
				'stickerMessage': 'stickerMessage',
				'locationMessage': 'locationMessage',
				'contactMessage': 'contactMessage',
				'pollMessage': 'pollMessage',
			};

			const detectedType = mediaTypes[messageData.typeMessage];
			if (detectedType && !events.includes(detectedType)) {
				// Add the detected type to trigger appropriately
				messageData.detectedMediaType = detectedType;
			}
		}

		// Apply filters
		if (messageData.textMessage) {
			const messageText = messageData.textMessage.toLowerCase();

			// Keywords filter
			if (filters.keywords) {
				const keywords = filters.keywords.toLowerCase().split(',').map((k: string) => k.trim());
				const hasKeyword = keywords.some((keyword: string) => messageText.includes(keyword));
				if (!hasKeyword) {
					return { noWebhookResponse: true };
				}
			}

			// Message length filters
			if (filters.minLength && messageText.length < filters.minLength) {
				return { noWebhookResponse: true };
			}
			if (filters.maxLength && filters.maxLength > 0 && messageText.length > filters.maxLength) {
				return { noWebhookResponse: true };
			}
		}

		// Chat type filter
		if (filters.chatType && filters.chatType !== 'all') {
			const isGroup = messageData.chatId && messageData.chatId.includes('@g.us');
			if (filters.chatType === 'group' && !isGroup) {
				return { noWebhookResponse: true };
			}
			if (filters.chatType === 'private' && isGroup) {
				return { noWebhookResponse: true };
			}
		}

		// Sender filter
		if (filters.senderFilter && messageData.senderId !== filters.senderFilter) {
			return { noWebhookResponse: true };
		}

		// Build response data
		let responseData: any = {
			eventType,
			messageId: messageData.idMessage,
			chatId: messageData.chatId,
			senderId: messageData.senderId,
			senderName: messageData.senderName,
			messageType: messageData.typeMessage,
			timestamp: messageData.timestamp,
		};

		// Add message content based on type
		if (messageData.textMessage) {
			responseData.messageText = messageData.textMessage;
		}

		// Extract metadata if enabled
		if (options.extractMetadata) {
			responseData.metadata = {
				isFromMe: messageData.isFromMe || false,
				chatName: messageData.chatName,
				senderContactName: messageData.senderContactName,
			};

			// Add media-specific metadata
			if (messageData.downloadUrl) {
				responseData.metadata.downloadUrl = messageData.downloadUrl;
			}
			if (messageData.caption) {
				responseData.metadata.caption = messageData.caption;
			}
			if (messageData.fileName) {
				responseData.metadata.fileName = messageData.fileName;
			}
			if (messageData.fileSize) {
				responseData.metadata.fileSize = messageData.fileSize;
			}
			if (messageData.mimeType) {
				responseData.metadata.mimeType = messageData.mimeType;
			}

			// Location data
			if (messageData.location) {
				responseData.metadata.location = messageData.location;
			}

			// Contact data
			if (messageData.contact) {
				responseData.metadata.contact = messageData.contact;
			}

			// Poll data
			if (messageData.poll) {
				responseData.metadata.poll = messageData.poll;
			}
		}

		// Include raw data if requested
		if (options.includeRawData) {
			responseData.rawData = webhookData;
		}

		return {
			workflowData: [
				[
					{
						json: responseData,
					},
				],
			],
		};
	}
}