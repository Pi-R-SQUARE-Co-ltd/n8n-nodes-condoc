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
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectSettings'], operation: ['get'] },
		},
		description: 'The project ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// --- Update ---
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectSettings'], operation: ['update'] },
		},
		description: 'The project ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
