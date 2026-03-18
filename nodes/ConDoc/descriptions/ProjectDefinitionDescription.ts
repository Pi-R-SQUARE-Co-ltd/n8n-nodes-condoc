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
						displayName: 'คอลัมน์ในตาราง',
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
						description: 'กำหนดคอลัมน์ภายในตาราง',
						options: [
							{
								displayName: 'คอลัมน์',
								name: 'columns',
								values: [
									{
										displayName: 'ชื่อคอลัมน์',
										name: 'name',
										type: 'string',
										default: '',
										required: true,
										description: 'ชื่อคอลัมน์ เช่น product_name, quantity',
									},
									{
										displayName: 'ประเภท',
										name: 'type',
										type: 'options',
										default: 'string',
										options: [
											{ name: 'ข้อความ', value: 'string' },
											{ name: 'ตัวเลข', value: 'number' },
											{ name: 'วันที่', value: 'date' },
											{ name: 'อีเมล', value: 'email' },
										],
										description: 'ประเภทข้อมูลของคอลัมน์นี้',
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
