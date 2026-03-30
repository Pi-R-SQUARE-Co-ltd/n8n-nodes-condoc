"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrFields = exports.ocrOperations = void 0;
exports.ocrOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: { resource: ['ocr'] },
        },
        options: [
            {
                name: 'Upload File',
                value: 'upload',
                description: 'Upload a file for OCR processing',
                action: 'Upload a file for OCR processing',
            },
            {
                name: 'Get Job Status',
                value: 'getJobStatus',
                description: 'Get the status and results of an OCR job',
                action: 'Get OCR job status',
            },
            {
                name: 'Get Multiple Job Status',
                value: 'getBatchStatus',
                description: 'Get status of multiple OCR jobs in a single request',
                action: 'Get multiple OCR job status',
            },
        ],
        default: 'upload',
    },
];
exports.ocrFields = [
    // --- Upload ---
    {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        displayOptions: {
            show: { resource: ['ocr'], operation: ['upload'] },
        },
        description: 'The name of the binary property containing the file to upload',
    },
    {
        displayName: 'Project Name or ID',
        name: 'projectId',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getProjects' },
        default: '',
        displayOptions: {
            show: { resource: ['ocr'], operation: ['upload'] },
        },
        description: 'Project ID (required if API key is workspace-scoped). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    // --- Get Job Status ---
    {
        displayName: 'Job ID',
        name: 'jobId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: { resource: ['ocr'], operation: ['getJobStatus'] },
        },
        description: 'The OCR job ID to check',
    },
    // --- Get Multiple Job Status ---
    {
        displayName: 'Job IDs',
        name: 'jobIds',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: { resource: ['ocr'], operation: ['getBatchStatus'] },
        },
        description: 'Comma-separated OCR job IDs or an expression returning an array (max 100)',
    },
];
