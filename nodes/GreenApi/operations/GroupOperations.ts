// nodes/GreenApi/operations/GroupOperations.ts
import { IExecuteFunctions, IDataObject, JsonObject, NodeOperationError } from 'n8n-workflow';

export class GroupOperations {
	static async execute(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: string,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		switch (operation) {
			case 'createGroup':
				return await this.createGroup(context, itemIndex, instanceId, apiTokenInstance);
			case 'getGroupData':
				return await this.getGroupData(context, itemIndex, instanceId, apiTokenInstance);
			case 'updateGroupName':
				return await this.updateGroupName(context, itemIndex, instanceId, apiTokenInstance);
			case 'addGroupParticipant':
				return await this.addGroupParticipant(context, itemIndex, instanceId, apiTokenInstance);
			case 'removeGroupParticipant':
				return await this.removeGroupParticipant(context, itemIndex, instanceId, apiTokenInstance);
			case 'setGroupAdmin':
				return await this.setGroupAdmin(context, itemIndex, instanceId, apiTokenInstance);
			case 'removeAdmin':
				return await this.removeAdmin(context, itemIndex, instanceId, apiTokenInstance);
			case 'setGroupPicture':
				return await this.setGroupPicture(context, itemIndex, instanceId, apiTokenInstance);
			case 'leaveGroup':
				return await this.leaveGroup(context, itemIndex, instanceId, apiTokenInstance);
			default:
				throw new NodeOperationError(context.getNode(), `Unknown group operation: ${operation}`);
		}
	}

	private static async createGroup(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupName = context.getNodeParameter('groupName', itemIndex) as string;
		const chatIdsStr = context.getNodeParameter('chatIds', itemIndex) as string;
		const chatIds = chatIdsStr.split(',').map(id => id.trim());

		const body: IDataObject = {
			groupName,
			chatIds,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/createGroup/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async getGroupData(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupId = context.getNodeParameter('groupId', itemIndex) as string;

		const body: IDataObject = {
			groupId,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/getGroupData/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async updateGroupName(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupId = context.getNodeParameter('groupId', itemIndex) as string;
		const groupName = context.getNodeParameter('groupName', itemIndex) as string;

		const body: IDataObject = {
			groupId,
			groupName,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/updateGroupName/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async addGroupParticipant(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupId = context.getNodeParameter('groupId', itemIndex) as string;
		const participantChatId = context.getNodeParameter('participantChatId', itemIndex) as string;

		const body: IDataObject = {
			groupId,
			participantChatId,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/addGroupParticipant/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async removeGroupParticipant(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupId = context.getNodeParameter('groupId', itemIndex) as string;
		const participantChatId = context.getNodeParameter('participantChatId', itemIndex) as string;

		const body: IDataObject = {
			groupId,
			participantChatId,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/removeGroupParticipant/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async setGroupAdmin(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupId = context.getNodeParameter('groupId', itemIndex) as string;
		const participantChatId = context.getNodeParameter('participantChatId', itemIndex) as string;

		const body: IDataObject = {
			groupId,
			participantChatId,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/setGroupAdmin/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async removeAdmin(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupId = context.getNodeParameter('groupId', itemIndex) as string;
		const participantChatId = context.getNodeParameter('participantChatId', itemIndex) as string;

		const body: IDataObject = {
			groupId,
			participantChatId,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/removeAdmin/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async setGroupPicture(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupId = context.getNodeParameter('groupId', itemIndex) as string;
		const filePath = context.getNodeParameter('file', itemIndex) as string;

		const items = context.getInputData();
		const formData: IDataObject = {
			groupId,
		};

		// Handle binary data
		const binaryPropertyName = 'data';
		const currentItem = items[itemIndex];
		const binaryData = currentItem?.binary;

		if (binaryData && binaryData[binaryPropertyName]) {
			const actualBinaryData = binaryData[binaryPropertyName] as IDataObject;
			formData.file = {
				value: Buffer.from(actualBinaryData.data as string, 'base64'),
				options: {
					filename: actualBinaryData.fileName || 'group_image.jpg',
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
					`Failed to read group image file: ${(readError as Error).message}`,
					{ itemIndex }
				);
			}
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/setGroupPicture/${apiTokenInstance}`,
			formData,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}

	private static async leaveGroup(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const groupId = context.getNodeParameter('groupId', itemIndex) as string;

		const body: IDataObject = {
			groupId,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/leaveGroup/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}
}