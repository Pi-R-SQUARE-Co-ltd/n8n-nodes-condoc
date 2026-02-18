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
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['projectFieldMapping'], operation: ['get'] },
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
			show: { resource: ['projectFieldMapping'], operation: ['update'] },
		},
		description: 'The project ID',
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
