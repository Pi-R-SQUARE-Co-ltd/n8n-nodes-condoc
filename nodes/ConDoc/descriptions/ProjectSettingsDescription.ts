import { INodeProperties } from 'n8n-workflow';

export const projectSettingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['projectSettings'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get project general settings',
				action: 'Get project settings',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update project general settings',
				action: 'Update project settings',
			},
		],
		default: 'get',
	},
];

export const projectSettingsFields: INodeProperties[] = [
	// --- Get ---
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectSettings'], operation: ['get'] },
		},
		description: 'The project ID',
	},
	// --- Update ---
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectSettings'], operation: ['update'] },
		},
		description: 'The project ID',
	},
	{
		displayName: 'Settings JSON',
		name: 'settingsJson',
		type: 'json',
		default: '{}',
		required: true,
		displayOptions: {
			show: { resource: ['projectSettings'], operation: ['update'] },
		},
		description: 'Settings object with fields to update (e.g. ocrWebhookUrl, processingMode, isSave, isMapping)',
	},
];
