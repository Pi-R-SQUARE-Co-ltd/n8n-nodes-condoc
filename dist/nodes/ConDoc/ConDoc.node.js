"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConDoc = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const OcrDescription_1 = require("./descriptions/OcrDescription");
const DocumentDescription_1 = require("./descriptions/DocumentDescription");
const CreditDescription_1 = require("./descriptions/CreditDescription");
const UsageDescription_1 = require("./descriptions/UsageDescription");
const ProjectDescription_1 = require("./descriptions/ProjectDescription");
const ProjectSettingsDescription_1 = require("./descriptions/ProjectSettingsDescription");
const ProjectDefinitionDescription_1 = require("./descriptions/ProjectDefinitionDescription");
const ProjectFixedDataDescription_1 = require("./descriptions/ProjectFixedDataDescription");
const ProjectFieldMappingDescription_1 = require("./descriptions/ProjectFieldMappingDescription");
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
                ...OcrDescription_1.ocrOperations,
                ...OcrDescription_1.ocrFields,
                ...DocumentDescription_1.documentOperations,
                ...DocumentDescription_1.documentFields,
                ...CreditDescription_1.creditOperations,
                ...CreditDescription_1.creditFields,
                ...UsageDescription_1.usageOperations,
                ...UsageDescription_1.usageFields,
                ...ProjectDescription_1.projectOperations,
                ...ProjectDescription_1.projectFields,
                ...ProjectSettingsDescription_1.projectSettingsOperations,
                ...ProjectSettingsDescription_1.projectSettingsFields,
                ...ProjectDefinitionDescription_1.projectDefinitionOperations,
                ...ProjectDefinitionDescription_1.projectDefinitionFields,
                ...ProjectFixedDataDescription_1.projectFixedDataOperations,
                ...ProjectFixedDataDescription_1.projectFixedDataFields,
                ...ProjectFieldMappingDescription_1.projectFieldMappingOperations,
                ...ProjectFieldMappingDescription_1.projectFieldMappingFields,
            ],
        };
        this.methods = {
            loadOptions: {
                async getProjects() {
                    return GenericFunctions_1.getProjects.call(this);
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
                // ─── OCR ───
                if (resource === 'ocr') {
                    if (operation === 'upload') {
                        const projectId = this.getNodeParameter('projectId', i);
                        responseData = await GenericFunctions_1.conDocApiFileUpload.call(this, i, projectId || undefined);
                    }
                    else if (operation === 'getJobStatus') {
                        const jobId = this.getNodeParameter('jobId', i);
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', `/ocr/${jobId}`);
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
                    else if (operation === 'delete') {
                        const documentId = this.getNodeParameter('documentId', i);
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'DELETE', `/documents/${documentId}`);
                    }
                }
                // ─── Credit ───
                else if (resource === 'credit') {
                    if (operation === 'getBalance') {
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', '/credits/balance');
                    }
                }
                // ─── Usage ───
                else if (resource === 'usage') {
                    if (operation === 'getSummary') {
                        const qs = {};
                        const from = this.getNodeParameter('from', i);
                        const to = this.getNodeParameter('to', i);
                        if (from)
                            qs.from = from;
                        if (to)
                            qs.to = to;
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', '/usage', {}, qs);
                    }
                    else if (operation === 'getDaily') {
                        const days = this.getNodeParameter('days', i);
                        const qs = {};
                        if (days)
                            qs.days = days;
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', '/usage/daily', {}, qs);
                    }
                }
                // ─── Project ───
                else if (resource === 'project') {
                    if (operation === 'create') {
                        const body = {
                            name: this.getNodeParameter('name', i),
                            code: this.getNodeParameter('code', i),
                        };
                        const description = this.getNodeParameter('description', i);
                        const schemaJson = this.getNodeParameter('schemaJson', i);
                        if (description)
                            body.description = description;
                        if (schemaJson) {
                            body.schemaJson = typeof schemaJson === 'string' ? JSON.parse(schemaJson) : schemaJson;
                        }
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'POST', '/projects', body);
                    }
                    else if (operation === 'list') {
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', '/projects');
                    }
                    else if (operation === 'get') {
                        const projectId = this.getNodeParameter('projectId', i);
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', `/projects/${projectId}`);
                    }
                    else if (operation === 'update') {
                        const projectId = this.getNodeParameter('projectId', i);
                        const body = {};
                        const name = this.getNodeParameter('name', i);
                        const description = this.getNodeParameter('description', i);
                        if (name)
                            body.name = name;
                        if (description)
                            body.description = description;
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}`, body);
                    }
                    else if (operation === 'delete') {
                        const projectId = this.getNodeParameter('projectId', i);
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'DELETE', `/projects/${projectId}`);
                    }
                }
                // ─── Project Settings ───
                else if (resource === 'projectSettings') {
                    const projectId = this.getNodeParameter('projectId', i);
                    if (operation === 'get') {
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', `/projects/${projectId}/settings`);
                    }
                    else if (operation === 'update') {
                        const settingsJson = this.getNodeParameter('settingsJson', i);
                        const body = typeof settingsJson === 'string' ? JSON.parse(settingsJson) : settingsJson;
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}/settings`, body);
                    }
                }
                // ─── Project Definition ───
                else if (resource === 'projectDefinition') {
                    const projectId = this.getNodeParameter('projectId', i);
                    if (operation === 'get') {
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', `/projects/${projectId}/definition`);
                    }
                    else if (operation === 'update') {
                        const schemaJson = this.getNodeParameter('schemaJson', i);
                        const body = {
                            schemaJson: typeof schemaJson === 'string' ? JSON.parse(schemaJson) : schemaJson,
                        };
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}/definition`, body);
                    }
                }
                // ─── Project Fixed Data ───
                else if (resource === 'projectFixedData') {
                    const projectId = this.getNodeParameter('projectId', i);
                    if (operation === 'get') {
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', `/projects/${projectId}/fixed-data`);
                    }
                    else if (operation === 'update') {
                        const customFieldJson = this.getNodeParameter('customFieldJson', i);
                        const body = {
                            customFieldJson: typeof customFieldJson === 'string' ? JSON.parse(customFieldJson) : customFieldJson,
                        };
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}/fixed-data`, body);
                    }
                }
                // ─── Project Field Mapping ───
                else if (resource === 'projectFieldMapping') {
                    const projectId = this.getNodeParameter('projectId', i);
                    if (operation === 'get') {
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'GET', `/projects/${projectId}/field-mapping`);
                    }
                    else if (operation === 'update') {
                        const fieldMappingJson = this.getNodeParameter('fieldMappingJson', i);
                        const body = {
                            fieldMappingJson: typeof fieldMappingJson === 'string' ? JSON.parse(fieldMappingJson) : fieldMappingJson,
                        };
                        responseData = await GenericFunctions_1.conDocApiRequest.call(this, 'PATCH', `/projects/${projectId}/field-mapping`, body);
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
