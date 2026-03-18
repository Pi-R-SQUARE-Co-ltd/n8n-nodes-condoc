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
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectDefinition'], operation: ['get'] },
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
			show: { resource: ['projectDefinition'], operation: ['update'] },
		},
		description: 'The project ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
