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
		displayName: 'Schema Fields',
		name: 'schemaFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		default: {},
		displayOptions: {
			show: { resource: ['projectDefinition'], operation: ['update'] },
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
];
