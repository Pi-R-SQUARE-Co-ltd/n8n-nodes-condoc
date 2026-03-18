"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConDocApi = void 0;
class ConDocApi {
    constructor() {
        this.name = 'conDocApi';
        this.displayName = 'ConDoc API';
        this.documentationUrl = 'https://docs.condoc.ai';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-API-Key': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/api/v1/external/credits/balance',
                method: 'GET',
            },
        };
    }
}
exports.ConDocApi = ConDocApi;
