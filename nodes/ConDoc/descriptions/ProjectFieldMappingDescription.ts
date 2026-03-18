import { INodeProperties } from 'n8n-workflow';

export const projectFieldMappingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['projectFieldMapping'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get project field mapping configuration',
				action: 'Get project field mapping',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update project field mapping configuration',
				action: 'Update project field mapping',
			},
		],
		default: 'get',
	},
];

export const projectFieldMappingFields: INodeProperties[] = [
	// --- Get ---
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectFieldMapping'], operation: ['get'] },
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
			show: { resource: ['projectFieldMapping'], operation: ['update'] },
		},
		description: 'The project ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Field Mapping JSON',
		name: 'fieldMappingJson',
		type: 'json',
		default: '[]',
		required: true,
		displayOptions: {
			show: { resource: ['projectFieldMapping'], operation: ['update'] },
		},
		description: 'Array of field mapping rules',
	},
];
