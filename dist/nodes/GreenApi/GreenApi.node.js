"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreenApi = void 0;
// nodes/GreenApi/GreenApi.node.ts
const n8n_workflow_1 = require("n8n-workflow");
const MessageOperations_1 = require("./operations/MessageOperations");
const GroupOperations_1 = require("./operations/GroupOperations");
const ChatOperations_1 = require("./operations/ChatOperations");
const ContactOperations_1 = require("./operations/ContactOperations");
// Import Properties that exist
const GroupProperties_1 = require("./properties/GroupProperties");
const ContactProperties_1 = require("./properties/ContactProperties");
class GreenApi {
    constructor() {
        this.description = {
            displayName: 'Green API Enhanced',
            name: 'greenApi',
            icon: 'file:greenApi.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Enhanced WhatsApp automation via Green API with advanced features and file support',
            defaults: {
                name: 'Green API Enhanced',
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
                // Main Resource Selection
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Message',
                            value: 'message',
                            description: 'Send and manage WhatsApp messages',
                        },
                        {
                            name: 'Group',
                            value: 'group',
                            description: 'Manage WhatsApp groups',
                        },
                        {
                            name: 'Chat',
                            value: 'chat',
                            description: 'Get chat information and history',
                        },
                        {
                            name: 'Contact',
                            value: 'contact',
                            description: 'Manage contacts and get contact lists',
                        },
                    ],
                    default: 'message',
                    required: true,
                    description: 'The resource to operate on',
                },
                // Message Operations
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
                            name: 'Send Text',
                            value: 'send',
                            description: 'Send a text message',
                            action: 'Send a text message',
                        },
                        {
                            name: 'Send File by URL',
                            value: 'sendFileByUrl',
                            description: 'Send a file from a URL',
                            action: 'Send a file from a URL',
                        },
                        {
                            name: 'Send File by Upload',
                            value: 'sendFileByUpload',
                            description: 'Send a file by uploading it',
                            action: 'Send a file by uploading it',
                        },
                        {
                            name: 'Send Poll',
                            value: 'sendPoll',
                            description: 'Send a poll message',
                            action: 'Send a poll message',
                        },
                        {
                            name: 'Send Location',
                            value: 'sendLocation',
                            description: 'Send a location message',
                            action: 'Send a location message',
                        },
                        {
                            name: 'Send Contact',
                            value: 'sendContact',
                            description: 'Send a contact message',
                            action: 'Send a contact message',
                        },
                        {
                            name: 'Forward Messages',
                            value: 'forwardMessages',
                            description: 'Forward messages to a chat',
                            action: 'Forward messages to a chat',
                        },
                        {
                            name: 'Edit Message',
                            value: 'editMessage',
                            description: 'Edit a text message',
                            action: 'Edit a text message',
                        },
                        {
                            name: 'Delete Message',
                            value: 'deleteMessage',
                            description: 'Delete a message from chat',
                            action: 'Delete a message from chat',
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
                // Group Operations
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
                        {
                            name: 'Update Group Name',
                            value: 'updateGroupName',
                            description: 'Update the group name',
                            action: 'Update the group name',
                        },
                        {
                            name: 'Add Participant',
                            value: 'addGroupParticipant',
                            description: 'Add a participant to a group',
                            action: 'Add a participant to a group',
                        },
                        {
                            name: 'Remove Participant',
                            value: 'removeGroupParticipant',
                            description: 'Remove a participant from a group',
                            action: 'Remove a participant from a group',
                        },
                        {
                            name: 'Set Admin',
                            value: 'setGroupAdmin',
                            description: 'Set a participant as a group admin',
                            action: 'Set a participant as a group admin',
                        },
                        {
                            name: 'Remove Admin',
                            value: 'removeAdmin',
                            description: 'Remove admin rights from a participant',
                            action: 'Remove admin rights from a participant',
                        },
                        {
                            name: 'Set Group Picture',
                            value: 'setGroupPicture',
                            description: 'Set a picture for a group',
                            action: 'Set a picture for a group',
                        },
                        {
                            name: 'Leave Group',
                            value: 'leaveGroup',
                            description: 'Leave a group',
                            action: 'Leave a group',
                        },
                    ],
                    default: 'createGroup',
                },
                // Chat Operations
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
                // Contact Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['contact'],
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
                // Include Properties that exist
                ...GroupProperties_1.GroupProperties,
                ...ContactProperties_1.ContactProperties,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        // Get credentials
        const credentials = await this.getCredentials('greenApi');
        const instanceId = credentials.instanceId;
        const apiTokenInstance = credentials.apiTokenInstance;
        // Process each input item
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            try {
                let responseData;
                switch (resource) {
                    case 'message':
                        responseData = await MessageOperations_1.MessageOperations.execute(this, i, operation, instanceId, apiTokenInstance);
                        break;
                    case 'group':
                        responseData = await GroupOperations_1.GroupOperations.execute(this, i, operation, instanceId, apiTokenInstance);
                        break;
                    case 'chat':
                        responseData = await ChatOperations_1.ChatOperations.execute(this, i, operation, instanceId, apiTokenInstance);
                        break;
                    case 'contact':
                        responseData = await ContactOperations_1.ContactOperations.execute(this, i, operation, instanceId, apiTokenInstance);
                        break;
                    default:
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
                }
                // Ensure responseData is an object
                if (responseData && typeof responseData === 'object') {
                    returnData.push(responseData);
                }
                else {
                    returnData.push({ result: responseData });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                            resource,
                            operation,
                            timestamp: new Date().toISOString(),
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
