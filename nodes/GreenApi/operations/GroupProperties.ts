// nodes/GreenApi/properties/GroupProperties.ts
import { INodeProperties } from 'n8n-workflow';

export const GroupProperties: INodeProperties[] = [
	// Group name
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup', 'updateGroupName'],
			},
		},
		placeholder: 'My New Group',
		description: 'Name for the group',
	},
	// Group participants for creation
	{
		displayName: 'Group Participants',
		name: 'chatIds',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
		placeholder: '972501234567@c.us,972501234568@c.us',
		description: 'Comma-separated list of chat IDs to add to the group',
	},
	// Group ID
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
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
	// Participant chat ID
	{
		displayName: 'Participant Chat ID',
		name: 'participantChatId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
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
	// Group image
	{
		displayName: 'Group Image',
		name: 'file',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['setGroupPicture'],
			},
		},
		placeholder: 'C:/path/to/image.jpg',
		description: 'Path to the JPG image for the group',
	},
];