import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

// הוספת הרחבה לממשק INodeTypeDescription
declare module 'n8n-workflow' {
	interface INodeTypeDescription {
		usableAsTool?: boolean;
	}
}

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
		usableAsTool: true,
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
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Contact',
						value: 'contact',
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
						name: 'Delete Message',
						value: 'deleteMessage',
						description: 'Delete a message from chat',
						action: 'Delete a message from chat',
					},
					{
						name: 'Edit Message',
						value: 'editMessage',
						description: 'Edit a text message',
						action: 'Edit a text message',
					},
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
						name: 'Send File By Upload',
						value: 'sendFileByUpload',
						description: 'Send a file by uploading it',
						action: 'Send a file by uploading it',
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
					{
						name: 'Upload File',
						value: 'uploadFile',
						description: 'Upload a file to cloud storage',
						action: 'Upload a file to cloud storage',
					},
				],
				default: 'send',
			},
			// הגדרת פעולות לקבוצות
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'group',
						],
					},
				},
				options: [
					{
						name: 'Add Group Participant',
						value: 'addGroupParticipant',
						description: 'Add a participant to a group',
						action: 'Add a participant to a group',
					},
					{
						name: 'Create Group',
						value: 'createGroup',
						description: 'Create a new group',
						action: 'Create a new group',
					},
					{
						name: 'Get Group Data',
						value: 'getGroupData',
						description: 'Get information about a group',
						action: 'Get information about a group',
					},
					{
						name: 'Leave Group',
						value: 'leaveGroup',
						description: 'Leave a group',
						action: 'Leave a group',
					},
					{
						name: 'Remove Admin',
						value: 'removeAdmin',
						description: 'Remove admin rights from a participant',
						action: 'Remove admin rights from a participant',
					},
					{
						name: 'Remove Group Participant',
						value: 'removeGroupParticipant',
						description: 'Remove a participant from a group',
						action: 'Remove a participant from a group',
					},
					{
						name: 'Set Group Admin',
						value: 'setGroupAdmin',
						description: 'Set a participant as a group admin',
						action: 'Set a participant as a group admin',
					},
					{
						name: 'Set Group Picture',
						value: 'setGroupPicture',
						description: 'Set a picture for a group',
						action: 'Set a picture for a group',
					},
					{
						name: 'Update Group Name',
						value: 'updateGroupName',
						description: 'Update the group name',
						action: 'Update the group name',
					},
				],
				default: 'createGroup',
			},
			// הגדרת פעולות לצ'אט
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'chat',
						],
					},
				},
				options: [
					{
						name: 'Get Chat History',
						value: 'getChatHistory',
						description: 'Get the history of a chat',
						action: 'Get the history of a chat',
					},
				],
				default: 'getChatHistory',
			},
			// הגדרת פעולות לאנשי קשר
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'contact',
						],
					},
				},
				options: [
					{
						name: 'Get Contacts',
						value: 'getContacts',
						description: 'Get list of contacts',
						action: 'Get list of contacts',
					},
				],
				default: 'getContacts',
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

			// פרמטרים עבור פעולות חדשות - Upload File
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'uploadFile',
							'sendFileByUpload',
						],
					},
				},
				placeholder: 'C:/path/to/file.jpg',
				description: 'Path to the file on your system',
			},
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
							'sendFileByUpload',
						],
					},
				},
				placeholder: 'Enter caption for the file',
				description: 'Caption for the file (optional)',
			},

			// פרמטרים עבור EditMessage
			{
				displayName: 'Message ID',
				name: 'idMessage',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'editMessage',
							'deleteMessage',
						],
					},
				},
				placeholder: 'BAE5367237E13A87',
				description: 'ID of the message to edit/delete',
			},
			{
				displayName: 'New Message',
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
							'editMessage',
						],
					},
				},
				placeholder: 'Updated message text',
				description: 'The updated text for the message',
			},

			// פרמטר לDeleteMessage
			{
				displayName: 'Delete for Sender Only',
				name: 'onlySenderDelete',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'deleteMessage',
						],
					},
				},
				description: 'Whether to delete the message only from sender side',
			},

			// פרמטרים לקבלת היסטוריית צ'אט
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'chat',
						],
						operation: [
							'getChatHistory',
						],
					},
				},
				placeholder: '972501234567@c.us',
				description: 'Chat ID to get history from',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 100,
				displayOptions: {
					show: {
						resource: [
							'chat',
						],
						operation: [
							'getChatHistory',
						],
					},
				},
				placeholder: '100',
				description: 'Number of messages to get (default: 100)',
			},

			// פרמטרים עבור פעולות קבוצה
			{
				displayName: 'Group Name',
				name: 'groupName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'group',
						],
						operation: [
							'createGroup',
							'updateGroupName',
						],
					},
				},
				placeholder: 'My New Group',
				description: 'Name for the group',
			},
			{
				displayName: 'Group Participants',
				name: 'chatIds',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'group',
						],
						operation: [
							'createGroup',
						],
					},
				},
				placeholder: '972501234567@c.us,972501234568@c.us',
				description: 'Comma-separated list of chat IDs to add to the group',
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'group',
						],
						operation: [
							'updateGroupName',
							'getGroupData',
							'addGroupParticipant',
							'removeGroupParticipant',
							'setGroupAdmin',
							'removeAdmin',
							'setGroupPicture',
							'leaveGroup',
						],
					},
				},
				placeholder: '972501234567-1587570015@g.us',
				description: 'Group ID to perform action on',
			},
			{
				displayName: 'Participant Chat ID',
				name: 'participantChatId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'group',
						],
						operation: [
							'addGroupParticipant',
							'removeGroupParticipant',
							'setGroupAdmin',
							'removeAdmin',
						],
					},
				},
				placeholder: '972501234567@c.us',
				description: 'Chat ID of the participant to perform action on',
			},
			{
				displayName: 'Group Image',
				name: 'file',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'group',
						],
						operation: [
							'setGroupPicture',
						],
					},
				},
				placeholder: 'C:/path/to/image.jpg',
				description: 'Path to the JPG image for the group',
			},

			// פרמטרים להבאת אנשי קשר
			{
				displayName: 'Group Only',
				name: 'group',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: [
							'contact',
						],
						operation: [
							'getContacts',
						],
					},
				},
				description: 'Whether to only show groups',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: [
							'contact',
						],
						operation: [
							'getContacts',
						],
					},
				},
				placeholder: '10',
				description: 'Number of contacts to return (0 for all)',
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

				try {
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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to send message: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to send file: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to send poll: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to send location: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to send contact: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to forward messages: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'uploadFile') {
						// העלאת קובץ
						const filePath = this.getNodeParameter('filePath', i) as string;

						// שימוש במימוש אחר להעלאת קבצים
						const formData: IDataObject = {};

						const binaryPropertyName = 'data';
						const items = this.getInputData();

						const currentItem = items[i];
						const binaryData = currentItem?.binary;

						if (binaryData && binaryData[binaryPropertyName]) {
							// אם יש כבר מידע בינארי בקלט, השתמש בו
							const actualBinaryData = binaryData[binaryPropertyName] as IDataObject;
							formData.file = {
								value: Buffer.from(actualBinaryData.data as string, 'base64'),
								options: {
									filename: actualBinaryData.fileName || 'unknown_file',
								},
							};
						} else {
							// אחרת קרא את הקובץ מהמערכת
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
									this.getNode(),
									`Failed to read file: ${readError.message}`,
									{ itemIndex: i }
								);
							}
						}

						const options = {
							method: 'POST',
							uri: `https://api.green-api.com/waInstance${instanceId}/uploadFile/${apiTokenInstance}`,
							formData,
							json: true,
						};

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to upload file: ${error.message}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'sendFileByUpload') {
						// שליחת קובץ באמצעות העלאה
						const filePath = this.getNodeParameter('filePath', i) as string;
						const caption = this.getNodeParameter('caption', i, '') as string;

						// שימוש במימוש אחר להעלאת קבצים
						const formData: IDataObject = {
							chatId,
							caption,
						};

						if (quotedMessageId) {
							formData.quotedMessageId = quotedMessageId;
						}

						const binaryPropertyName = 'data';
						const items = this.getInputData();

						const currentItem = items[i];
						const binaryData = currentItem?.binary;

						if (binaryData && binaryData[binaryPropertyName]) {
							// אם יש כבר מידע בינארי בקלט, השתמש בו
							const actualBinaryData = binaryData[binaryPropertyName] as IDataObject;
							formData.file = {
								value: Buffer.from(actualBinaryData.data as string, 'base64'),
								options: {
									filename: actualBinaryData.fileName || 'unknown_file',
								},
							};
						} else {
							// אחרת קרא את הקובץ מהמערכת
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
									this.getNode(),
									`Failed to read file: ${readError.message}`,
									{ itemIndex: i }
								);
							}
						}

						const options = {
							method: 'POST',
							uri: `https://api.green-api.com/waInstance${instanceId}/sendFileByUpload/${apiTokenInstance}`,
							formData,
							json: true,
						};

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to send file by upload: ${error.message}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'deleteMessage') {
						// מחיקת הודעה
						const idMessage = this.getNodeParameter('idMessage', i) as string;
						const onlySenderDelete = this.getNodeParameter('onlySenderDelete', i) as boolean;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to delete message: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'editMessage') {
						// עריכת הודעה
						const idMessage = this.getNodeParameter('idMessage', i) as string;
						const message = this.getNodeParameter('message', i) as string;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to edit message: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					}
				} catch (error) {
					// העברת השגיאה עם מידע נוסף
					if (error.name === 'NodeOperationError') {
						throw error;
					}

					// אחרת נוסיף מידע כללי
					throw new NodeOperationError(
						this.getNode(),
						`Error processing operation ${operation}: ${error.message}`,
						{ itemIndex: i }
					);
				}
			} else if (resource === 'chat') {
				try {
					if (operation === 'getChatHistory') {
						// קבלת היסטוריית צ'אט
						const chatId = this.getNodeParameter('chatId', i) as string;
						const count = this.getNodeParameter('count', i) as number;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to get chat history: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					}
				} catch (error) {
					// העברת השגיאה עם מידע נוסף
					if (error.name === 'NodeOperationError') {
						throw error;
					}

					// אחרת נוסיף מידע כללי
					throw new NodeOperationError(
						this.getNode(),
						`Error processing chat operation ${operation}: ${error.message}`,
						{ itemIndex: i }
					);
				}
			} else if (resource === 'group') {
				try {
					if (operation === 'createGroup') {
						// יצירת קבוצה
						const groupName = this.getNodeParameter('groupName', i) as string;
						const chatIdsStr = this.getNodeParameter('chatIds', i) as string;
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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to create group: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'updateGroupName') {
						// עדכון שם קבוצה
						const groupId = this.getNodeParameter('groupId', i) as string;
						const groupName = this.getNodeParameter('groupName', i) as string;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to update group name: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'getGroupData') {
						// קבלת נתוני קבוצה
						const groupId = this.getNodeParameter('groupId', i) as string;

						const body: IDataObject = {
							groupId,
						};

						const options = {
							method: 'POST',
							uri: `https://api.green-api.com/waInstance${instanceId}/getGroupData/${apiTokenInstance}`,
							body,
							json: true,
						};

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to get group data: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'addGroupParticipant') {
						// הוספת משתתף לקבוצה
						const groupId = this.getNodeParameter('groupId', i) as string;
						const participantChatId = this.getNodeParameter('participantChatId', i) as string;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to add group participant: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'removeGroupParticipant') {
						// הסרת משתתף מקבוצה
						const groupId = this.getNodeParameter('groupId', i) as string;
						const participantChatId = this.getNodeParameter('participantChatId', i) as string;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to remove group participant: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'setGroupAdmin') {
						// הגדרת מנהל קבוצה
						const groupId = this.getNodeParameter('groupId', i) as string;
						const participantChatId = this.getNodeParameter('participantChatId', i) as string;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to set group admin: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'removeAdmin') {
						// הסרת מנהל קבוצה
						const groupId = this.getNodeParameter('groupId', i) as string;
						const participantChatId = this.getNodeParameter('participantChatId', i) as string;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to remove admin: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'setGroupPicture') {
						// הגדרת תמונת קבוצה
						const groupId = this.getNodeParameter('groupId', i) as string;
						const filePath = this.getNodeParameter('file', i) as string;

						// שימוש במימוש אחר להעלאת קבצים
						const formData: IDataObject = {
							groupId,
						};

						const binaryPropertyName = 'data';
						const items = this.getInputData();

						const currentItem = items[i];
						const binaryData = currentItem?.binary;

						if (binaryData && binaryData[binaryPropertyName]) {
							// אם יש כבר מידע בינארי בקלט, השתמש בו
							const actualBinaryData = binaryData[binaryPropertyName] as IDataObject;
							formData.file = {
								value: Buffer.from(actualBinaryData.data as string, 'base64'),
								options: {
									filename: actualBinaryData.fileName || 'unknown_file',
								},
							};
						} else {
							// אחרת קרא את הקובץ מהמערכת
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
									this.getNode(),
									`Failed to read file: ${readError.message}`,
									{ itemIndex: i }
								);
							}
						}

						const options = {
							method: 'POST',
							uri: `https://api.green-api.com/waInstance${instanceId}/setGroupPicture/${apiTokenInstance}`,
							formData,
							json: true,
						};

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to set group picture: ${error.message}`,
								{ itemIndex: i }
							);
						}
					} else if (operation === 'leaveGroup') {
						// יציאה מקבוצה
						const groupId = this.getNodeParameter('groupId', i) as string;

						const body: IDataObject = {
							groupId,
						};

						const options = {
							method: 'POST',
							uri: `https://api.green-api.com/waInstance${instanceId}/leaveGroup/${apiTokenInstance}`,
							body,
							json: true,
						};

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to leave group: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					}
				} catch (error) {
					// העברת השגיאה עם מידע נוסף
					if (error.name === 'NodeOperationError') {
						throw error;
					}

					// אחרת נוסיף מידע כללי
					throw new NodeOperationError(
						this.getNode(),
						`Error processing group operation ${operation}: ${error.message}`,
						{ itemIndex: i }
					);
				}
			} else if (resource === 'contact') {
				try {
					if (operation === 'getContacts') {
						// קבלת אנשי קשר
						const onlyGroups = this.getNodeParameter('group', i) as boolean;
						const count = this.getNodeParameter('count', i) as number;

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

						try {
							const responseData = await this.helpers.request(options as JsonObject);
							returnData.push(responseData as IDataObject);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to get contacts: ${error.message}\nData sent: ${JSON.stringify(body, null, 2)}`,
								{ itemIndex: i }
							);
						}
					}
				} catch (error) {
					// העברת השגיאה עם מידע נוסף
					if (error.name === 'NodeOperationError') {
						throw error;
					}

					// אחרת נוסיף מידע כללי
					throw new NodeOperationError(
						this.getNode(),
						`Error processing contact operation ${operation}: ${error.message}`,
						{ itemIndex: i }
					);
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
