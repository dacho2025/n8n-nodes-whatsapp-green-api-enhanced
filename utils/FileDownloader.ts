// utils/FileDownloader.ts
import {
	IDataObject,
	IWebhookFunctions,
	IBinaryData,
} from 'n8n-workflow';

export interface ProcessedFile {
	url?: string;
	downloadUrl?: string;
	fileName: string;
	mimeType: string;
	fileSize?: number;
	fileType: string;
	caption?: string;
	data?: Buffer;
	downloaded: boolean;
	error?: string;
}

export class FileDownloader {
	private context: IWebhookFunctions;
	private instanceId: string;
	private apiToken: string;
	private timeout: number;

	constructor(
		context: IWebhookFunctions,
		instanceId: string,
		apiToken: string,
		timeout: number = 30000
	) {
		this.context = context;
		this.instanceId = instanceId;
		this.apiToken = apiToken;
		this.timeout = timeout;
	}

	/**
	 * Check if message data contains a file
	 */
	static hasFile(messageData: IDataObject): boolean {
		const messageType = messageData.typeMessage as string;
		const mediaTypes = [
			'imageMessage',
			'audioMessage',
			'videoMessage', 
			'documentMessage',
			'voiceMessage',
			'stickerMessage'
		];
		return mediaTypes.includes(messageType);
	}

	/**
	 * Create binary data object for n8n
	 */
	static createBinaryData(processedFile: ProcessedFile): IBinaryData | null {
		if (!processedFile.data) {
			return null;
		}

		return {
			data: processedFile.data.toString('base64'),
			mimeType: processedFile.mimeType,
			fileName: processedFile.fileName,
			fileSize: processedFile.fileSize,
		};
	}

	/**
	 * Create file metadata object
	 */
	static createFileMetadata(processedFile: ProcessedFile): IDataObject {
		return {
			filename: processedFile.fileName,
			mimeType: processedFile.mimeType,
			fileType: processedFile.fileType,
			fileSize: processedFile.fileSize,
			fileSizeFormatted: processedFile.fileSize 
				? this.formatFileSize(processedFile.fileSize) 
				: 'Unknown',
			downloaded: processedFile.downloaded,
			caption: processedFile.caption || '',
			downloadUrl: processedFile.downloadUrl,
			error: processedFile.error,
		};
	}

	/**
	 * Get human readable file size
	 */
	static formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	/**
	 * Process file message (simplified version for trigger)
	 */
	async processFileMessage(
		messageData: IDataObject,
		shouldDownload: boolean = false,
		allowedFileTypes: string[] = ['image', 'audio', 'document', 'video']
	): Promise<ProcessedFile | null> {
		const messageType = messageData.typeMessage as string;
		
		if (!FileDownloader.hasFile(messageData)) {
			return null;
		}

		try {
			const fileInfo: ProcessedFile = {
				fileName: `file_${Date.now()}`,
				mimeType: 'application/octet-stream',
				fileType: messageType.replace('Message', ''),
				downloaded: false,
			};

			// Extract basic file info based on message type
			switch (messageType) {
				case 'imageMessage': {
					const imageData = messageData.imageMessageData as IDataObject;
					fileInfo.fileName = `image_${Date.now()}.jpg`;
					fileInfo.mimeType = 'image/jpeg';
					fileInfo.caption = imageData?.caption as string || '';
					fileInfo.downloadUrl = imageData?.downloadUrl as string;
					break;
				}

				case 'audioMessage': {
					const audioData = messageData.audioMessageData as IDataObject;
					fileInfo.fileName = `audio_${Date.now()}.mp3`;
					fileInfo.mimeType = 'audio/mpeg';
					fileInfo.downloadUrl = audioData?.downloadUrl as string;
					break;
				}

				case 'videoMessage': {
					const videoData = messageData.videoMessageData as IDataObject;
					fileInfo.fileName = `video_${Date.now()}.mp4`;
					fileInfo.mimeType = 'video/mp4';
					fileInfo.caption = videoData?.caption as string || '';
					fileInfo.downloadUrl = videoData?.downloadUrl as string;
					break;
				}

				case 'documentMessage': {
					const docData = messageData.documentMessageData as IDataObject;
					fileInfo.fileName = docData?.fileName as string || `document_${Date.now()}`;
					fileInfo.mimeType = docData?.mimeType as string || 'application/octet-stream';
					fileInfo.caption = docData?.caption as string || '';
					fileInfo.downloadUrl = docData?.downloadUrl as string;
					break;
				}

				case 'voiceMessage': {
					const voiceData = messageData.voiceMessageData as IDataObject;
					fileInfo.fileName = `voice_${Date.now()}.ogg`;
					fileInfo.mimeType = 'audio/ogg';
					fileInfo.downloadUrl = voiceData?.downloadUrl as string;
					break;
				}

				case 'stickerMessage': {
					const stickerData = messageData.stickerMessageData as IDataObject;
					fileInfo.fileName = `sticker_${Date.now()}.webp`;
					fileInfo.mimeType = 'image/webp';
					fileInfo.downloadUrl = stickerData?.downloadUrl as string;
					break;
				}

				default:
					return null;
			}

			return fileInfo;

		} catch (error) {
			return {
				fileName: 'unknown_file',
				mimeType: 'application/octet-stream',
				fileType: messageType.replace('Message', ''),
				downloaded: false,
				error: `File processing failed: ${(error as Error).message}`,
			};
		}
	}
}