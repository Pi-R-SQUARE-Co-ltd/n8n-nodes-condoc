"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConDoc = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const OcrDescription_1 = require("./descriptions/OcrDescription");
const DocumentDescription_1 = require("./descriptions/DocumentDescription");
const SimpleOcrDescription_1 = require("./descriptions/SimpleOcrDescription");
class ConDoc {
    constructor() {
        this.description = {
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
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
                ...SimpleOcrDescription_1.simpleOcrOperations,
                ...SimpleOcrDescription_1.simpleOcrFields,
                ...OcrDescription_1.ocrOperations,
                ...OcrDescription_1.ocrFields,
                ...DocumentDescription_1.documentOperations,
                ...DocumentDescription_1.documentFields,
            ],
        };
        this.methods = {
            loadOptions: {
                async getProjects() {
                    return GenericFunctions_1.getProjects.call(this);
                },
                async getDocuments() {
                    return GenericFunctions_1.getDocuments.call(this);
                },
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                // ─── Simple OCR ───
                if (resource === 'simpleOcr') {
                    const schemaFieldsRaw = this.getNodeParameter('schemaFields', i);
                    const fields = (schemaFieldsRaw === null || schemaFieldsRaw === void 0 ? void 0 : schemaFieldsRaw.fields) || [];
                    const schemaFields = fields.map((f) => {
                        var _a;
                        return ({
                            name: f.fieldName,
                            fieldType: f.fieldType || 'string',
                            description: f.description || undefined,
                            subFields: f.fieldType === 'array' ? (((_a = f.subFields) === null || _a === void 0 ? void 0 : _a.columns) || []) : undefined,
                        });
                    });
                    // API processes synchronously and returns result directly
                    responseData = await GenericFunctions_1.conDocApiSimpleOcrUpload.call(this, i, schemaFields);
                    // Mapping mode — flatten the table into one item per row and
                    // merge the header fields into each row (optional key rename).
                    const outputMode = this.getNodeParameter('outputMode', i, 'raw');
                    if (outputMode === 'mapping') {
                        const renameRaw = this.getNodeParameter('renameFields', i, {});
                        const renameRules = ((renameRaw === null || renameRaw === void 0 ? void 0 : renameRaw.rules) || []);
                        responseData = (0, GenericFunctions_1.flattenOcrResult)(responseData, renameRules);
                    }
                }
                // ─── OCR ───
                else if (resource === 'ocr') {
                    if (operation === 'upload') {
                        const projectId = this.getNodeParameter('projectId', i);
                        const externalId = this.getNodeParameter('externalId', i, '');
                        // Returns jobId immediately — use Get Job Status to poll
                        responseData = await GenericFunctions_1.conDocApiFileUpload.call(this, i, projectId || undefined, externalId || undefined);
                    }
                    else if (operation === 'getJobStatus') {
                        const jobId = this.getNodeParameter('jobId', i);
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', `/ocr/${jobId}`);
                    }
                    else if (operation === 'getBatchStatus') {
                        const jobIdsRaw = this.getNodeParameter('jobIds', i);
                        let jobIds;
                        try {
                            jobIds = JSON.parse(jobIdsRaw);
                        }
                        catch {
                            jobIds = jobIdsRaw.split(',').map((id) => id.trim()).filter(Boolean);
                        }
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'POST', '/ocr/batch-status', { jobIds });
                    }
                }
                // ─── Document ───
                else if (resource === 'document') {
                    if (operation === 'list') {
                        const qs = {};
                        const projectId = this.getNodeParameter('projectId', i);
                        const page = this.getNodeParameter('page', i);
                        const limit = this.getNodeParameter('limit', i);
                        if (projectId)
                            qs.projectId = projectId;
                        if (page)
                            qs.page = page;
                        if (limit)
                            qs.limit = limit;
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', '/documents', {}, qs);
                    }
                    else if (operation === 'get') {
                        const documentId = this.getNodeParameter('documentId', i);
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', `/documents/${documentId}`);
                    }
                }
                // Normalize output
                if (Array.isArray(responseData)) {
                    returnData.push(...responseData.map((item) => ({ json: item, pairedItem: { item: i } })));
                }
                else if (responseData !== undefined) {
                    returnData.push({ json: responseData, pairedItem: { item: i } });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.ConDoc = ConDoc;
