import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IBinaryKeyData,
	NodeConnectionType,
} from 'n8n-workflow';

// Helper function to get nested values from objects
function getNestedValue(obj: any, path: string): any {
	if (!path.includes('.')) {
		return obj[path];
	}
	return path.split('.').reduce((current, key) => {
		return current && typeof current === 'object' ? current[key] : undefined;
	}, obj);
}

export class GreenApiGetVoice implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Get Voice',
		name: 'greenApiGetVoice',
		icon: 'file:greenApi.svg',
		group: ['communication'],
		version: 1,
		description: 'Download and process WhatsApp voice messages via Green API',
		defaults: {
			name: 'Green API Get Voice',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'greenApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Input Source',
				name: 'inputSource',
				type: 'options',
				options: [
					{
						name: 'Message ID',
						value: 'messageId',
						description: 'Use message ID to download voice',
					},
					{
						name: 'Download URL',
						value: 'downloadUrl',
						description: 'Use direct download URL',
					},
					{
						name: 'From Previous Node',
						value: 'previousNode',
						description: 'Get data from previous node output',
					},
				],
				default: 'previousNode',
				description: 'Source of the voice message data',
			},
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						inputSource: ['messageId'],
					},
				},
				default: '',
				description: 'WhatsApp message ID containing the voice message',
			},
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						inputSource: ['messageId'],
					},
				},
				default: '',
				placeholder: '972501234567@c.us',
				description: 'WhatsApp Chat ID where the message was sent',
			},
			{
				displayName: 'Download URL',
				name: 'downloadUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						inputSource: ['downloadUrl'],
					},
				},
				default: '',
				description: 'Direct download URL for the voice message',
			},
			{
				displayName: 'Message ID Field',
				name: 'messageIdField',
				type: 'string',
				displayOptions: {
					show: {
						inputSource: ['previousNode'],
					},
				},
				default: 'messageId',
				description: 'Field name containing the message ID in previous node data',
			},
			{
				displayName: 'Chat ID Field',
				name: 'chatIdField',
				type: 'string',
				displayOptions: {
					show: {
						inputSource: ['previousNode'],
					},
				},
				default: 'chatId',
				description: 'Field name containing the chat ID in previous node data',
			},
			{
				displayName: 'Download URL Field',
				name: 'downloadUrlField',
				type: 'string',
				displayOptions: {
					show: {
						inputSource: ['previousNode'],
					},
				},
				default: 'metadata.downloadUrl',
				description: 'Field name containing the download URL in previous node data',
			},
			{
				displayName: 'Binary Property Name',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'voice',
				description: 'Name of the binary property to store the voice file',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Metadata',
						name: 'includeMetadata',
						type: 'boolean',
						default: true,
						description: 'Whether to include voice message metadata in the output',
					},
					{
						displayName: 'Custom Filename',
						name: 'customFilename',
						type: 'string',
						default: '',
						placeholder: 'voice_{timestamp}',
						description: 'Custom filename for the downloaded voice file. Use {timestamp}, {messageId}, {chatId} as placeholders.',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('greenApi');
		const instanceId = credentials.instanceId as string;
		const apiToken = credentials.apiTokenInstance as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const inputSource = this.getNodeParameter('inputSource', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
				const options = this.getNodeParameter('options', i, {}) as any;

				let messageId: string = '';
				let chatId: string = '';
				let downloadUrl: string = '';

				// Get data based on input source
				if (inputSource === 'messageId') {
					messageId = this.getNodeParameter('messageId', i) as string;
					chatId = this.getNodeParameter('chatId', i) as string;
				} else if (inputSource === 'downloadUrl') {
					downloadUrl = this.getNodeParameter('downloadUrl', i) as string;
				} else if (inputSource === 'previousNode') {
					const messageIdField = this.getNodeParameter('messageIdField', i) as string;
					const chatIdField = this.getNodeParameter('chatIdField', i) as string;
					const downloadUrlField = this.getNodeParameter('downloadUrlField', i) as string;

					messageId = getNestedValue(items[i].json, messageIdField);
					chatId = getNestedValue(items[i].json, chatIdField);
					downloadUrl = getNestedValue(items[i].json, downloadUrlField);
				}

				let voiceData: Buffer;
				let fileName: string = 'voice_message';
				let mimeType: string = 'audio/ogg';
				let metadata: any = {};

				if (downloadUrl) {
					// Download directly from URL
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: downloadUrl,
						encoding: 'arraybuffer',
						returnFullResponse: true,
					});

					voiceData = Buffer.from(response.body);

					// Extract filename from URL or headers
					const contentDisposition = response.headers['content-disposition'];
					if (contentDisposition) {
						const match = contentDisposition.match(/filename="([^"]+)"/);
						if (match) {
							fileName = match[1];
						}
					}

					mimeType = response.headers['content-type'] || 'audio/ogg';

					metadata = {
						downloadUrl,
						fileSize: voiceData.length,
						mimeType,
						downloadedAt: new Date().toISOString(),
					};
				} else if (messageId && chatId) {
					// Get file info first
					const fileInfoResponse = await this.helpers.requestWithAuthentication.call(
						this,
						'greenApi',
						{
							method: 'POST',
							url: `/waInstance${instanceId}/getFileByMessage/${apiToken}`,
							body: {
								chatId,
								idMessage: messageId,
							},
							json: true,
						},
					);

					if (!fileInfoResponse.urlFile) {
						throw new NodeOperationError(
							this.getNode(),
							`No file URL found for message ${messageId}`,
							{ itemIndex: i },
						);
					}

					// Download the file
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: fileInfoResponse.urlFile,
						encoding: 'arraybuffer',
						returnFullResponse: true,
					});

					voiceData = Buffer.from(response.body);
					fileName = fileInfoResponse.fileName || 'voice_message';
					mimeType = fileInfoResponse.mimeType || 'audio/ogg';

					metadata = {
						messageId,
						chatId,
						downloadUrl: fileInfoResponse.urlFile,
						fileName: fileInfoResponse.fileName,
						fileSize: voiceData.length,
						mimeType: fileInfoResponse.mimeType,
						caption: fileInfoResponse.caption,
						downloadedAt: new Date().toISOString(),
					};
				} else {
					throw new NodeOperationError(
						this.getNode(),
						'Either download URL or message ID with chat ID must be provided',
						{ itemIndex: i },
					);
				}

				// Apply custom filename if provided
				if (options.customFilename) {
					fileName = options.customFilename
						.replace('{timestamp}', Date.now().toString())
						.replace('{messageId}', messageId)
						.replace('{chatId}', chatId);

					// Ensure it has proper extension
					if (!fileName.includes('.')) {
						fileName += '.ogg';
					}
				}

				// Prepare binary data
				const binaryData: IBinaryKeyData = {
					[binaryPropertyName]: {
						data: voiceData.toString('base64'),
						mimeType,
						fileName,
						fileExtension: fileName.split('.').pop() || 'ogg',
					},
				};

				// Prepare JSON data
				const jsonData: any = {
					success: true,
					fileName,
					fileSize: voiceData.length,
					mimeType,
				};

				if (options.includeMetadata) {
					jsonData.metadata = metadata;
				}

				// Include original data from previous node
				if (inputSource === 'previousNode') {
					jsonData.originalData = items[i].json;
				}

				returnData.push({
					json: jsonData,
					binary: binaryData,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							success: false,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
