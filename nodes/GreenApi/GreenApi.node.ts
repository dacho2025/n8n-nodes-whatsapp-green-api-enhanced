import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';

export class GreenApi implements INodeType {
	description: INodeTypeDescription = {
		// מידע בסיסי על הנוד
		displayName: 'Green API',
		name: 'greenApi',
		icon: 'file:greenApi.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send WhatsApp messages via Green API',
		defaults: {
			name: 'Green API',
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
			// משאב - מה אנחנו רוצים לעשות
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
				],
				default: 'message',
				required: true,
			},
			// פעולה - איזו פעולה אנחנו רוצים לבצע עם המשאב
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a text message',
						action: 'Send a message',
					},
					{
						name: 'Send File By URL',
						value: 'sendFileByUrl',
						description: 'Send a file from a URL',
						action: 'Send a file from a URL',
					},
				],
				default: 'send',
			},
			// הגדרת מספר הטלפון (חובה)
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'send',
							'sendFileByUrl',
						],
					},
				},
				placeholder: '972501234567',
				description: 'Phone number in international format without + or 00 (e.g. 972501234567)',
			},
			// הגדרת תוכן ההודעה (חובה לפעולת שליחת הודעה)
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'send',
						],
					},
				},
				placeholder: 'Enter your message here',
				description: 'Text message to send',
			},
			// הגדרת כתובת URL לקובץ (חובה לפעולת שליחת קובץ)
			{
				displayName: 'File URL',
				name: 'fileUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendFileByUrl',
						],
					},
				},
				placeholder: 'https://example.com/image.jpg',
				description: 'URL of the file to send',
			},
			// הגדרת שם הקובץ (חובה לפעולת שליחת קובץ)
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendFileByUrl',
						],
					},
				},
				placeholder: 'image.jpg',
				description: 'Name of the file to send',
			},
			// הגדרת כיתוב לקובץ (אופציונלי לפעולת שליחת קובץ)
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				default: '',

				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendFileByUrl',
						],
					},
				},
				placeholder: 'Enter caption for the file',
				description: 'Caption for the file (optional)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		// קבלת האישורים
		const credentials = await this.getCredentials('greenApi');
		const instanceId = credentials.instanceId as string;
		const apiTokenInstance = credentials.apiTokenInstance as string;

		// לולאה על כל פריט שמתקבל כקלט
		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			if (resource === 'message') {
				// הכנת מספר הטלפון
				const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
				const chatId = `${phoneNumber}@c.us`;

				if (operation === 'send') {
					// שליחת הודעת טקסט
					const message = this.getNodeParameter('message', i) as string;

					const options = {
						method: 'POST',
						uri: `https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiTokenInstance}`,
						body: {
							chatId,
							message,
						},
						json: true,
					};

					const responseData = await this.helpers.request(options as JsonObject);
					returnData.push(responseData as IDataObject);
				} else if (operation === 'sendFileByUrl') {
					// שליחת קובץ מכתובת URL
					const fileUrl = this.getNodeParameter('fileUrl', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;
					const caption = this.getNodeParameter('caption', i, '') as string;

					const options = {
						method: 'POST',
						uri: `https://api.green-api.com/waInstance${instanceId}/sendFileByUrl/${apiTokenInstance}`,
						body: {
							chatId,
							urlFile: fileUrl,
							fileName,
							caption,
						},
						json: true,
					};

					const responseData = await this.helpers.request(options as JsonObject);
					returnData.push(responseData as IDataObject);
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
} 