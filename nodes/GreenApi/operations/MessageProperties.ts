// nodes/GreenApi/properties/MessageProperties.ts
import { INodeProperties } from 'n8n-workflow';

export const MessageProperties: INodeProperties[] = [
	// Chat ID field
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: [
					'send',
					'sendFileByUrl',
					'sendPoll',
					'sendLocation',
					'sendContact',
					'forwardMessages',
					'deleteMessage',
					'editMessage',
					'sendFileByUpload',
				],
			},
		},
		placeholder: '972501234567@c.us or 972501234567-1581234048@g.us',
		description: 'Chat ID. For private chat use phone@c.us, for group chat use chatId@g.us.',
	},
	// Message text field
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send', 'sendPoll', 'editMessage'],
			},
		},
		placeholder: 'Enter your message here',
		description: 'Text message to send',
	},
	// File URL field
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByUrl'],
			},
		},
		placeholder: 'https://example.com/image.jpg',
		description: 'URL of the file to send',
	},
	// File name field
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByUrl'],
			},
		},
		placeholder: 'image.jpg',
		description: 'Name of the file to send',
	},
	// Caption field
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByUrl', 'sendFileByUpload'],
			},
		},
		placeholder: 'Enter caption for the file',
		description: 'Caption for the file (optional)',
	},
	// Poll options
	{
		displayName: 'Poll Options',
		name: 'pollOptions',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendPoll'],
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
				resource: ['message'],
				operation: ['sendPoll'],
			},
		},
		description: 'Whether to allow multiple answers in poll',
	},
	// Location fields
	{
		displayName: 'Location Name',
		name: 'nameLocation',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendLocation'],
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
				resource: ['message'],
				operation: ['sendLocation'],
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
				resource: ['message'],
				operation: ['sendLocation'],
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
				resource: ['message'],
				operation: ['sendLocation'],
			},
		},
		placeholder: '10.1112131',
		description: 'Longitude of the location',
	},
	// Contact fields
	{
		displayName: 'Phone Contact',
		name: 'phoneContact',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendContact'],
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
				resource: ['message'],
				operation: ['sendContact'],
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
				resource: ['message'],
				operation: ['sendContact'],
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
				resource: ['message'],
				operation: ['sendContact'],
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
				resource: ['message'],
				operation: ['sendContact'],
			},
		},
		placeholder: 'ABC Corp',
		description: 'Company name of the contact',
	},
	// Forward messages fields
	{
		displayName: 'Chat ID From',
		name: 'chatIdFrom',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['forwardMessages'],
			},
		},
		placeholder: '972501234567@c.us',
		description: 'Chat ID from which the message is being forwarded',
	},
	{
		displayName: 'Message IDs',
		name: 'messages',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['forwardMessages'],
			},
		},
		placeholder: 'BAE587FA1CECF760,BAE5608BC86F2B59',
		description: 'IDs of messages to forward, comma-separated',
	},
	// File upload fields
	{
		displayName: 'File Path',
		name: 'filePath',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['uploadFile', 'sendFileByUpload'],
			},
		},
		placeholder: 'C:/path/to/file.jpg',
		description: 'Path to the file on your system',
	},
	// Edit/Delete message fields
	{
		displayName: 'Message ID',
		name: 'idMessage',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['editMessage', 'deleteMessage'],
			},
		},
		placeholder: 'BAE5367237E13A87',
		description: 'ID of the message to edit/delete',
	},
	{
		displayName: 'Delete for Sender Only',
		name: 'onlySenderDelete',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['deleteMessage'],
			},
		},
		description: 'Whether to delete the message only from sender side',
	},
	// Quoted message field
	{
		displayName: 'Quoted Message ID',
		name: 'quotedMessageId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: [
					'send',
					'sendFileByUrl',
					'sendPoll',
					'sendLocation',
					'sendContact',
					'sendFileByUpload',
				],
			},
		},
		placeholder: '3EB0C767D097B7C7C030',
		description: 'ID of the message to quote (optional)',
	},
];