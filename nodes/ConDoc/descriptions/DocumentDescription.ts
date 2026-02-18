import { INodeProperties } from 'n8n-workflow';

export const documentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['document'] },
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List documents (paginated)',
				action: 'List documents',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a document with OCR results',
				action: 'Get a document',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a document (soft delete)',
				action: 'Delete a document',
			},
		],
		default: 'list',
	},
];

export const documentFields: INodeProperties[] = [
	// --- List ---
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['document'], operation: ['list'] },
		},
		description: 'Filter by project (required if key is workspace-scoped)',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 1,
		displayOptions: {
			show: { resource: ['document'], operation: ['list'] },
		},
		description: 'Page number',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['document'], operation: ['list'] },
		},
		description: 'Items per page',
	},
	// --- Get ---
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['document'], operation: ['get'] },
		},
		description: 'The document ID',
	},
	// --- Delete ---
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['document'], operation: ['delete'] },
		},
		description: 'The document ID to delete',
	},
];
