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
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		displayOptions: {
			show: { resource: ['document'], operation: ['list'] },
		},
		description: 'Filter by project (required if key is workspace-scoped). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
		displayName: 'Document Name or ID',
		name: 'documentId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDocuments' },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['document'], operation: ['get'] },
		},
		description: 'The document to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// --- Delete ---
	{
		displayName: 'Document Name or ID',
		name: 'documentId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDocuments' },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['document'], operation: ['delete'] },
		},
		description: 'The document to delete. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
