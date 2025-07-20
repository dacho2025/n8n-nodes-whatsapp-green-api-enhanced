"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreenApi = void 0;
class GreenApi {
    constructor() {
        this.name = 'greenApi';
        this.displayName = 'Green API';
        this.documentationUrl = 'https://green-api.com/docs/';
        this.properties = [
            {
                displayName: 'Instance ID',
                name: 'instanceId',
                type: 'string',
                default: '',
                required: true,
                description: 'Your Green API Instance ID',
            },
            {
                displayName: 'API Token Instance',
                name: 'apiTokenInstance',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Your Green API Token',
            },
        ];
        this.test = {
            request: {
                baseURL: '={{$credentials.instanceId ? `https://api.green-api.com/waInstance${$credentials.instanceId}` : ""}}',
                url: '/getStateInstance/={{$credentials.apiTokenInstance}}',
                method: 'GET',
            },
        };
    }
}
exports.GreenApi = GreenApi;
