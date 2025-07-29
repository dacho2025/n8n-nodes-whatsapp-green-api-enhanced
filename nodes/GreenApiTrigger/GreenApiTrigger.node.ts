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
						name: 'Audio Message',
						value: 'audioMessage',
						description: 'Audio/voice messages',
					},
					{
						name: 'Avatar Info',
						value: 'avatarInfo',
						description: 'Avatar information update',
					},
					{
						name: 'Chat History',
						value: 'chatHistory',
						description: 'Chat history event',
					},
					{
						name: 'Contact Message',
						value: 'contactMessage',
						description: 'Contact sharing messages',
					},
					{
						name: 'Contacts',
						value: 'contacts',
						description: 'Contacts update',
					},
					{
						name: 'Device Info',
						value: 'deviceInfo',
						description: 'Device information update',
					},
					{
						name: 'Document Message',
						value: 'documentMessage',
						description: 'Document/file messages',
					},
					{
						name: 'File Message',
						value: 'fileMessage',
						description: 'Generic file messages',
					},
					{
						name: 'Group Created',
						value: 'groupCreated',
						description: 'New group created',
					},
					{
						name: 'Group Left',
						value: 'groupLeft',
						description: 'Left a group',
					},
					{
						name: 'Group Participants Changed',
						value: 'groupParticipantsChanged',
						description: 'Group participants updated',
					},
					{
						name: 'Group Updated',
						value: 'groupUpdated',
						description: 'Group information updated',
					},
					{
						name: 'Image Message',
						value: 'imageMessage',
						description: 'Image/photo messages',
					},
					{
						name: 'Incoming Call',
						value: 'incomingCall',
						description: 'Incoming voice/video call',
					},
					{
						name: 'Incoming Message',
						value: 'incomingMessageReceived',
						description: 'Triggered when a message is received',
					},
					{
						name: 'Location Message',
						value: 'locationMessage',
						description: 'Location sharing messages',
					},
					{
						name: 'Message Deleted',
						value: 'messageDeleted',
						description: 'Message was deleted',
					},
					{
						name: 'Outgoing Call',
						value: 'outgoingCall',
						description: 'Outgoing voice/video call',
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
						name: 'Poll Message',
						value: 'pollMessage',
						description: 'Poll/vote messages',
					},
					{
						name: 'Presence Update',
						value: 'presenceUpdate',
						description: 'Presence status update',
					},
					{
						name: 'Quotas Info',
						value: 'quotasInfo',
						description: 'Quota information update',
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
						name: 'Sticker Message',
						value: 'stickerMessage',
						description: 'Sticker messages',
					},
					{
						name: 'Video Message',
						value: 'videoMessage',
						description: 'Video messages',
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
						displayName: 'Chat Type',
						name: 'chatType',
						type: 'options',
						options: [
							{
								name: 'All Chats',
								value: 'all',
							},
							{
								name: 'Group Chats Only',
								value: 'group',
							},
							{
								name: 'Private Chats Only',
								value: 'private',
							},
						],
						default: 'all',
						description: 'Filter by chat type',
					},
					{
						displayName: 'Keywords',
						name: 'keywords',
						type: 'string',
						default: '',
						placeholder: 'help,support,urgent',
						description: 'Comma-separated keywords to filter messages',
					},
					{
						displayName: 'Maximum Message Length',
						name: 'maxMessageLength',
						type: 'number',
						default: 0,
						description: 'Maximum message length in characters (0 = no limit)',
					},
					{
						displayName: 'Minimum Message Length',
						name: 'minMessageLength',
						type: 'number',
						default: 0,
						description: 'Minimum message length in characters (0 = no limit)',
					},
					{
						displayName: 'Sender Filter',
						name: 'senderFilter',
						type: 'string',
						default: '',
						placeholder: '972501234567@c.us',
						description: 'Filter messages from specific sender (leave empty for all)',
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
						displayName: 'Include Message Data',
						name: 'includeMessageData',
						type: 'boolean',
						default: true,
						description: 'Whether to include full message data in the output',
					},
					{
						displayName: 'Include Metadata',
						name: 'includeMetadata',
						type: 'boolean',
						default: true,
						description: 'Whether to include metadata in the output',
					},
					{
						displayName: 'Auto Detect Media Type',
						name: 'autoDetectMedia',
						type: 'boolean',
						default: false,
						description: 'Whether to automatically detect and categorize media message types',
					},
					{
						displayName: 'Include Raw Data',
						name: 'includeRawData',
						type: 'boolean',
						default: false,
						description: 'Whether to include the complete raw webhook data in the output',
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

		// Debug logging
		console.log('Webhook received:', JSON.stringify(bodyData, null, 2));

		if (!bodyData || typeof bodyData !== 'object') {
			console.log('Invalid body data');
			return {
				noWebhookResponse: true,
			};
		}

		const webhookData = bodyData as any;

		// Extract event type and data
		const eventType = webhookData.typeWebhook || webhookData.type;
		let messageData = webhookData.messageData || webhookData.data || webhookData;

		console.log('Event type:', eventType);
		console.log('Message data:', JSON.stringify(messageData, null, 2));

		// Check if this event should trigger
		if (!events.includes(eventType)) {
			console.log('Event type not in selected events:', eventType);
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
			if (filters.minMessageLength && messageText.length < filters.minMessageLength) {
				return { noWebhookResponse: true };
			}
			if (filters.maxMessageLength && filters.maxMessageLength > 0 && messageText.length > filters.maxMessageLength) {
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
		if (options.includeMetadata) {
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
