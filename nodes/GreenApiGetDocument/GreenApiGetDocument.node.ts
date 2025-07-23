// nodes/GreenApiGetDocument/GreenApiGetDocument.node.ts
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

export class GreenApiGetDocument implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Get Document',
		name: 'greenApiGetDocument',
		icon: 'file:greenApi.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Download and process WhatsApp documents via Green API',
		defaults: {
			name: 'Green API Get Document',
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
						name: 'Get Document URL',
						value: 'getDocumentUrl',
						description: 'Get download URL for document',
						action: 'Get document download URL',
					},
					{
						name: 'Download Document',
						value: 'downloadDocument',
						description: 'Download document file',
						action: 'Download document file',
					},
				],
				default: 'downloadDocument',
			},
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				default: '',
				required: true,
				placeholder: '972501234567@c.us',
				description: 'Chat ID where the document was sent',
			},
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'BAE5367237E13A87',
				description: 'ID of the document message to download',
			},
			{
				displayName: 'Save as Binary',
				name: 'saveAsBinary',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['downloadDocument'],
					},
				},
				description: 'Whether to save the document file as binary data',
			},
			{
				displayName: 'Binary Property Name',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'document_data',
				displayOptions: {
					show: {
						operation: ['downloadDocument'],
						saveAsBinary: [true],
					},
				},
				description: 'Name of the binary property to store the document file',
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
				
				if (operation === 'getDocumentUrl') {
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
						mimeType: response.mimeType || 'application/octet-stream',
						fileName: response.fileName || `document_${messageId}`,
						chatId,
						messageId,
					};

				} else if (operation === 'downloadDocument') {
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
						throw new NodeOperationError(this.getNode(), 'No download URL received for document');
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
						mimeType: urlResponse.mimeType || 'application/octet-stream',
						fileName: urlResponse.fileName || `document_${messageId}`,
						fileSize: fileBuffer.length,
						chatId,
						messageId,
						downloaded: true,
					};

					if (saveAsBinary) {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData: IBinaryData = {
							data: fileBuffer.toString('base64'),
							mimeType: urlResponse.mimeType || 'application/octet-stream',
							fileName: urlResponse.fileName || `document_${messageId}`,
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
				throw new NodeOperationError(this.getNode(), `Document operation failed: ${(error as Error).message}`, { itemIndex: i });
			}
		}

		return [returnData];
	}
}