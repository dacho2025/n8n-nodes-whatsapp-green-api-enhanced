// nodes/GreenApi/properties/ContactProperties.ts
import { INodeProperties } from 'n8n-workflow';

export const ContactProperties: INodeProperties[] = [
	// Group only filter
	{
		displayName: 'Group Only',
		name: 'group',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getContacts'],
			},
		},
		description: 'Whether to only show groups',
	},
	// Count
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getContacts'],
			},
		},
		placeholder: '10',
		description: 'Number of contacts to return (0 for all)',
	},
];