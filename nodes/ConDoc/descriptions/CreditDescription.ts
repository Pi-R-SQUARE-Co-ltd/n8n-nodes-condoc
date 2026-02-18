import { INodeProperties } from 'n8n-workflow';

export const creditOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['credit'] },
		},
		options: [
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get workspace credit balance',
				action: 'Get credit balance',
			},
		],
		default: 'getBalance',
	},
];

export const creditFields: INodeProperties[] = [];
