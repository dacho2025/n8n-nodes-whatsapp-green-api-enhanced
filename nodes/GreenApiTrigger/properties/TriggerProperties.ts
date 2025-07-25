// nodes/GreenApiTrigger/properties/TriggerProperties.ts
import { INodeProperties } from 'n8n-workflow';
import { getEventOptions } from '../../../utils/EventTypes';

export const TriggerProperties: INodeProperties[] = [
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		options: getEventOptions(),
		default: ['message'],
		required: true,
		description: 'Select which Green API events to listen for',
	},
	{
		displayName: 'Download Files',
		name: 'downloadFiles',
		type: 'boolean',
		default: true,
		description: 'Automatically download received files (images, audio, documents)',
	},
	{
		displayName: 'File Types',
		name: 'fileTypes',
		type: 'multiOptions',
		displayOptions: {
			show: {
				downloadFiles: [true],
			},
		},
		options: [
			{
				name: 'Images',
				value: 'image',
			},
			{
				name: 'Audio',
				value: 'audio',
			},
			{
				name: 'Documents',
				value: 'document',
			},
			{
				name: 'Videos',
				value: 'video',
			},
			{
				name: 'Stickers',
				value: 'sticker',
			},
		],
		default: ['image', 'audio', 'document'],
		description: 'Which file types to download',
	},
	{
		displayName: 'Chat Filter',
		name: 'chatFilter',
		type: 'string',
		default: '',
		placeholder: '972501234567@c.us',
		description: 'Filter events from specific chat ID (leave empty for all chats)',
	},
	{
		displayName: 'Sender Filter',
		name: 'senderFilter',
		type: 'string',
		default: '',
		placeholder: '972501234567@c.us',
		description: 'Filter events from specific sender (leave empty for all senders)',
	},
	{
		displayName: 'Advanced Options',
		name: 'advancedOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Instance ID Filter',
				name: 'instanceIdFilter',
				type: 'string',
				default: '',
				placeholder: '1101234567',
				description: 'Filter by specific Green API instance ID',
			},
			{
				displayName: 'Include Quoted Messages',
				name: 'includeQuoted',
				type: 'boolean',
				default: false,
				description: 'Include information about quoted/replied messages',
			},
			{
				displayName: 'Parse Mentions',
				name: 'parseMentions',
				type: 'boolean',
				default: false,
				description: 'Extract and parse @mentions from messages',
			},
			{
				displayName: 'Include Raw Data',
				name: 'includeRawData',
				type: 'boolean',
				default: false,
				description: 'Include raw webhook data in output',
			},
			{
				displayName: 'Timeout (seconds)',
				name: 'timeout',
				type: 'number',
				default: 30,
				description: 'Timeout for file downloads in seconds',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		options: [
			{
				displayName: 'Keyword Filter',
				name: 'keywords',
				type: 'string',
				default: '',
				placeholder: 'help, support, order',
				description: 'Comma-separated keywords to filter messages (case-insensitive)',
			},
			{
				displayName: 'Message Type Filter',
				name: 'messageTypes',
				type: 'multiOptions',
				options: [
					{ name: 'Text Messages', value: 'textMessage' },
					{ name: 'Image Messages', value: 'imageMessage' },
					{ name: 'Audio Messages', value: 'audioMessage' },
					{ name: 'Video Messages', value: 'videoMessage' },
					{ name: 'Document Messages', value: 'documentMessage' },
					{ name: 'Voice Messages', value: 'voiceMessage' },
					{ name: 'Contact Messages', value: 'contactMessage' },
					{ name: 'Location Messages', value: 'locationMessage' },
					{ name: 'Poll Messages', value: 'pollMessage' },
					{ name: 'Sticker Messages', value: 'stickerMessage' },
				],
				default: [],
				description: 'Filter by specific message types (empty = all types)',
			},
			{
				displayName: 'Chat Type Filter',
				name: 'chatTypes',
				type: 'options',
				options: [
					{ name: 'All Chats', value: 'all' },
					{ name: 'Private Chats Only', value: 'private' },
					{ name: 'Group Chats Only', value: 'group' },
				],
				default: 'all',
				description: 'Filter by chat type',
			},
			{
				displayName: 'Exclude Bot Messages',
				name: 'excludeBots',
				type: 'boolean',
				default: true,
				description: 'Exclude messages from bots and automated systems',
			},
			{
				displayName: 'Exclude Forwarded',
				name: 'excludeForwarded',
				type: 'boolean',
				default: false,
				description: 'Exclude forwarded messages',
			},
			{
				displayName: 'Min Message Length',
				name: 'minLength',
				type: 'number',
				default: 0,
				description: 'Minimum message length (0 = no limit)',
			},
			{
				displayName: 'Max Message Length',
				name: 'maxLength',
				type: 'number',
				default: 0,
				description: 'Maximum message length (0 = no limit)',
			},
		],
	},
];