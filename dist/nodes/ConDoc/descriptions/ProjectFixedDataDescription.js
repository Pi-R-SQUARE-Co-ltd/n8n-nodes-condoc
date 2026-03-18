"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectFixedDataFields = exports.projectFixedDataOperations = void 0;
exports.projectFixedDataOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: { resource: ['projectFixedData'] },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get project fixed data (customFieldJson)',
                action: 'Get project fixed data',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update project fixed data (customFieldJson)',
                action: 'Update project fixed data',
            },
        ],
        default: 'get',
    },
];
exports.projectFixedDataFields = [
    // --- Get ---
    {
        displayName: 'Project Name or ID',
        name: 'projectId',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getProjects' },
        default: '',
        required: true,
        displayOptions: {
            show: { resource: ['projectFixedData'], operation: ['get'] },
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
            show: { resource: ['projectFixedData'], operation: ['update'] },
        },
        description: 'The project ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Custom Field JSON',
        name: 'customFieldJson',
        type: 'json',
        default: '{}',
        required: true,
        displayOptions: {
            show: { resource: ['projectFixedData'], operation: ['update'] },
        },
        description: 'The custom field data object',
    },
];
