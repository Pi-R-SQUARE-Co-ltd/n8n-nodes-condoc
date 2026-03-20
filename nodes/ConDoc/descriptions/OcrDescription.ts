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
	// --- Wait for Result (upload only) ---
	{
		displayName: 'รอผลลัพธ์ (Wait for Result)',
		name: 'waitForResult',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: { resource: ['ocr'], operation: ['upload'] },
		},
		description: 'เมื่อเปิด จะรอจนกว่า OCR จะเสร็จแล้วส่งผลลัพธ์กลับ เมื่อปิด จะส่ง jobId กลับทันที',
	},
	{
		displayName: 'ตรวจสอบทุกกี่วินาที (Poll Interval)',
		name: 'pollInterval',
		type: 'number',
		default: 3,
		typeOptions: { minValue: 1, maxValue: 60 },
		displayOptions: {
			show: { resource: ['ocr'], operation: ['upload'], waitForResult: [true] },
		},
		description: 'จำนวนวินาทีระหว่างการตรวจสอบสถานะ',
	},
	{
		displayName: 'รอสูงสุด (วินาที)',
		name: 'maxWaitTime',
		type: 'number',
		default: 300,
		typeOptions: { minValue: 10, maxValue: 600 },
		displayOptions: {
			show: { resource: ['ocr'], operation: ['upload'], waitForResult: [true] },
		},
		description: 'จำนวนวินาทีสูงสุดที่รอผลลัพธ์ก่อนหมดเวลา (ค่าเริ่มต้น 5 นาที)',
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
