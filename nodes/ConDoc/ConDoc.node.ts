import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { conDocApiRequest, conDocApiFileUpload } from './GenericFunctions';

import { ocrOperations, ocrFields } from './descriptions/OcrDescription';
import { documentOperations, documentFields } from './descriptions/DocumentDescription';
import { creditOperations, creditFields } from './descriptions/CreditDescription';
import { usageOperations, usageFields } from './descriptions/UsageDescription';
import { projectOperations, projectFields } from './descriptions/ProjectDescription';
import { projectSettingsOperations, projectSettingsFields } from './descriptions/ProjectSettingsDescription';
import { projectDefinitionOperations, projectDefinitionFields } from './descriptions/ProjectDefinitionDescription';
import { projectFixedDataOperations, projectFixedDataFields } from './descriptions/ProjectFixedDataDescription';
import { projectFieldMappingOperations, projectFieldMappingFields } from './descriptions/ProjectFieldMappingDescription';

export class ConDoc implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ConDoc',
		name: 'conDoc',
		icon: 'file:condoc.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the ConDoc OCR External API',
		defaults: {
			name: 'ConDoc',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'conDocApi',
				required: true,
			},
		],
		properties: [
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'OCR', value: 'ocr' },
					{ name: 'Document', value: 'document' },
					{ name: 'Credit', value: 'credit' },
					{ name: 'Usage', value: 'usage' },
					{ name: 'Project', value: 'project' },
					{ name: 'Project Settings', value: 'projectSettings' },
					{ name: 'Project Definition', value: 'projectDefinition' },
					{ name: 'Project Fixed Data', value: 'projectFixedData' },
					{ name: 'Project Field Mapping', value: 'projectFieldMapping' },
				],
				default: 'ocr',
			},
			// Operations & fields for each resource
			...ocrOperations,
			...ocrFields,
			...documentOperations,
			...documentFields,
			...creditOperations,
			...creditFields,
			...usageOperations,
			...usageFields,
			...projectOperations,
			...projectFields,
			...projectSettingsOperations,
			...projectSettingsFields,
			...projectDefinitionOperations,
			...projectDefinitionFields,
			...projectFixedDataOperations,
			...projectFixedDataFields,
			...projectFieldMappingOperations,
			...projectFieldMappingFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				// ─── OCR ───
				if (resource === 'ocr') {
					if (operation === 'upload') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = await conDocApiFileUpload.call(
							this,
							i,
							projectId || undefined,
						);
					} else if (operation === 'getJobStatus') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await conDocApiRequest.call(this, 'GET', `/ocr/${jobId}`);
					}
				}

				// ─── Document ───
				else if (resource === 'document') {
					if (operation === 'list') {
						const qs: Record<string, string | number> = {};
						const projectId = this.getNodeParameter('projectId', i) as string;
						const page = this.getNodeParameter('page', i) as number;
						const limit = this.getNodeParameter('limit', i) as number;
						if (projectId) qs.projectId = projectId;
						if (page) qs.page = page;
						if (limit) qs.limit = limit;
						responseData = await conDocApiRequest.call(this, 'GET', '/documents', {}, qs);
					} else if (operation === 'get') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						responseData = await conDocApiRequest.call(this, 'GET', `/documents/${documentId}`);
					} else if (operation === 'delete') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						responseData = await conDocApiRequest.call(this, 'DELETE', `/documents/${documentId}`);
					}
				}

				// ─── Credit ───
				else if (resource === 'credit') {
					if (operation === 'getBalance') {
						responseData = await conDocApiRequest.call(this, 'GET', '/credits/balance');
					}
				}

				// ─── Usage ───
				else if (resource === 'usage') {
					if (operation === 'getSummary') {
						const qs: Record<string, string | number> = {};
						const from = this.getNodeParameter('from', i) as string;
						const to = this.getNodeParameter('to', i) as string;
						if (from) qs.from = from;
						if (to) qs.to = to;
						responseData = await conDocApiRequest.call(this, 'GET', '/usage', {}, qs);
					} else if (operation === 'getDaily') {
						const days = this.getNodeParameter('days', i) as number;
						const qs: Record<string, string | number> = {};
						if (days) qs.days = days;
						responseData = await conDocApiRequest.call(this, 'GET', '/usage/daily', {}, qs);
					}
				}

				// ─── Project ───
				else if (resource === 'project') {
					if (operation === 'create') {
						const body: Record<string, any> = {
							name: this.getNodeParameter('name', i) as string,
							code: this.getNodeParameter('code', i) as string,
						};
						const description = this.getNodeParameter('description', i) as string;
						const schemaJson = this.getNodeParameter('schemaJson', i) as string;
						if (description) body.description = description;
						if (schemaJson) {
							body.schemaJson = typeof schemaJson === 'string' ? JSON.parse(schemaJson) : schemaJson;
						}
						responseData = await conDocApiRequest.call(this, 'POST', '/projects', body);
					} else if (operation === 'list') {
						responseData = await conDocApiRequest.call(this, 'GET', '/projects');
					} else if (operation === 'get') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = await conDocApiRequest.call(this, 'GET', `/projects/${projectId}`);
					} else if (operation === 'update') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const body: Record<string, any> = {};
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						if (name) body.name = name;
						if (description) body.description = description;
						responseData = await conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}`, body);
					} else if (operation === 'delete') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = await conDocApiRequest.call(this, 'DELETE', `/projects/${projectId}`);
					}
				}

				// ─── Project Settings ───
				else if (resource === 'projectSettings') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					if (operation === 'get') {
						responseData = await conDocApiRequest.call(this, 'GET', `/projects/${projectId}/settings`);
					} else if (operation === 'update') {
						const settingsJson = this.getNodeParameter('settingsJson', i) as string;
						const body = typeof settingsJson === 'string' ? JSON.parse(settingsJson) : settingsJson;
						responseData = await conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}/settings`, body);
					}
				}

				// ─── Project Definition ───
				else if (resource === 'projectDefinition') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					if (operation === 'get') {
						responseData = await conDocApiRequest.call(this, 'GET', `/projects/${projectId}/definition`);
					} else if (operation === 'update') {
						const schemaJson = this.getNodeParameter('schemaJson', i) as string;
						const body = {
							schemaJson: typeof schemaJson === 'string' ? JSON.parse(schemaJson) : schemaJson,
						};
						responseData = await conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}/definition`, body);
					}
				}

				// ─── Project Fixed Data ───
				else if (resource === 'projectFixedData') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					if (operation === 'get') {
						responseData = await conDocApiRequest.call(this, 'GET', `/projects/${projectId}/fixed-data`);
					} else if (operation === 'update') {
						const customFieldJson = this.getNodeParameter('customFieldJson', i) as string;
						const body = {
							customFieldJson: typeof customFieldJson === 'string' ? JSON.parse(customFieldJson) : customFieldJson,
						};
						responseData = await conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}/fixed-data`, body);
					}
				}

				// ─── Project Field Mapping ───
				else if (resource === 'projectFieldMapping') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					if (operation === 'get') {
						responseData = await conDocApiRequest.call(this, 'GET', `/projects/${projectId}/field-mapping`);
					} else if (operation === 'update') {
						const fieldMappingJson = this.getNodeParameter('fieldMappingJson', i) as string;
						const body = {
							fieldMappingJson: typeof fieldMappingJson === 'string' ? JSON.parse(fieldMappingJson) : fieldMappingJson,
						};
						responseData = await conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}/field-mapping`, body);
					}
				}

				// Normalize output
				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item) => ({ json: item })));
				} else if (responseData !== undefined) {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
