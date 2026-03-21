"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectFields = exports.projectOperations = void 0;
exports.projectOperations = [
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
exports.projectFields = [
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
                        displayName: 'คำอธิบาย',
                        name: 'description',
                        type: 'string',
                        default: '',
                        description: 'อธิบายว่า field นี้คืออะไร เช่น "ชื่อบริษัทผู้ซื้อ", "จำนวนเงินรวมทั้งหมด"',
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
    {
        displayName: 'Code (ตั้งเอง)',
        name: 'code',
        type: 'string',
        default: '',
        displayOptions: {
            show: { resource: ['project'], operation: ['create'] },
        },
        description: 'รหัสโปรเจกต์ — ถ้าไม่กรอก ระบบจะสร้างให้อัตโนมัติ',
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
