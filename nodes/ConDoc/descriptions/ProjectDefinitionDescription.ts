import { INodeProperties } from 'n8n-workflow';

export const projectDefinitionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['projectDefinition'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get project schema definition',
				action: 'Get project definition',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update project schema definition',
				action: 'Update project definition',
			},
		],
		default: 'get',
	},
];

export const projectDefinitionFields: INodeProperties[] = [
	// --- Get ---
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectDefinition'], operation: ['get'] },
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
			show: { resource: ['projectDefinition'], operation: ['update'] },
		},
		description: 'The project ID',
	},
	{
		displayName: 'Schema JSON',
		name: 'schemaJson',
		type: 'json',
		default: '{}',
		required: true,
		displayOptions: {
			show: { resource: ['projectDefinition'], operation: ['update'] },
		},
		description: 'The schema definition object',
	},
];
