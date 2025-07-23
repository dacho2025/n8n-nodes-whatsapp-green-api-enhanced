"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreenApiTrigger = void 0;
// nodes/GreenApiTrigger/GreenApiTrigger.node.ts
const n8n_workflow_1 = require("n8n-workflow");
const TriggerProperties_1 = require("./properties/TriggerProperties");
const EventTypes_1 = require("../../utils/EventTypes");
class GreenApiTrigger {
    constructor() {
        this.description = {
            displayName: 'Green API Trigger',
            name: 'greenApiTrigger',
            icon: 'file:greenApi.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["events"].join(", ")}}',
            description: 'Enhanced WhatsApp trigger with file support and advanced filtering',
            defaults: {
                name: 'Green API Trigger',
            },
            inputs: [],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'greenApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: TriggerProperties_1.TriggerProperties,
        };
    }
    async webhook() {
        var _a;
        const headerData = this.getHeaderData();
        const bodyData = this.getBodyData();
        // Get node parameters
        const events = this.getNodeParameter('events');
        const downloadFiles = this.getNodeParameter('downloadFiles', true);
        const fileTypes = this.getNodeParameter('fileTypes', ['image', 'audio', 'document']);
        const chatFilter = this.getNodeParameter('chatFilter', '');
        const senderFilter = this.getNodeParameter('senderFilter', '');
        // Advanced options
        const advancedOptions = this.getNodeParameter('advancedOptions', {});
        const instanceIdFilter = advancedOptions.instanceIdFilter || '';
        const includeQuoted = advancedOptions.includeQuoted || false;
        const parseMentions = advancedOptions.parseMentions || false;
        const includeRawData = advancedOptions.includeRawData || false;
        // Filters
        const filters = this.getNodeParameter('filters', {});
        const keywords = filters.keywords || '';
        const messageTypes = filters.messageTypes || [];
        const chatTypes = filters.chatTypes || 'all';
        const excludeBots = (_a = filters.excludeBots) !== null && _a !== void 0 ? _a : true;
        const excludeForwarded = filters.excludeForwarded || false;
        const minLength = filters.minLength || 0;
        const maxLength = filters.maxLength || 0;
        // Validate webhook data
        if (!bodyData || !bodyData.typeWebhook) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: 'Invalid webhook data - missing typeWebhook',
                description: 'This does not appear to be a valid Green API webhook',
            });
        }
        const webhookType = bodyData.typeWebhook;
        const messageData = bodyData.messageData;
        const instanceData = bodyData.instanceData;
        // Filter by events
        const isEventMatch = events.some(event => {
            if (!(0, EventTypes_1.isValidEvent)(event))
                return false;
            return (0, EventTypes_1.getWebhookType)(event) === webhookType;
        });
        if (!isEventMatch) {
            return { noWebhookResponse: true };
        }
        // Filter by instance ID
        if (instanceIdFilter && (instanceData === null || instanceData === void 0 ? void 0 : instanceData.idInstance) !== instanceIdFilter) {
            return { noWebhookResponse: true };
        }
        // Filter by chat ID
        if (chatFilter && (messageData === null || messageData === void 0 ? void 0 : messageData.chatId) !== chatFilter) {
            return { noWebhookResponse: true };
        }
        // Filter by sender
        if (senderFilter && (messageData === null || messageData === void 0 ? void 0 : messageData.senderId) !== senderFilter) {
            return { noWebhookResponse: true };
        }
        // Filter by chat type
        if (chatTypes !== 'all' && (messageData === null || messageData === void 0 ? void 0 : messageData.chatId)) {
            const isGroup = messageData.chatId.includes('@g.us');
            if (chatTypes === 'group' && !isGroup)
                return { noWebhookResponse: true };
            if (chatTypes === 'private' && isGroup)
                return { noWebhookResponse: true };
        }
        // Filter by message type
        if (messageTypes.length > 0 && (messageData === null || messageData === void 0 ? void 0 : messageData.typeMessage)) {
            if (!messageTypes.includes(messageData.typeMessage)) {
                return { noWebhookResponse: true };
            }
        }
        let returnData = {
            event: webhookType,
            timestamp: new Date().toISOString(),
            instanceId: (instanceData === null || instanceData === void 0 ? void 0 : instanceData.idInstance) || null,
        };
        try {
            // Process message data if available
            if (messageData) {
                // Extract message text inline
                const messageText = extractMessageText(messageData);
                // Apply text-based filters
                if (keywords) {
                    const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
                    const hasKeyword = keywordList.some(keyword => messageText.toLowerCase().includes(keyword));
                    if (!hasKeyword) {
                        return { noWebhookResponse: true };
                    }
                }
                // Bot filter
                if (excludeBots && isBotMessage(messageText)) {
                    return { noWebhookResponse: true };
                }
                // Forwarded filter
                if (excludeForwarded && messageData.quotedMessage) {
                    return { noWebhookResponse: true };
                }
                // Length filters
                if (minLength > 0 && messageText.length < minLength) {
                    return { noWebhookResponse: true };
                }
                if (maxLength > 0 && messageText.length > maxLength) {
                    return { noWebhookResponse: true };
                }
                // Process message
                const messageDataObj = {
                    messageId: messageData.idMessage,
                    chatId: messageData.chatId,
                    senderId: messageData.senderId,
                    senderName: messageData.senderName,
                    textMessage: messageText,
                    timestamp: messageData.timestamp,
                    type: messageData.typeMessage,
                    isGroup: (messageData.chatId || '').includes('@g.us'),
                };
                returnData.messageData = messageDataObj;
                // Process quoted message if requested
                if (includeQuoted && messageData.quotedMessage) {
                    const quotedMessage = messageData.quotedMessage;
                    returnData.messageData.quotedMessage = {
                        messageId: quotedMessage.stanzaId,
                        text: quotedMessage.textMessage,
                        type: quotedMessage.typeMessage,
                    };
                }
                // Parse mentions if requested
                if (parseMentions) {
                    returnData.messageData.mentions = extractMentions(messageText);
                }
                // Add basic file info if available (no download in trigger)
                if (hasFileMessage(messageData)) {
                    returnData.hasFile = true;
                    returnData.fileType = messageData.typeMessage;
                }
            }
            // Add instance data
            if (instanceData) {
                returnData.instance = {
                    id: instanceData.idInstance,
                    webhookUrl: instanceData.webhookUrl,
                    senderData: instanceData.senderData,
                };
            }
            // Add raw data if requested
            if (includeRawData) {
                returnData.rawData = bodyData;
            }
            // Add headers
            returnData.headers = headerData;
        }
        catch (error) {
            returnData.error = error.message;
        }
        return {
            workflowData: [
                [
                    {
                        json: returnData,
                    },
                ],
            ],
        };
    }
}
exports.GreenApiTrigger = GreenApiTrigger;
// Helper functions outside the class
function extractMessageText(messageData) {
    // Try different possible text fields
    const textSources = [
        messageData.textMessage,
        messageData.text,
        messageData.caption,
    ];
    // Check for nested text data
    const textMessageData = messageData.textMessageData;
    if (textMessageData) {
        textSources.unshift(textMessageData.textMessage);
    }
    // Check for image/video/document caption
    const imageData = messageData.imageMessageData;
    if (imageData === null || imageData === void 0 ? void 0 : imageData.caption) {
        textSources.unshift(imageData.caption);
    }
    const videoData = messageData.videoMessageData;
    if (videoData === null || videoData === void 0 ? void 0 : videoData.caption) {
        textSources.unshift(videoData.caption);
    }
    const documentData = messageData.documentMessageData;
    if (documentData === null || documentData === void 0 ? void 0 : documentData.caption) {
        textSources.unshift(documentData.caption);
    }
    // Return first non-empty text found
    for (const source of textSources) {
        if (source && typeof source === 'string' && source.trim()) {
            return source.trim();
        }
    }
    return '';
}
function isBotMessage(messageText) {
    const botIndicators = [
        'bot', 'automated', 'auto-reply', 'automatic',
        'אוטומטי', 'בוט', 'רובוט', 'אוטומטית'
    ];
    const lowerText = messageText.toLowerCase();
    return botIndicators.some(indicator => lowerText.includes(indicator));
}
function extractMentions(messageText) {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(messageText)) !== null) {
        mentions.push(match[1]);
    }
    return mentions;
}
function hasFileMessage(messageData) {
    const fileTypes = [
        'imageMessage',
        'audioMessage',
        'videoMessage',
        'documentMessage',
        'voiceMessage',
        'stickerMessage'
    ];
    return fileTypes.includes(messageData.typeMessage);
}
