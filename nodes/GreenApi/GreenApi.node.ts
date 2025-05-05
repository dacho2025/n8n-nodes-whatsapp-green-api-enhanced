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
						name: 'Forward Messages',
						value: 'forwardMessages',
						description: 'Forward messages to a chat',
						action: 'Forward messages to a chat',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send a text message',
						action: 'Send a message',
					},
					{
						name: 'Send Contact',
						value: 'sendContact',
						description: 'Send a contact message',
						action: 'Send a contact message',
					},
					{
						name: 'Send File By URL',
						value: 'sendFileByUrl',
						description: 'Send a file from a URL',
						action: 'Send a file from a URL',
					},
					{
						name: 'Send Location',
						value: 'sendLocation',
						description: 'Send a location message',
						action: 'Send a location message',
					},
					{
						name: 'Send Poll',
						value: 'sendPoll',
						description: 'Send a poll message',
						action: 'Send a poll message',
					},
				],
				default: 'send',
			},
			// הגדרת Chat ID
			{
				displayName: 'Chat ID',
				name: 'chatId',
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
							'sendPoll',
							'sendLocation',
							'sendContact',
							'forwardMessages',
						],
					},
				},
				placeholder: '972501234567@c.us or 972501234567-1581234048@g.us',
				description: 'Chat ID. For private chat use phone@c.us, for group chat use chatId@g.us.',
			},
			// הגדרת מקור Chat ID להעברת הודעות
			{
				displayName: 'Chat ID From',
				name: 'chatIdFrom',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'forwardMessages',
						],
					},
				},
				placeholder: '972501234567@c.us',
				description: 'Chat ID from which the message is being forwarded',
			},
			// הגדרת רשימת הודעות להעברה
			{
				displayName: 'Message IDs',
				name: 'messages',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'forwardMessages',
						],
					},
				},
				placeholder: 'BAE587FA1CECF760,BAE5608BC86F2B59',
				description: 'IDs of messages to forward, comma-separated',
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
							'sendPoll',
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
			// הגדרות סקר
			{
				displayName: 'Poll Options',
				name: 'pollOptions',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendPoll',
						],
					},
				},
				placeholder: 'option1,option2,option3',
				description: 'Poll options, comma-separated (2-12 options)',
			},
			{
				displayName: 'Multiple Answers',
				name: 'multipleAnswers',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendPoll',
						],
					},
				},
				description: 'Whether to allow multiple answers in poll',
			},
			// הגדרות שליחת מיקום
			{
				displayName: 'Location Name',
				name: 'nameLocation',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendLocation',
						],
					},
				},
				placeholder: 'Restaurant',
				description: 'Name of the location',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendLocation',
						],
					},
				},
				placeholder: '123456, Perm',
				description: 'Address of the location',
			},
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendLocation',
						],
					},
				},
				placeholder: '12.3456789',
				description: 'Latitude of the location',
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendLocation',
						],
					},
				},
				placeholder: '10.1112131',
				description: 'Longitude of the location',
			},
			// הגדרות שליחת איש קשר
			{
				displayName: 'Phone Contact',
				name: 'phoneContact',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendContact',
						],
					},
				},
				placeholder: '79001234567',
				description: 'Phone number of the contact in international format (no +)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendContact',
						],
					},
				},
				placeholder: 'John',
				description: 'First name of the contact',
			},
			{
				displayName: 'Middle Name',
				name: 'middleName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendContact',
						],
					},
				},
				placeholder: 'M',
				description: 'Middle name of the contact',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendContact',
						],
					},
				},
				placeholder: 'Doe',
				description: 'Last name of the contact',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendContact',
						],
					},
				},
				placeholder: 'ABC Corp',
				description: 'Company name of the contact',
			},
			// הגדרת ID להודעה מצוטטת
			{
				displayName: 'Quoted Message ID',
				name: 'quotedMessageId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'send',
							'sendFileByUrl',
							'sendPoll',
							'sendLocation',
							'sendContact',
						],
					},
				},
				placeholder: '3EB0C767D097B7C7C030',
				description: 'ID of the message to quote (optional)',
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
				// הכנת chatId - כבר לא מוסיף באופן אוטומטי @c.us
				const chatId = this.getNodeParameter('chatId', i) as string;
				const quotedMessageId = this.getNodeParameter('quotedMessageId', i, '') as string;

				if (operation === 'send') {
					// שליחת הודעת טקסט
					const message = this.getNodeParameter('message', i) as string;

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

					const responseData = await this.helpers.request(options as JsonObject);
					returnData.push(responseData as IDataObject);
				} else if (operation === 'sendFileByUrl') {
					// שליחת קובץ מכתובת URL
					const fileUrl = this.getNodeParameter('fileUrl', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;
					const caption = this.getNodeParameter('caption', i, '') as string;

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

					const responseData = await this.helpers.request(options as JsonObject);
					returnData.push(responseData as IDataObject);
				} else if (operation === 'sendPoll') {
					// שליחת סקר
					const message = this.getNodeParameter('message', i) as string;
					const pollOptionsStr = this.getNodeParameter('pollOptions', i) as string;
					const multipleAnswers = this.getNodeParameter('multipleAnswers', i) as boolean;

					// המרת אפשרויות הסקר לפורמט המתאים
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

					const responseData = await this.helpers.request(options as JsonObject);
					returnData.push(responseData as IDataObject);
				} else if (operation === 'sendLocation') {
					// שליחת מיקום
					const nameLocation = this.getNodeParameter('nameLocation', i, '') as string;
					const address = this.getNodeParameter('address', i, '') as string;
					const latitude = this.getNodeParameter('latitude', i) as number;
					const longitude = this.getNodeParameter('longitude', i) as number;

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

					const responseData = await this.helpers.request(options as JsonObject);
					returnData.push(responseData as IDataObject);
				} else if (operation === 'sendContact') {
					// שליחת איש קשר
					const phoneContact = this.getNodeParameter('phoneContact', i) as string;
					const firstName = this.getNodeParameter('firstName', i, '') as string;
					const middleName = this.getNodeParameter('middleName', i, '') as string;
					const lastName = this.getNodeParameter('lastName', i, '') as string;
					const company = this.getNodeParameter('company', i, '') as string;

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

					const responseData = await this.helpers.request(options as JsonObject);
					returnData.push(responseData as IDataObject);
				} else if (operation === 'forwardMessages') {
					// העברת הודעות
					const chatIdFrom = this.getNodeParameter('chatIdFrom', i) as string;
					const messagesStr = this.getNodeParameter('messages', i) as string;
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

					const responseData = await this.helpers.request(options as JsonObject);
					returnData.push(responseData as IDataObject);
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
} 