import { INodeProperties } from 'n8n-workflow';

export const ocrOperations: INodeProperties[] = [
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
		],
		default: 'upload',
	},
];

export const ocrFields: INodeProperties[] = [
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
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['ocr'], operation: ['upload'] },
		},
		description: 'Project ID (required if API key is workspace-scoped)',
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
];
