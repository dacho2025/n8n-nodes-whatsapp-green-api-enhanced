// nodes/GreenApi/operations/ChatOperations.ts
import { IExecuteFunctions, IDataObject, JsonObject, NodeOperationError } from 'n8n-workflow';

export class ChatOperations {
	static async execute(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: string,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		switch (operation) {
			case 'getChatHistory':
				return await this.getChatHistory(context, itemIndex, instanceId, apiTokenInstance);
			default:
				throw new NodeOperationError(context.getNode(), `Unknown chat operation: ${operation}`);
		}
	}

	private static async getChatHistory(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const chatId = context.getNodeParameter('chatId', itemIndex) as string;
		const count = context.getNodeParameter('count', itemIndex) as number;

		const body: IDataObject = {
			chatId,
			count,
		};

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/getChatHistory/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}
}