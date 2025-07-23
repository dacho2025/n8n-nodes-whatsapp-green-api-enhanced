// nodes/GreenApi/operations/MessageOperations.ts
import { IExecuteFunctions, IDataObject, JsonObject, NodeOperationError } from 'n8n-workflow';

export class MessageOperations {
	static async execute(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: string,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		switch (operation) {
			case 'send':
				return await this.sendMessage(context, itemIndex, instanceId, apiTokenInstance);
			case 'sendFileByUrl':
				return await this.sendFileByUrl(context, itemIndex, instanceId, apiTokenInstance);
			case 'sendFileByUpload':
				return await this.sendFileByUpload(context, itemIndex, instanceId, apiTokenInstance);
			case 'sendPoll':
				return await this.sendPoll(context, itemIndex, instanceId, apiTokenInstance);
			case 'sendLocation':
				return await this.sendLocation(context, itemIndex, instanceId, apiTokenInstance);
			case 'sendContact':
				return await this.sendContact(context, itemIndex, instanceId, apiTokenInstance);
			case 'forwardMessages':
				return await this.forwardMessages(context, itemIndex, instanceId, apiTokenInstance);
			case 'editMessage':
				return await this.editMessage(context, itemIndex, instanceId, apiTokenInstance);
			case 'deleteMessage':
				return await this.deleteMessage(context, itemIndex, instanceId, apiTokenInstance);
			case 'uploadFile':
				return await this.uploadFile(context, itemIndex, instanceId, apiTokenInstance);
			default:
				throw new NodeOperationError(context.getNode(), `Unknown message operation: ${operation}`);
		}
	}

