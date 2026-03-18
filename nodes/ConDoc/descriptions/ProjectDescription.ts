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
		description: 'กำหนด field ที่ต้องการดึงจากเอกสาร (ระบบจะแปลงเป็น JSON Schema ให้อัตโนมัติ)',
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'ชื่อ Field',
						name: 'fieldName',
						type: 'string',
						default: '',
						required: true,
						description: 'ชื่อ field ที่ต้องการดึง เช่น company_name, tax_id',
					},
					{
						displayName: 'ประเภทข้อมูล',
						name: 'fieldType',
						type: 'options',
						default: 'string',
						options: [
							{ name: 'ข้อความ', value: 'string' },
							{ name: 'ตัวเลข', value: 'number' },
							{ name: 'วันที่', value: 'date' },
							{ name: 'อีเมล', value: 'email' },
							{ name: 'กลุ่มข้อมูล (Object)', value: 'object' },
							{ name: 'ตาราง (หลายรายการ)', value: 'array' },
						],
						description: 'ประเภทของข้อมูลที่ field นี้เก็บ',
					},
					{
						displayName: 'จำเป็นต้องมี',
						name: 'required',
						type: 'boolean',
						default: false,
						description: 'Whether this field is required in the extracted data',
					},
					{
						displayName: 'Sub-fields (สำหรับกลุ่มข้อมูล/ตาราง)',
						name: 'subFields',
						type: 'json',
						default: '',
						description: 'สำหรับ กลุ่มข้อมูล หรือ ตาราง — ระบุ field ย่อยเป็น JSON เช่น {"item_name": "string", "quantity": "number"}',
					},
				],
			},
		],
	},
	{
		displayName: 'Schema JSON (Advanced)',
		name: 'schemaJson',
		type: 'json',
		default: '',
		displayOptions: {
			show: { resource: ['project'], operation: ['create'] },
		},
		description: 'ใช้แทน Schema Fields ด้านบน — สำหรับผู้เชี่ยวชาญที่ต้องการเขียน JSON Schema เอง (ถ้ากรอกทั้ง 2 ช่อง จะใช้ช่องนี้แทน)',
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
