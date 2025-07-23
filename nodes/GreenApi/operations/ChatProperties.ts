// nodes/GreenApi/properties/ChatProperties.ts
import { INodeProperties } from 'n8n-workflow';

export const ChatProperties: INodeProperties[] = [
	// Chat ID for chat operations
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getChatHistory'],
			},
		},
		placeholder: '972501234567@c.us',
		description: 'Chat ID to get history from',
	},
	// Count for chat history
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		default: 100,
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getChatHistory'],
			},
		},
		placeholder: '100',
		description: 'Number of messages to get (default: 100)',
	},
];