import { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['project'] },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project (soft delete)',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get project details',
				action: 'Get a project',
			},
			{
				name: 'Get Many',
				value: 'list',
				description: 'Retrieve all projects in workspace',
				action: 'Get many projects',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update project name or description',
				action: 'Update a project',
			},
		],
		default: 'list',
	},
];

export const projectFields: INodeProperties[] = [
	// --- Create ---
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['project'], operation: ['create'] },
		},
		description: 'Project name',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['project'], operation: ['create'] },
		},
		description: 'Project description',
	},
	{
		displayName: 'Schema Fields',
		name: 'schemaFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		default: {},
		displayOptions: {
			show: { resource: ['project'], operation: ['create'] },
		},
		description: 'Define the fields to extract from documents (automatically converted to JSON Schema)',
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Field Name',
						name: 'fieldName',
						type: 'string',
						default: '',
						required: true,
						description: 'Field name to extract, e.g. company_name, tax_id',
					},
					{
						displayName: 'Data Type',
						name: 'fieldType',
						type: 'options',
						default: 'string',
						options: [
							{ name: 'Date', value: 'date' },
							{ name: 'Email', value: 'email' },
							{ name: 'Number', value: 'number' },
							{ name: 'Table (Multiple Items)', value: 'array' },
							{ name: 'Text', value: 'string' },
						],
						description: 'The data type that this field stores',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Describe what this field represents, e.g. "Buyer company name", "Grand total amount"',
					},
					{
						displayName: 'Table Columns',
						name: 'subFields',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						displayOptions: {
							show: {
								fieldType: ['array'],
							},
						},
						description: 'Define the columns within the table',
						options: [
							{
								displayName: 'Columns',
								name: 'columns',
								values: [
									{
										displayName: 'Column Name',
										name: 'name',
										type: 'string',
										default: '',
										required: true,
										description: 'Column name, e.g. product_name, quantity',
									},
									{
										displayName: 'Type',
										name: 'type',
										type: 'options',
										default: 'string',
										options: [
											{ name: 'Date', value: 'date' },
											{ name: 'Email', value: 'email' },
											{ name: 'Number', value: 'number' },
											{ name: 'Text', value: 'string' },
										],
										description: 'The data type for this column',
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['project'], operation: ['create'] },
		},
		description: 'Project code — if left empty, one will be auto-generated',
	},
	// --- Get ---
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['project'], operation: ['get'] },
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
			show: { resource: ['project'], operation: ['update'] },
		},
		description: 'The project ID to update. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['project'], operation: ['update'] },
		},
		description: 'New project name',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['project'], operation: ['update'] },
		},
		description: 'New project description',
	},
	// --- Delete ---
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['project'], operation: ['delete'] },
		},
		description: 'The project ID to delete. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
