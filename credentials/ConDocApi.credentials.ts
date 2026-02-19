import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ConDocApi implements ICredentialType {
	name = 'conDocApi';
	displayName = 'ConDoc API';
	documentationUrl = 'https://docs.condoc.ai';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.condoc.ai',
			placeholder: 'https://api.condoc.ai',
			description: 'The base URL of your ConDoc instance (without trailing slash)',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your ConDoc API key (starts with cdoc_)',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/external/credits/balance',
			method: 'GET',
		},
	};
}
