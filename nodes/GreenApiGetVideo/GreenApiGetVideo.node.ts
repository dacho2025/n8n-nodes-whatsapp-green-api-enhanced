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

// Helper function to determine video type based on filename
function getVideoType(fileName: string): string {
	const extension = fileName.split('.').pop()?.toLowerCase();
	const typeMap: { [key: string]: string } = {
		mp4: 'MP4 Video',
		avi: 'AVI Video',
		mov: 'QuickTime Video',
		wmv: 'Windows Media Video',
		flv: 'Flash Video',
		webm: 'WebM Video',
		mkv: 'Matroska Video',
		m4v: 'iTunes Video',
		'3gp': '3GP Video',
	};
	return typeMap[extension || ''] || 'Unknown Video Format';
}

export class GreenApiGetVideo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Green API Get Video',
		name: 'greenApiGetVideo',
		icon: 'file:greenApi.svg',
		group: ['communication'],
		version: 1,
		description: 'Download and process WhatsApp video messages via Green API',
		defaults: {
			name: 'Green API Get Video',
		},
		inputs: ['main'],
		outputs: ['main'],
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
						description: 'Use message ID to download video',
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
				description: 'Source of the video message data',
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
				description: 'WhatsApp message ID containing the video',
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
				description: 'Direct download URL for the video',
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
				default: 'video',
				description: 'Name of the binary property to store the video file',
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
						description: 'Whether to include video metadata in the output',
					},
					{
						displayName: 'Custom Filename',
						name: 'customFilename',
						type: 'string',
						default: '',
						placeholder: 'video_{timestamp}',
						description: 'Custom filename for the downloaded video. Use {timestamp}, {messageId}, {chatId}, {originalName} as placeholders.',
					},
					{
						displayName: 'Video Format Filter',
						name: 'formatFilter',
						type: 'multiOptions',
						options: [
							{
								name: 'AVI',
								value: 'avi',
							},
							{
								name: 'FLV',
								value: 'flv',
							},
							{
								name: 'MKV',
								value: 'mkv',
							},
							{
								name: 'MOV',
								value: 'mov',
							},
							{
								name: 'MP4',
								value: 'mp4',
							},
							{
								name: 'WebM',
								value: 'webm',
							},
							{
								name: 'WMV',
								value: 'wmv',
							},
						],
						default: [],
						description: 'Only process videos of selected formats (leave empty for all formats)',
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
					messageId = getNestedValue(items[i].json, messageIdField);
					chatId = getNestedValue(items[i].json, chatIdField);
					downloadUrl = getNestedValue(items[i].json, downloadUrlField);
				}

				let videoData: Buffer;
				let fileName: string = 'video';
				let mimeType: string = 'video/mp4';
				let metadata: any = {};
				let caption: string = '';

				if (downloadUrl) {
					// Download directly from URL
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: downloadUrl,
						encoding: 'arraybuffer',
						returnFullResponse: true,
					});

					videoData = Buffer.from(response.body);

					// Extract filename from URL or headers
					const contentDisposition = response.headers['content-disposition'];
					if (contentDisposition) {
						const match = contentDisposition.match(/filename="([^"]+)"/);
						if (match) {
							fileName = match[1];
						}
					}

					mimeType = response.headers['content-type'] || 'video/mp4';

					metadata = {
						downloadUrl,
						fileSize: videoData.length,
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

					videoData = Buffer.from(response.body);
					fileName = fileInfoResponse.fileName || 'video.mp4';
					mimeType = fileInfoResponse.mimeType || 'video/mp4';
					caption = fileInfoResponse.caption || '';

					metadata = {
						messageId,
						chatId,
						downloadUrl: fileInfoResponse.urlFile,
						fileName: fileInfoResponse.fileName,
						fileSize: videoData.length,
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
					if (videoData.length > maxSizeBytes) {
						throw new NodeOperationError(
							this.getNode(),
							`File size (${(videoData.length / 1024 / 1024).toFixed(2)}MB) exceeds limit (${options.maxFileSize}MB)`,
							{ itemIndex: i },
						);
					}
				}

				// Check format filter
				if (options.formatFilter && options.formatFilter.length > 0) {
					const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
					if (!options.formatFilter.includes(fileExtension)) {
						// Skip this video
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

				// Get video type
				// Use the helper method to determine video type
				const videoType = getVideoType(fileName);
				metadata.videoType = videoType;

				// Prepare binary data
				const binaryData: IBinaryKeyData = {
					[binaryPropertyName]: {
						data: videoData.toString('base64'),
						mimeType,
						fileName,
						fileExtension: fileName.split('.').pop() || 'mp4',
					},
				};

				// Prepare JSON data
				const jsonData: any = {
					success: true,
					fileName,
					fileSize: videoData.length,
					mimeType,
					videoType,
				};

				if (caption) {
					jsonData.caption = caption;
				}

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
