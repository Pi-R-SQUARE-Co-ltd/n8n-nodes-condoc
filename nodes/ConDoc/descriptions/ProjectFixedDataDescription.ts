import { INodeProperties } from 'n8n-workflow';

export const projectFixedDataOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['projectFixedData'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get project fixed data (customFieldJson)',
				action: 'Get project fixed data',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update project fixed data (customFieldJson)',
				action: 'Update project fixed data',
			},
		],
		default: 'get',
	},
];

export const projectFixedDataFields: INodeProperties[] = [
	// --- Get ---
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectFixedData'], operation: ['get'] },
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
			show: { resource: ['projectFixedData'], operation: ['update'] },
		},
		description: 'The project ID',
	},
	{
		displayName: 'Custom Field JSON',
		name: 'customFieldJson',
		type: 'json',
		default: '{}',
		required: true,
		displayOptions: {
			show: { resource: ['projectFixedData'], operation: ['update'] },
		},
		description: 'The custom field data object',
	},
];
