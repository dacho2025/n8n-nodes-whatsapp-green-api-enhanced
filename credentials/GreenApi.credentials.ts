import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GreenApi implements ICredentialType {
	name = 'greenApi';
	displayName = 'Green API';
	// תיאור מופיע בחלון הגדרת האישורים
	documentationUrl = 'https://green-api.com/en/docs/';
	properties: INodeProperties[] = [
		{
			displayName: 'Instance ID',
			name: 'instanceId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Green API instance ID',
		},
		{
			displayName: 'API Token',
			name: 'apiTokenInstance',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Green API token',
			typeOptions: {
				password: true,
			},
		},
	];

	// מגדיר איך יתווספו האישורים לכל בקשה
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			// השדות מועברים אוטומטית בכתובת ה-URL של הבקשה
		},
	};

	// בדיקת תקינות האישורים
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.green-api.com',
			url: '/waInstance{{$credentials.instanceId}}/getStateInstance/{{$credentials.apiTokenInstance}}',
		},
	};
} 