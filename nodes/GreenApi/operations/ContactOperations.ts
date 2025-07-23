// nodes/GreenApi/operations/ContactOperations.ts
import { IExecuteFunctions, IDataObject, JsonObject, NodeOperationError } from 'n8n-workflow';

export class ContactOperations {
	static async execute(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: string,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		switch (operation) {
			case 'getContacts':
				return await this.getContacts(context, itemIndex, instanceId, apiTokenInstance);
			default:
				throw new NodeOperationError(context.getNode(), `Unknown contact operation: ${operation}`);
		}
	}

	private static async getContacts(
		context: IExecuteFunctions,
		itemIndex: number,
		instanceId: string,
		apiTokenInstance: string,
	): Promise<any> {
		const onlyGroups = context.getNodeParameter('group', itemIndex) as boolean;
		const count = context.getNodeParameter('count', itemIndex) as number;

		const body: IDataObject = {};

		if (onlyGroups) {
			body.onlyGroups = true;
		}

		if (count > 0) {
			body.count = count;
		}

		const options = {
			method: 'POST',
			uri: `https://api.green-api.com/waInstance${instanceId}/getContacts/${apiTokenInstance}`,
			body,
			json: true,
		};

		return await context.helpers.request(options as JsonObject);
	}
}