import { INodeProperties } from 'n8n-workflow';

export const usageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['usage'] },
		},
		options: [
			{
				name: 'Get Summary',
				value: 'getSummary',
				description: 'Get API usage summary',
				action: 'Get usage summary',
			},
			{
				name: 'Get Daily',
				value: 'getDaily',
				description: 'Get daily API usage breakdown',
				action: 'Get daily usage',
			},
		],
		default: 'getSummary',
	},
];

export const usageFields: INodeProperties[] = [
	// --- Get Summary ---
	{
		displayName: 'From',
		name: 'from',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['usage'], operation: ['getSummary'] },
		},
		description: 'Start date (ISO 8601)',
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['usage'], operation: ['getSummary'] },
		},
		description: 'End date (ISO 8601)',
	},
	// --- Get Daily ---
	{
		displayName: 'Days',
		name: 'days',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 365 },
		default: 30,
		displayOptions: {
			show: { resource: ['usage'], operation: ['getDaily'] },
		},
		description: 'Number of days to retrieve',
	},
];
