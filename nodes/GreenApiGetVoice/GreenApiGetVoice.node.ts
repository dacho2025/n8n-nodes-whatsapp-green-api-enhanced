// nodes/GreenApiGetVoice/GreenApiGetVoice.node.ts
import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
	IBinaryData,
} from 'n8n-workflow';

export class GreenApiGetVoice implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Get Voice',
		name: 'greenApiGetVoice',
		icon: 'file:greenApi.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Voice Message URL',
						value: 'getVoiceUrl',
						description: 'Get download URL for voice message',
						action: 'Get voice message download URL',
					},
					{
						name: 'Download Voice Message',
						value: 'downloadVoice',
						description: 'Download voice message file',
						action: 'Download voice message file',
					},
				],
				default: 'downloadVoice',
			},
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				default: '',
				required: true,
				placeholder: '972501234567@c.us',
				description: 'Chat ID where the voice message was sent',
			},
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'BAE5367237E13A87',
				description: 'ID of the voice message to download',
			},
			{
				displayName: 'Save as Binary',
				name: 'saveAsBinary',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['downloadVoice'],
					},
				},
				description: 'Whether to save the voice file as binary data',
			},
			{
				displayName: 'Binary Property Name',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'voice_data',
				displayOptions: {
					show: {
						operation: ['downloadVoice'],
						saveAsBinary: [true],
					},
				},
				description: 'Name of the binary property to store the voice file',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('greenApi');
		const instanceId = credentials.instanceId as string;
		const apiTokenInstance = credentials.apiTokenInstance as string;

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const chatId = this.getNodeParameter('chatId', i) as string;
			const messageId = this.getNodeParameter('messageId', i) as string;

			try {
				let responseData: IDataObject = {};
				
				if (operation === 'getVoiceUrl') {
					// Get download URL for voice message
					const options = {
						method: 'POST' as const,
						uri: `https://api.green-api.com/waInstance${instanceId}/downloadFile/${apiTokenInstance}`,
						body: {
							chatId,
							idMessage: messageId,
						},
						json: true,
					};

					const response = await this.helpers.request(options);
					responseData = {
						downloadUrl: response.downloadUrl,
						mimeType: response.mimeType || 'audio/ogg',
						fileName: response.fileName || `voice_${messageId}.ogg`,
						chatId,
						messageId,
					};

				} else if (operation === 'downloadVoice') {
					// First get the download URL
					const urlOptions = {
						method: 'POST' as const,
						uri: `https://api.green-api.com/waInstance${instanceId}/downloadFile/${apiTokenInstance}`,
						body: {
							chatId,
							idMessage: messageId,
						},
						json: true,
					};

					const urlResponse = await this.helpers.request(urlOptions);
					
					if (!urlResponse.downloadUrl) {
						throw new NodeOperationError(this.getNode(), 'No download URL received for voice message');
					}

					// Download the actual file
					const downloadOptions = {
						method: 'GET' as const,
						uri: urlResponse.downloadUrl,
						encoding: null,
					};

					const fileBuffer = await this.helpers.request(downloadOptions);
					const saveAsBinary = this.getNodeParameter('saveAsBinary', i) as boolean;

					responseData = {
						downloadUrl: urlResponse.downloadUrl,
						mimeType: urlResponse.mimeType || 'audio/ogg',
						fileName: urlResponse.fileName || `voice_${messageId}.ogg`,
						fileSize: fileBuffer.length,
						chatId,
						messageId,
						downloaded: true,
					};

					if (saveAsBinary) {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData: IBinaryData = {
							data: fileBuffer.toString('base64'),
							mimeType: urlResponse.mimeType || 'audio/ogg',
							fileName: urlResponse.fileName || `voice_${messageId}.ogg`,
						};

						returnData.push({
							json: responseData,
							binary: {
								[binaryPropertyName]: binaryData,
							},
						});
						continue;
					}
				}

				returnData.push({ json: responseData });

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
							chatId,
							messageId,
							operation,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), `Voice operation failed: ${(error as Error).message}`, { itemIndex: i });
			}
		}

		return [returnData];
	}
}