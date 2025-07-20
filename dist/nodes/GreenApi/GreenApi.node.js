"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreenApi = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class GreenApi {
    constructor() {
        this.description = {
            displayName: 'Green API',
            name: 'greenApi',
            group: ['communication'],
            version: 1,
            description: 'Send WhatsApp messages via Green API',
            defaults: {
                name: 'Green API',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'greenApi',
                    required: true,
                },
            ],
            properties: [
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
                    ],
                    default: 'message',
                    required: true,
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['message'],
                        },
                    },
                    options: [
                        {
                            name: 'Send',
                            value: 'send',
                            description: 'Send a text message',
                            action: 'Send a message',
                        },
                        {
                            name: 'Send File By URL',
                            value: 'sendFileByUrl',
                            description: 'Send a file from a URL',
                            action: 'Send a file from a URL',
                        },
                        {
                            name: 'Send Contact',
                            value: 'sendContact',
                            description: 'Send a contact message',
                            action: 'Send a contact message',
                        },
                        {
                            name: 'Send Location',
                            value: 'sendLocation',
                            description: 'Send a location message',
                            action: 'Send a location message',
                        },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['group'],
                        },
                    },
                    options: [
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
                    ],
                    default: 'createGroup',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['chat'],
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
                {
                    displayName: 'Chat ID',
                    name: 'chatId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['send', 'sendFileByUrl', 'sendContact', 'sendLocation'],
                        },
                    },
                    placeholder: '972501234567@c.us',
                    description: 'Chat ID. For private chat use phone@c.us, for group chat use chatId@g.us.',
                },
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
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['send'],
                        },
                    },
                    placeholder: 'Enter your message here',
                    description: 'Text message to send',
                },
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
                {
                    displayName: 'Caption',
                    name: 'caption',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['sendFileByUrl'],
                        },
                    },
                    placeholder: 'Enter caption for the file',
                    description: 'Caption for the file (optional)',
                },
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
                    placeholder: '32.0853',
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
                    placeholder: '34.7818',
                    description: 'Longitude of the location',
                },
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
                    placeholder: 'Tel Aviv',
                    description: 'Name of the location',
                },
                {
                    displayName: 'Group Name',
                    name: 'groupName',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['createGroup'],
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
                            resource: ['group'],
                            operation: ['createGroup'],
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
                            resource: ['group'],
                            operation: ['getGroupData'],
                        },
                    },
                    placeholder: '972501234567-1587570015@g.us',
                    description: 'Group ID to get information about',
                },
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
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('greenApi');
        const instanceId = credentials.instanceId;
        const apiTokenInstance = credentials.apiTokenInstance;
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            try {
                let responseData;
                if (resource === 'message') {
                    if (operation === 'send') {
                        const chatId = this.getNodeParameter('chatId', i);
                        const message = this.getNodeParameter('message', i);
                        const body = {
                            chatId,
                            message,
                        };
                        const options = {
                            method: 'POST',
                            uri: `https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiTokenInstance}`,
                            body,
                            json: true,
                        };
                        responseData = await this.helpers.request(options);
                    }
                    else if (operation === 'sendFileByUrl') {
                        const chatId = this.getNodeParameter('chatId', i);
                        const fileUrl = this.getNodeParameter('fileUrl', i);
                        const fileName = this.getNodeParameter('fileName', i);
                        const caption = this.getNodeParameter('caption', i, '');
                        const body = {
                            chatId,
                            urlFile: fileUrl,
                            fileName,
                            caption,
                        };
                        const options = {
                            method: 'POST',
                            uri: `https://api.green-api.com/waInstance${instanceId}/sendFileByUrl/${apiTokenInstance}`,
                            body,
                            json: true,
                        };
                        responseData = await this.helpers.request(options);
                    }
                    else if (operation === 'sendContact') {
                        const chatId = this.getNodeParameter('chatId', i);
                        const phoneContact = this.getNodeParameter('phoneContact', i);
                        const firstName = this.getNodeParameter('firstName', i, '');
                        const lastName = this.getNodeParameter('lastName', i, '');
                        const contact = {
                            phoneContact,
                        };
                        if (firstName)
                            contact.firstName = firstName;
                        if (lastName)
                            contact.lastName = lastName;
                        const body = {
                            chatId,
                            contact,
                        };
                        const options = {
                            method: 'POST',
                            uri: `https://api.green-api.com/waInstance${instanceId}/sendContact/${apiTokenInstance}`,
                            body,
                            json: true,
                        };
                        responseData = await this.helpers.request(options);
                    }
                    else if (operation === 'sendLocation') {
                        const chatId = this.getNodeParameter('chatId', i);
                        const latitude = this.getNodeParameter('latitude', i);
                        const longitude = this.getNodeParameter('longitude', i);
                        const nameLocation = this.getNodeParameter('nameLocation', i, '');
                        const body = {
                            chatId,
                            latitude,
                            longitude,
                        };
                        if (nameLocation)
                            body.nameLocation = nameLocation;
                        const options = {
                            method: 'POST',
                            uri: `https://api.green-api.com/waInstance${instanceId}/sendLocation/${apiTokenInstance}`,
                            body,
                            json: true,
                        };
                        responseData = await this.helpers.request(options);
                    }
                }
                else if (resource === 'group') {
                    if (operation === 'createGroup') {
                        const groupName = this.getNodeParameter('groupName', i);
                        const chatIdsStr = this.getNodeParameter('chatIds', i);
                        const chatIds = chatIdsStr.split(',').map(id => id.trim());
                        const body = {
                            groupName,
                            chatIds,
                        };
                        const options = {
                            method: 'POST',
                            uri: `https://api.green-api.com/waInstance${instanceId}/createGroup/${apiTokenInstance}`,
                            body,
                            json: true,
                        };
                        responseData = await this.helpers.request(options);
                    }
                    else if (operation === 'getGroupData') {
                        const groupId = this.getNodeParameter('groupId', i);
                        const body = {
                            groupId,
                        };
                        const options = {
                            method: 'POST',
                            uri: `https://api.green-api.com/waInstance${instanceId}/getGroupData/${apiTokenInstance}`,
                            body,
                            json: true,
                        };
                        responseData = await this.helpers.request(options);
                    }
                }
                else if (resource === 'chat') {
                    if (operation === 'getChatHistory') {
                        const chatId = this.getNodeParameter('chatId', i);
                        const count = this.getNodeParameter('count', i);
                        const body = {
                            chatId,
                            count,
                        };
                        const options = {
                            method: 'POST',
                            uri: `https://api.green-api.com/waInstance${instanceId}/getChatHistory/${apiTokenInstance}`,
                            body,
                            json: true,
                        };
                        responseData = await this.helpers.request(options);
                    }
                }
                returnData.push(responseData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                            resource,
                            operation,
                        },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error in ${resource} ${operation}: ${error.message}`, { itemIndex: i });
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.GreenApi = GreenApi;
