import {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  NodeConnectionType,
} from 'n8n-workflow';

export class GreenApiTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Green API Trigger',
    name: 'greenApiTrigger',
    group: ['trigger'],
    version: 1,
    description: 'Listen for incoming WhatsApp messages via Green API webhooks',
    defaults: {
      name: 'Green API Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'green-api',
      },
    ],
    properties: [
      {
        displayName: 'Event Types',
        name: 'events',
        type: 'multiOptions',
        options: [
          { name: 'All Messages', value: 'message' },
          { name: 'Session Status', value: 'sessionStatus' },
          { name: 'Message Status', value: 'messageStatus' },
          { name: 'State Change', value: 'stateChange' },
        ],
        default: ['message'],
        description: 'Select which webhook events to listen for',
        required: true,
      },
      {
        displayName: 'Filter by Chat',
        name: 'chatFilter',
        type: 'string',
        default: '',
        placeholder: '972501234567@c.us',
        description: 'Filter messages by specific chat ID (optional)',
      },
      {
        displayName: 'Filter by Message Type',
        name: 'messageTypeFilter',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Text Messages Only', value: 'textMessage' },
          { name: 'Image Messages Only', value: 'imageMessage' },
          { name: 'Video Messages Only', value: 'videoMessage' },
          { name: 'Audio Messages Only', value: 'audioMessage' },
          { name: 'Document Messages Only', value: 'documentMessage' },
        ],
        default: '',
        description: 'Filter by specific message types',
      },
      {
        displayName: 'Keyword Filter',
        name: 'keywordFilter',
        type: 'string',
        default: '',
        placeholder: 'help, order, support',
        description: 'Comma-separated keywords to filter messages (case-insensitive)',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const body = this.getBodyData();
    
    // Get node parameters
    const events = this.getNodeParameter('events') as string[];
    const chatFilter = this.getNodeParameter('chatFilter') as string;
    const messageTypeFilter = this.getNodeParameter('messageTypeFilter') as string;
    const keywordFilter = this.getNodeParameter('keywordFilter') as string;

    try {
      if (!body || typeof body !== 'object') {
        return {
          webhookResponse: {
            status: 400,
            body: 'Invalid webhook payload',
          },
        };
      }

      const webhookData = body as any;
      const webhookType = webhookData.typeWebhook;
      const messageData = webhookData.messageData;

      // Filter by event type
      if (!isEventTypeMatch(webhookType, events)) {
        return {
          webhookResponse: {
            status: 200,
            body: 'Event type filtered - ignored',
          },
        };
      }

      // Filter by chat ID if specified
      if (chatFilter && messageData?.chatId !== chatFilter) {
        return {
          webhookResponse: {
            status: 200,
            body: 'Chat filter - ignored',
          },
        };
      }

      // Filter by message type if specified
      if (messageTypeFilter && !isMessageTypeMatch(messageData, messageTypeFilter)) {
        return {
          webhookResponse: {
            status: 200,
            body: 'Message type filter - ignored',
          },
        };
      }

      // Filter by keywords if specified
      if (keywordFilter && !isKeywordMatch(messageData, keywordFilter)) {
        return {
          webhookResponse: {
            status: 200,
            body: 'Keyword filter - ignored',
          },
        };
      }

      // Process the webhook data
      const outputData = {
        webhook_type: webhookType,
        timestamp: new Date().toISOString(),
        message: messageData || null,
        raw_data: webhookData,
      };

      return {
        workflowData: [this.helpers.returnJsonArray([outputData])],
        webhookResponse: {
          status: 200,
          body: 'OK',
        },
      };

    } catch (error) {
      return {
        webhookResponse: {
          status: 500,
          body: `Error processing webhook: ${(error as Error).message}`,
        },
      };
    }
  }
}

function isEventTypeMatch(webhookType: string, allowedEvents: string[]): boolean {
  const eventMap: { [key: string]: string[] } = {
    'message': ['incomingMessageReceived', 'outgoingMessageReceived'],
    'sessionStatus': ['stateInstanceChanged'],
    'messageStatus': ['outgoingMessageStatus'],
    'stateChange': ['stateInstanceChanged'],
  };

  for (const event of allowedEvents) {
    if (eventMap[event]?.includes(webhookType)) {
      return true;
    }
  }

  return false;
}

function isMessageTypeMatch(messageData: any, messageType: string): boolean {
  if (!messageData || !messageType) return true;
  return messageData.typeMessage === messageType;
}

function isKeywordMatch(messageData: any, keywords: string): boolean {
  if (!messageData || !keywords) return true;

  const messageText = messageData.textMessageData?.textMessage?.toLowerCase() || '';
  const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());

  return keywordList.some(keyword => messageText.includes(keyword));
}