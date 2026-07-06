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
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		placeholder: '322ebaa0-c200-4f1c-a13c-1804c4d7dd03',
		displayOptions: {
			show: { resource: ['ocr'], operation: ['upload'] },
		},
		description: 'Optional caller-supplied ID (any string — e.g. a partner UUID) stored on the document. You can pass this value to "Get Job Status" / "Get Multiple Job Status" instead of the ConDoc jobId.',
	},
	// --- Get Job Status ---
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'cmpp2fcsu023hc71l0omsb6pr',
		displayOptions: {
			show: { resource: ['ocr'], operation: ['getJobStatus'] },
		},
		description: 'Either the ConDoc OCR jobId (cuid, e.g. "cm...") returned by Upload, or the externalId you passed at upload time.',
	},
	// --- Get Multiple Job Status ---
	{
		displayName: 'Job IDs',
		name: 'jobIds',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'cmpp2fcsu023hc71l0omsb6pr,322ebaa0-c200-4f1c-a13c-1804c4d7dd03',
		displayOptions: {
			show: { resource: ['ocr'], operation: ['getBatchStatus'] },
		},
		description: 'Either ConDoc jobIds (cuid, "cm...") or externalIds passed at upload time. Comma-separated or an expression returning an array (max 100).',
	},
];
