import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { conDocApiRequest, conDocApiFileUpload, conDocApiSimpleOcrUpload, flattenOcrResult, getProjects, getDocuments } from './GenericFunctions';

import { ocrOperations, ocrFields } from './descriptions/OcrDescription';
import { documentOperations, documentFields } from './descriptions/DocumentDescription';
import { simpleOcrOperations, simpleOcrFields } from './descriptions/SimpleOcrDescription';

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
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
					{ name: 'Document', value: 'document' },
					{ name: 'OCR', value: 'ocr' },
					{ name: 'Simple OCR', value: 'simpleOcr' },
				],
				default: 'ocr',
			},
			// Operations & fields for each resource
			...simpleOcrOperations,
			...simpleOcrFields,
			...ocrOperations,
			...ocrFields,
			...documentOperations,
			...documentFields,
		],
	};

	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return getProjects.call(this);
			},
			async getDocuments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return getDocuments.call(this);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				// ─── Simple OCR ───
				if (resource === 'simpleOcr') {
					const schemaFieldsRaw = this.getNodeParameter('schemaFields', i) as any;
					const fields = schemaFieldsRaw?.fields || [];

					const schemaFields = fields.map((f: any) => ({
						name: f.fieldName,
						fieldType: f.fieldType || 'string',
						description: f.description || undefined,
						subFields: f.fieldType === 'array' ? (f.subFields?.columns || []) : undefined,
					}));

					// API processes synchronously and returns result directly
					responseData = await conDocApiSimpleOcrUpload.call(this, i, schemaFields);

					// Mapping mode — flatten the table into one item per row and
					// merge the header fields into each row (optional key rename).
					const outputMode = this.getNodeParameter('outputMode', i, 'raw') as string;
					if (outputMode === 'mapping') {
						const renameRaw = this.getNodeParameter('renameFields', i, {}) as any;
						const renameRules = (renameRaw?.rules || []) as Array<{ from: string; to: string }>;
						responseData = flattenOcrResult(responseData, renameRules);
					}
				}

				// ─── OCR ───
				else if (resource === 'ocr') {
					if (operation === 'upload') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const externalId = this.getNodeParameter('externalId', i, '') as string;
						// Returns jobId immediately — use Get Job Status to poll
						responseData = await conDocApiFileUpload.call(
							this,
							i,
							projectId || undefined,
							externalId || undefined,
						);
					} else if (operation === 'getJobStatus') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await conDocApiRequest.call(this, 'GET', `/ocr/${jobId}`);
					} else if (operation === 'getBatchStatus') {
						const jobIdsRaw = this.getNodeParameter('jobIds', i) as string;
						let jobIds: string[];
						try {
							jobIds = JSON.parse(jobIdsRaw);
						} catch {
							jobIds = jobIdsRaw.split(',').map((id: string) => id.trim()).filter(Boolean);
						}
						responseData = await conDocApiRequest.call(this, 'POST', '/ocr/batch-status', { jobIds });
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
					}
				}

				// Normalize output
				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item) => ({ json: item, pairedItem: { item: i } })));
				} else if (responseData !== undefined) {
					returnData.push({ json: responseData, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