	private static async sendMessage(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const message = context.getNodeParameter('message', itemIndex) as string;
		const quotedMessageId = context.getNodeParameter('quotedMessageId', itemIndex, '') as string;

		const body: IDataObject = {
			chatId,
			message,
		};

		if (quotedMessageId) {
			body.quotedMessageId = quotedMessageId;
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async sendFileByUrl(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const fileUrl = context.getNodeParameter('fileUrl', itemIndex) as string;
		const fileName = context.getNodeParameter('fileName', itemIndex) as string;
		const caption = context.getNodeParameter('caption', itemIndex, '') as string;
		const quotedMessageId = context.getNodeParameter('quotedMessageId', itemIndex, '') as string;

		const body: IDataObject = {
			chatId,
			urlFile: fileUrl,
			fileName,
			caption,
		};

		if (quotedMessageId) {
			body.quotedMessageId = quotedMessageId;
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/sendFileByUrl/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async sendFileByUpload(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const filePath = context.getNodeParameter('filePath', itemIndex) as string;
		const caption = context.getNodeParameter('caption', itemIndex, '') as string;
		const quotedMessageId = context.getNodeParameter('quotedMessageId', itemIndex, '') as string;

		const items = context.getInputData();
		const formData: IDataObject = {
			chatId,
			caption,
		};

		if (quotedMessageId) {
			formData.quotedMessageId = quotedMessageId;
		}

		// Handle binary data
		const binaryPropertyName = 'data';
		const currentItem = items[itemIndex];
		const binaryData = currentItem?.binary;

		if (binaryData && binaryData[binaryPropertyName]) {
			const actualBinaryData = binaryData[binaryPropertyName] as IDataObject;
			formData.file = {
				value: Buffer.from(actualBinaryData.data as string, 'base64'),
				options: {
					filename: actualBinaryData.fileName || 'unknown_file',
				},
			};
		} else {
			// Read from file system
			const fs = require('fs');
			const path = require('path');
			const fileName = path.basename(filePath);

			try {
				const fileContent = fs.readFileSync(filePath);
				formData.file = {
					value: fileContent,
					options: {
						filename: fileName,
					},
				};
			} catch (readError) {
				throw new NodeOperationError(
					context.getNode(),
					`Failed to read file: ${(readError as Error).message}`,
					{ itemIndex }
				);
			}
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/sendFileByUpload/${apiTokenInstance}`,
			formData,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async sendPoll(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const message = context.getNodeParameter('message', itemIndex) as string;
		const pollOptionsStr = context.getNodeParameter('pollOptions', itemIndex) as string;
		const multipleAnswers = context.getNodeParameter('multipleAnswers', itemIndex) as boolean;
		const quotedMessageId = context.getNodeParameter('quotedMessageId', itemIndex, '') as string;

		const pollOptions = pollOptionsStr.split(',').map(option => ({ optionName: option.trim() }));

		const body: IDataObject = {
			chatId,
			message,
			options: pollOptions,
			multipleAnswers,
		};

		if (quotedMessageId) {
			body.quotedMessageId = quotedMessageId;
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/sendPoll/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async sendLocation(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const nameLocation = context.getNodeParameter('nameLocation', itemIndex, '') as string;
		const address = context.getNodeParameter('address', itemIndex, '') as string;
		const latitude = context.getNodeParameter('latitude', itemIndex) as number;
		const longitude = context.getNodeParameter('longitude', itemIndex) as number;
		const quotedMessageId = context.getNodeParameter('quotedMessageId', itemIndex, '') as string;

		const body: IDataObject = {
			chatId,
			latitude,
			longitude,
		};

		if (nameLocation) {
			body.nameLocation = nameLocation;
		}

		if (address) {
			body.address = address;
		}

		if (quotedMessageId) {
			body.quotedMessageId = quotedMessageId;
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/sendLocation/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async sendContact(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const phoneContact = context.getNodeParameter('phoneContact', itemIndex) as string;
		const firstName = context.getNodeParameter('firstName', itemIndex, '') as string;
		const middleName = context.getNodeParameter('middleName', itemIndex, '') as string;
		const lastName = context.getNodeParameter('lastName', itemIndex, '') as string;
		const company = context.getNodeParameter('company', itemIndex, '') as string;
		const quotedMessageId = context.getNodeParameter('quotedMessageId', itemIndex, '') as string;

		const contact: IDataObject = {
			phoneContact,
		};

		if (firstName) {
			contact.firstName = firstName;
		}

		if (middleName) {
			contact.middleName = middleName;
		}

		if (lastName) {
			contact.lastName = lastName;
		}

		if (company) {
			contact.company = company;
		}

		const body: IDataObject = {
			chatId,
			contact,
		};

		if (quotedMessageId) {
			body.quotedMessageId = quotedMessageId;
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/sendContact/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async forwardMessages(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const chatIdFrom = context.getNodeParameter('chatIdFrom', itemIndex) as string;
		const messagesStr = context.getNodeParameter('messages', itemIndex) as string;
		const messages = messagesStr.split(',').map(msg => msg.trim());

		const body: IDataObject = {
			chatId,
			chatIdFrom,
			messages,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/forwardMessages/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async editMessage(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const idMessage = context.getNodeParameter('idMessage', itemIndex) as string;
		const message = context.getNodeParameter('message', itemIndex) as string;

		const body: IDataObject = {
			chatId,
			idMessage,
			message,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/editMessage/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async deleteMessage(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const idMessage = context.getNodeParameter('idMessage', itemIndex) as string;
		const onlySenderDelete = context.getNodeParameter('onlySenderDelete', itemIndex) as boolean;

		const body: IDataObject = {
			chatId,
			idMessage,
		};

		if (onlySenderDelete) {
			body.onlySenderDelete = onlySenderDelete;
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/deleteMessage/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async uploadFile(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const filePath = context.getNodeParameter('filePath', itemIndex) as string;

		const items = context.getInputData();
		const formData: IDataObject = {};

		const binaryPropertyName = 'data';
		const currentItem = items[itemIndex];
		const binaryData = currentItem?.binary;

		if (binaryData && binaryData[binaryPropertyName]) {
			const actualBinaryData = binaryData[binaryPropertyName] as IDataObject;
			formData.file = {
				value: Buffer.from(actualBinaryData.data as string, 'base64'),
				options: {
					filename: actualBinaryData.fileName || 'unknown_file',
				},
			};
		} else {
			const fs = require('fs');
			const path = require('path');
			const fileName = path.basename(filePath);

			try {
				const fileContent = fs.readFileSync(filePath);
				formData.file = {
					value: fileContent,
					options: {
						filename: fileName,
					},
				};
			} catch (readError) {
				throw new NodeOperationError(
					context.getNode(),
					`Failed to read file: ${(readError as Error).message}`,
					{ itemIndex }
				);
			}
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/uploadFile/${apiTokenInstance}`,
			formData,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}
}