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
				name: 'List',
				value: 'list',
				description: 'List all projects in workspace',
				action: 'List projects',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get project details',
				action: 'Get a project',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update project name or description',
				action: 'Update a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project (soft delete)',
				action: 'Delete a project',
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
		displayName: 'Code',
		name: 'code',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['project'], operation: ['create'] },
		},
		description: 'Unique project code within workspace',
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
		displayName: 'Schema JSON',
		name: 'schemaJson',
		type: 'json',
		default: '',
		displayOptions: {
			show: { resource: ['project'], operation: ['create'] },
		},
		description: 'Project schema definition (JSON)',
	},
	// --- Get ---
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['project'], operation: ['get'] },
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
			show: { resource: ['project'], operation: ['update'] },
		},
		description: 'The project ID to update',
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
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['project'], operation: ['delete'] },
		},
		description: 'The project ID to delete',
	},
];
