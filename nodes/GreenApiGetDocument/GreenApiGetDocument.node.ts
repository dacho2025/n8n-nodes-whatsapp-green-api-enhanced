import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IBinaryKeyData,
	NodeConnectionType,
} from 'n8n-workflow';

export class GreenApiGetDocument implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Get Document',
		name: 'greenApiGetDocument',
		icon: 'file:greenApi.svg',
		group: ['communication'],
		version: 1,
		description: 'Download and process WhatsApp document messages via Green API',
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
				displayName: 'Input Source',
				name: 'inputSource',
				type: 'options',
				options: [
					{
						name: 'Message ID',
						value: 'messageId',
						description: 'Use message ID to download document',
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
				description: 'Source of the document message data',
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
				description: 'WhatsApp message ID containing the document',
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
				description: 'Direct download URL for the document',
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
				default: 'document',
				description: 'Name of the binary property to store the document file',
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
						description: 'Include document metadata in the output',
					},
					{
						displayName: 'Custom Filename',
						name: 'customFilename',
						type: 'string',
						default: '',
						placeholder: 'document_{timestamp}',
						description: 'Custom filename for the downloaded document. Use {timestamp}, {messageId}, {chatId}, {originalName} as placeholders',
					},
					{
						displayName: 'File Type Filter',
						name: 'fileTypeFilter',
						type: 'multiOptions',
						options: [
							{
								name: 'PDF',
								value: 'pdf',
							},
							{
								name: 'Word Documents',
								value: 'doc',
							},
							{
								name: 'Excel Files',
								value: 'excel',
							},
							{
								name: 'PowerPoint',
								value: 'ppt',
							},
							{
								name: 'Text Files',
								value: 'text',
							},
							{
								name: 'Images',
								value: 'image',
							},
							{
								name: 'Archive Files',
								value: 'archive',
							},
							{
								name: 'Other',
								value: 'other',
							},
						],
						default: [],
						description: 'Only process documents of selected types (leave empty for all types)',
					},
					{
						displayName: 'Max File Size (MB)',
						name: 'maxFileSize',
						type: 'number',
						default: 0,
						description: 'Maximum file size to download in MB (0 = no limit)',
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

					// Using the class method for accessing nested values
					messageId = this.getNestedValue(items[i].json, messageIdField);
					chatId = this.getNestedValue(items[i].json, chatIdField);
					downloadUrl = this.getNestedValue(items[i].json, downloadUrlField);
				}

				let documentData: Buffer;
				let fileName: string = 'document';
				let mimeType: string = 'application/octet-stream';
				let metadata: any = {};

				if (downloadUrl) {
					// Download directly from URL
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: downloadUrl,
						encoding: 'arraybuffer',
						returnFullResponse: true,
					});

					documentData = Buffer.from(response.body);
					
					// Extract filename from URL or headers
					const contentDisposition = response.headers['content-disposition'];
					if (contentDisposition) {
						const match = contentDisposition.match(/filename="([^"]+)"/);
						if (match) {
							fileName = match[1];
						}
					}

					mimeType = response.headers['content-type'] || 'application/octet-stream';

					metadata = {
						downloadUrl,
						fileSize: documentData.length,
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

					documentData = Buffer.from(response.body);
					fileName = fileInfoResponse.fileName || 'document';
					mimeType = fileInfoResponse.mimeType || 'application/octet-stream';

					metadata = {
						messageId,
						chatId,
						downloadUrl: fileInfoResponse.urlFile,
						fileName: fileInfoResponse.fileName,
						fileSize: documentData.length,
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

				// Check file size limit
				if (options.maxFileSize && options.maxFileSize > 0) {
					const maxSizeBytes = options.maxFileSize * 1024 * 1024;
					if (documentData.length > maxSizeBytes) {
						throw new NodeOperationError(
							this.getNode(),
							`File size (${(documentData.length / 1024 / 1024).toFixed(2)}MB) exceeds limit (${options.maxFileSize}MB)`,
							{ itemIndex: i },
						);
					}
				}

				// Check file type filter
				if (options.fileTypeFilter && options.fileTypeFilter.length > 0) {
					const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
					const fileTypeMap: { [key: string]: string[] } = {
						pdf: ['pdf'],
						doc: ['doc', 'docx'],
						excel: ['xls', 'xlsx', 'csv'],
						ppt: ['ppt', 'pptx'],
						text: ['txt', 'md', 'rtf'],
						image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
						archive: ['zip', 'rar', '7z', 'tar', 'gz'],
					};

					let typeMatches = false;
					for (const filterType of options.fileTypeFilter) {
						if (filterType === 'other') {
							// Check if it's not in any other category
							const allKnownExtensions = Object.values(fileTypeMap).flat();
							if (!allKnownExtensions.includes(fileExtension)) {
								typeMatches = true;
								break;
							}
						} else if (fileTypeMap[filterType]?.includes(fileExtension)) {
							typeMatches = true;
							break;
						}
					}

					if (!typeMatches) {
						// Skip this file
						continue;
					}
				}

				// Apply custom filename if provided
				if (options.customFilename) {
					const originalName = fileName.split('.')[0];
					const extension = fileName.split('.').pop();
					fileName = options.customFilename
						.replace('{timestamp}', Date.now().toString())
						.replace('{messageId}', messageId)
						.replace('{chatId}', chatId)
						.replace('{originalName}', originalName);
					
					// Add extension if missing
					if (!fileName.includes('.') && extension) {
						fileName += `.${extension}`;
					}
				}

				// Detect document type
				const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
				// Use the helper method to determine document type
				metadata.documentType = this.getDocumentType(fileExtension, mimeType);

				// Prepare binary data
				const binaryData: IBinaryKeyData = {
					[binaryPropertyName]: {
						data: documentData.toString('base64'),
						mimeType,
						fileName,
						fileExtension,
					},
				};

				// Prepare JSON data
				const jsonData: any = {
					success: true,
					fileName,
					fileSize: documentData.length,
					mimeType,
					documentType: metadata.documentType,
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

	// Helper method to get nested values from objects
	private getNestedValue(obj: any, path: string): any {
		if (!path.includes('.')) {
			return obj[path];
		}
		return path.split('.').reduce((current, key) => {
			return current && typeof current === 'object' ? current[key] : undefined;
		}, obj);
	}

	// Helper method to determine document type based on extension and MIME type
	private getDocumentType(fileExtension: string, mimeType: string): string {
		const typeMap: { [key: string]: string } = {
			pdf: 'PDF Document',
			doc: 'Word Document',
			docx: 'Word Document',
			xls: 'Excel Spreadsheet',
			xlsx: 'Excel Spreadsheet',
			ppt: 'PowerPoint Presentation',
			pptx: 'PowerPoint Presentation',
			txt: 'Text File',
			csv: 'CSV File',
			zip: 'Archive File',
			rar: 'Archive File',
			'7z': 'Archive File',
			jpg: 'Image File',
			jpeg: 'Image File',
			png: 'Image File',
			gif: 'Image File',
		};

		return typeMap[fileExtension] || 'Unknown Document';
	}
}