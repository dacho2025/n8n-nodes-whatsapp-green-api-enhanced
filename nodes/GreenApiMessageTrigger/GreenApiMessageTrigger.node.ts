import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';

export class GreenApiMessageTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Message Trigger',
		name: 'greenApiMessageTrigger',
		icon: 'file:greenApi.svg',
		group: ['trigger'],
		version: 1,
		description: 'Simple WhatsApp message trigger - starts workflow when any message is received',
		defaults: {
			name: 'Green API Message Trigger',
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
				displayName: 'Message Types',
				name: 'messageTypes',
				type: 'multiOptions',
				options: [
					{
						name: 'Text Messages',
						value: 'textMessage',
						description: 'Text messages only',
					},
					{
						name: 'Audio Messages',
						value: 'audioMessage',
						description: 'Voice messages and audio files',
					},
					{
						name: 'Image Messages',
						value: 'imageMessage',
						description: 'Images and photos',
					},
					{
						name: 'Video Messages',
						value: 'videoMessage',
						description: 'Video files',
					},
					{
						name: 'Document Messages',
						value: 'documentMessage',
						description: 'Documents and files',
					},
					{
						name: 'Sticker Messages',
						value: 'stickerMessage',
						description: 'Stickers',
					},
					{
						name: 'All Messages',
						value: 'all',
						description: 'Any type of message',
					},
				],
				default: ['all'],
				description: 'Types of messages that will trigger this workflow',
			},
			{
				displayName: 'Chat Filter',
				name: 'chatFilter',
				type: 'options',
				options: [
					{
						name: 'All Chats',
						value: 'all',
					},
					{
						name: 'Private Chats Only',
						value: 'private',
					},
					{
						name: 'Group Chats Only',
						value: 'group',
					},
				],
				default: 'all',
				description: 'Filter messages by chat type',
			},
			{
				displayName: 'Quick Filters',
				name: 'quickFilters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Keywords',
						name: 'keywords',
						type: 'string',
						default: '',
						placeholder: 'hi, hello, help',
						description: 'Only trigger for messages containing these keywords (comma-separated)',
					},
					{
						displayName: 'Exclude Bot Messages',
						name: 'excludeBot',
						type: 'boolean',
						default: true,
						description: 'Exclude messages from your own bot',
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
		const messageTypes = this.getNodeParameter('messageTypes') as string[];
		const chatFilter = this.getNodeParameter('chatFilter') as string;
		const quickFilters = this.getNodeParameter('quickFilters', {}) as any;

		if (!bodyData || typeof bodyData !== 'object') {
			return { noWebhookResponse: true };
		}

		const webhookData = bodyData as any;
		
		// Only process incoming messages
		if (webhookData.typeWebhook !== 'incomingMessageReceived') {
			return { noWebhookResponse: true };
		}

		const messageData = webhookData.messageData;
		if (!messageData) {
			return { noWebhookResponse: true };
		}

		// Check message type filter
		if (!messageTypes.includes('all')) {
			const messageType = messageData.typeMessage;
			if (!messageTypes.includes(messageType)) {
				return { noWebhookResponse: true };
			}
		}

		// Check chat type filter
		if (chatFilter !== 'all') {
			const isGroup = messageData.chatId && messageData.chatId.includes('@g.us');
			if (chatFilter === 'group' && !isGroup) {
				return { noWebhookResponse: true };
			}
			if (chatFilter === 'private' && isGroup) {
				return { noWebhookResponse: true };
			}
		}

		// Check keyword filter
		if (quickFilters.keywords && messageData.textMessage) {
			const messageText = messageData.textMessage.toLowerCase();
			const keywords = quickFilters.keywords.toLowerCase().split(',').map((k: string) => k.trim());
			const hasKeyword = keywords.some((keyword: string) => messageText.includes(keyword));
			if (!hasKeyword) {
				return { noWebhookResponse: true };
			}
		}

		// Exclude bot messages
		if (quickFilters.excludeBot && messageData.isFromMe) {
			return { noWebhookResponse: true };
		}

		// Build clean output
		const outputData = {
			messageId: messageData.idMessage,
			chatId: messageData.chatId,
			senderId: messageData.senderId,
			senderName: messageData.senderName,
			messageType: messageData.typeMessage,
			timestamp: messageData.timestamp,
		};

		// Add message content
		if (messageData.textMessage) {
			(outputData as any).messageText = messageData.textMessage;
		}

		// Add media metadata for media messages
		if (messageData.downloadUrl) {
			(outputData as any).downloadUrl = messageData.downloadUrl;
		}
		if (messageData.caption) {
			(outputData as any).caption = messageData.caption;
		}
		if (messageData.fileName) {
			(outputData as any).fileName = messageData.fileName;
		}

		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
		};
	}
}