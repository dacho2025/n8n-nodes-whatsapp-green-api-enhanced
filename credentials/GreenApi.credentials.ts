import {
  ICredentialType,
  INodeProperties,
  ICredentialTestRequest,
} from 'n8n-workflow';

export class GreenApi implements ICredentialType {
  name = 'greenApi';
  displayName = 'Green API';
  documentationUrl = 'https://green-api.com/docs/';
  
  properties: INodeProperties[] = [
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

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.instanceId ? `https://api.green-api.com/waInstance${$credentials.instanceId}` : ""}}',
      url: '/getStateInstance/={{$credentials.apiTokenInstance}}',
      method: 'GET',
    },
  };
}