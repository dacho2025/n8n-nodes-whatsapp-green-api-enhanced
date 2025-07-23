// utils/EventTypes.ts
import { INodePropertyOptions } from 'n8n-workflow';

export interface GreenApiEvent {
	name: string;
	value: string;
	description: string;
	webhookType: string;
}

export const GREEN_API_EVENTS: GreenApiEvent[] = [
	{
		name: 'Session Status',
		value: 'session.status',
		description: 'WhatsApp session status changes (authorized, not authorized)',
		webhookType: 'stateInstanceChanged',
	},
	{
		name: 'Message',
		value: 'message',
		description: 'Any incoming message (text, media, location, etc.)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Message Reaction',
		value: 'message.reaction',
		description: 'Reactions to messages (emojis)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Any Message',
		value: 'message.any',
		description: 'Any message event (incoming or outgoing)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Message ACK',
		value: 'message.ack',
		description: 'Message delivery acknowledgments',
		webhookType: 'outgoingMessageStatus',
	},
	{
		name: 'Message Waiting',
		value: 'message.waiting',
		description: 'Messages waiting to be sent',
		webhookType: 'outgoingMessageStatus',
	},
	{
		name: 'Message Revoked',
		value: 'message.revoked',
		description: 'Messages that were deleted/revoked',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'State Change',
		value: 'state.change',
		description: 'Instance state changes',
		webhookType: 'stateInstanceChanged',
	},
	{
		name: 'Group Join',
		value: 'group.join',
		description: 'Someone joined a group (legacy)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Group Leave',
		value: 'group.leave',
		description: 'Someone left a group (legacy)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Group V2 Join',
		value: 'group.v2.join',
		description: 'Someone joined a group (new format)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Group V2 Leave',
		value: 'group.v2.leave',
		description: 'Someone left a group (new format)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Group V2 Update',
		value: 'group.v2.update',
		description: 'Group settings updated (name, description, etc.)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Group V2 Participants',
		value: 'group.v2.participants',
		description: 'Group participants changed (added/removed)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Presence Update',
		value: 'presence.update',
		description: 'User presence changes (online, offline, typing)',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Poll Vote',
		value: 'poll.vote',
		description: 'Someone voted in a poll',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Poll Vote Failed',
		value: 'poll.vote.failed',
		description: 'Poll vote failed to register',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Chat Archive',
		value: 'chat.archive',
		description: 'Chat was archived or unarchived',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Call Received',
		value: 'call.received',
		description: 'Incoming call received',
		webhookType: 'incomingCall',
	},
	{
		name: 'Call Accepted',
		value: 'call.accepted',
		description: 'Call was accepted',
		webhookType: 'incomingCall',
	},
	{
		name: 'Call Rejected',
		value: 'call.rejected',
		description: 'Call was rejected',
		webhookType: 'incomingCall',
	},
	{
		name: 'Label Upsert',
		value: 'label.upsert',
		description: 'Label was created or updated',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Label Deleted',
		value: 'label.deleted',
		description: 'Label was deleted',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Label Chat Added',
		value: 'label.chat.added',
		description: 'Label was added to a chat',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Label Chat Deleted',
		value: 'label.chat.deleted',
		description: 'Label was removed from a chat',
		webhookType: 'incomingMessageReceived',
	},
	{
		name: 'Engine Event',
		value: 'engine.event',
		description: 'Internal engine events and errors',
		webhookType: 'stateInstanceChanged',
	},
	{
		name: 'Device Info',
		value: 'device.info',
		description: 'Device information updates',
		webhookType: 'deviceInfo',
	},
];

export function getEventOptions(): INodePropertyOptions[] {
	return GREEN_API_EVENTS.map(event => ({
		name: event.name,
		value: event.value,
		description: event.description,
	}));
}

export function isValidEvent(eventValue: string): boolean {
	return GREEN_API_EVENTS.some(event => event.value === eventValue);
}

export function getWebhookType(eventValue: string): string | null {
	const event = GREEN_API_EVENTS.find(e => e.value === eventValue);
	return event?.webhookType || null;
}

export function getEventByWebhookType(webhookType: string): GreenApiEvent[] {
	return GREEN_API_EVENTS.filter(event => event.webhookType === webhookType);
}

// Message type constants for filtering
export const MESSAGE_TYPES = {
	TEXT: 'textMessage',
	IMAGE: 'imageMessage',
	AUDIO: 'audioMessage',
	VIDEO: 'videoMessage',
	DOCUMENT: 'documentMessage',
	VOICE: 'voiceMessage',
	CONTACT: 'contactMessage',
	LOCATION: 'locationMessage',
	POLL: 'pollMessage',
	STICKER: 'stickerMessage',
	BUTTON: 'buttonsMessage',
	LIST: 'listMessage',
	TEMPLATE: 'templateMessage',
} as const;

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

// File type constants
export const FILE_TYPES = {
	IMAGE: 'image',
	AUDIO: 'audio',
	VIDEO: 'video',
	DOCUMENT: 'document',
	STICKER: 'sticker',
	VOICE: 'voice',
} as const;

export type FileType = typeof FILE_TYPES[keyof typeof FILE_TYPES];

// Helper function to determine if a message contains media
export function hasMediaFile(messageType: string): boolean {
	const mediaTypes = [
		MESSAGE_TYPES.IMAGE,
		MESSAGE_TYPES.AUDIO,
		MESSAGE_TYPES.VIDEO,
		MESSAGE_TYPES.DOCUMENT,
		MESSAGE_TYPES.STICKER,
		MESSAGE_TYPES.VOICE,
	];
	return mediaTypes.some(type => messageType === type);
}

// Helper function to get file type from message type
export function getFileTypeFromMessageType(messageType: string): FileType | null {
	switch (messageType) {
		case MESSAGE_TYPES.IMAGE:
			return FILE_TYPES.IMAGE;
		case MESSAGE_TYPES.AUDIO:
			return FILE_TYPES.AUDIO;
		case MESSAGE_TYPES.VIDEO:
			return FILE_TYPES.VIDEO;
		case MESSAGE_TYPES.DOCUMENT:
			return FILE_TYPES.DOCUMENT;
		case MESSAGE_TYPES.STICKER:
			return FILE_TYPES.STICKER;
		case MESSAGE_TYPES.VOICE:
			return FILE_TYPES.VOICE;
		default:
			return null;
	}
}