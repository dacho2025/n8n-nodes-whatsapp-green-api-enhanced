// nodes/GreenApiGetImage/GreenApiGetImage.node.ts
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

export class GreenApiGetImage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Get Image',
		name: 'greenApiGetImage',
		icon: 'file:greenApi.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Download and process WhatsApp images via Green API',
		defaults: {
			name: 'Green API Get Image',
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
						name: 'Get Image URL',
						value: 'getImageUrl',
						description: 'Get download URL for image',
						action: 'Get image download URL',
					},
					{
						name: 'Download Image',
						value: 'downloadImage',
						description: 'Download image file',
						action: 'Download image file',
					},
					{
						name: 'Get Image Info',
						value: 'getImageInfo',
						description: 'Get image metadata without downloading',
						action: 'Get image metadata',
					},
				],
				default: 'downloadImage',
			},
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				default: '',
				required: true,
				placeholder: '972501234567@c.us',
				description: 'Chat ID where the image was sent',
			},
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'BAE5367237E13A87',
				description: 'ID of the image message to download',
			},
			{
				displayName: 'Save as Binary',
				name: 'saveAsBinary',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['downloadImage'],
					},
				},
				description: 'Whether to save the image file as binary data',
			},
			{
				displayName: 'Binary Property Name',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'image_data',
				displayOptions: {
					show: {
						operation: ['downloadImage'],
						saveAsBinary: [true],
					},
				},
				description: 'Name of the binary property to store the image file',
			},
			{
				displayName: 'Include Caption',
				name: 'includeCaption',
				type: 'boolean',
				default: true,
				description: 'Whether to include the image caption in the response',
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
			const includeCaption = this.getNodeParameter('includeCaption', i) as boolean;

			try {
				let responseData: IDataObject = {};
				
				if (operation === 'getImageUrl') {
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
						mimeType: response.mimeType || 'image/jpeg',
						fileName: response.fileName || `image_${messageId}.jpg`,
						chatId,
						messageId,
					};

					if (includeCaption && response.caption) {
						responseData.caption = response.caption;
					}

				} else if (operation === 'getImageInfo') {
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
						mimeType: response.mimeType || 'image/jpeg',
						fileName: response.fileName || `image_${messageId}.jpg`,
						chatId,
						messageId,
						isImage: true,
					};

					if (includeCaption && response.caption) {
						responseData.caption = response.caption;
					}

				} else if (operation === 'downloadImage') {
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
						throw new NodeOperationError(this.getNode(), 'No download URL received for image');
					}

					const downloadOptions = {
						method: 'GET' as const,
						uri: urlResponse.downloadUrl,
						encoding: null,
					};

					const fileBuffer = await this.helpers.request(downloadOptions);
					const saveAsBinary = this.getNodeParameter('saveAsBinary', i) as boolean;

					responseData = {
						downloadUrl: urlResponse.downloadUrl,
						mimeType: urlResponse.mimeType || 'image/jpeg',
						fileName: urlResponse.fileName || `image_${messageId}.jpg`,
						fileSize: fileBuffer.length,
						chatId,
						messageId,
						downloaded: true,
						isImage: true,
					};

					if (includeCaption && urlResponse.caption) {
						responseData.caption = urlResponse.caption;
					}

					if (saveAsBinary) {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData: IBinaryData = {
							data: fileBuffer.toString('base64'),
							mimeType: urlResponse.mimeType || 'image/jpeg',
							fileName: urlResponse.fileName || `image_${messageId}.jpg`,
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
				throw new NodeOperationError(this.getNode(), `Image operation failed: ${(error as Error).message}`, { itemIndex: i });
			}
		}

		return [returnData];
	}
}