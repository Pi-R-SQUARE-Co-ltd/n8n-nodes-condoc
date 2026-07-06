"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = getProjects;
exports.getDocuments = getDocuments;
exports.flattenOcrResult = flattenOcrResult;
exports.conDocApiRequest = conDocApiRequest;
exports.conDocApiFileUpload = conDocApiFileUpload;
exports.conDocApiSimpleOcrUpload = conDocApiSimpleOcrUpload;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Fetch projects for the loadOptions dropdown.
 */
async function getProjects() {
    const credentials = await this.getCredentials('conDocApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', {
            method: 'GET',
            url: `${baseUrl}/api/v1/external/projects`,
            json: true,
        });
        const projects = (response === null || response === void 0 ? void 0 : response.data) || response || [];
        return projects.map((p) => ({
            name: `${p.name} (${p.code})`,
            value: p.id,
        }));
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Fetch documents for the loadOptions dropdown.
 */
async function getDocuments() {
    var _a;
    const credentials = await this.getCredentials('conDocApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', {
            method: 'GET',
            url: `${baseUrl}/api/v1/external/documents?limit=100`,
            json: true,
        });
        const docs = ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) || (response === null || response === void 0 ? void 0 : response.data) || response || [];
        return docs.map((d) => ({
            name: d.originalFileName || d.fileName || d.id,
            value: d.id,
        }));
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Transform a Simple OCR result into flat rows for the "Mapping" output mode.
 * Explodes the single table/array field into one row per item, merging the
 * top-level scalar fields (headers) into every row. Optionally renames keys.
 *
 * Accepts either the result object directly or the legacy `{ result: {...} }`
 * envelope, so it works regardless of which API version answers.
 */
function flattenOcrResult(result, renameRules = []) {
    const data = result && typeof result === 'object' && result.result !== undefined
        ? result.result
        : result;
    if (!data || typeof data !== 'object')
        return [data];
    const rename = (obj) => {
        if (!renameRules.length)
            return obj;
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
            const rule = renameRules.find((r) => r.from === k);
            out[rule && rule.to ? rule.to : k] = v;
        }
        return out;
    };
    const headers = {};
    let tableRows = null;
    for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) {
            if (tableRows === null)
                tableRows = v; // first array field is the table
        }
        else {
            headers[k] = v;
        }
    }
    if (!tableRows)
        return [rename(data)];
    return tableRows.map((row) => rename({ ...headers, ...row }));
}
/**
 * Make an authenticated JSON request to the ConDoc External API.
 * Automatically unwraps the `{ success, data, error }` response envelope.
 */
async function conDocApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('conDocApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const options = {
        method,
        url: `${baseUrl}/api/v1/external${endpoint}`,
        qs: Object.keys(qs).length > 0 ? qs : undefined,
        body: method !== 'GET' && Object.keys(body).length > 0 ? body : undefined,
        json: true,
    };
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', options);
        // Unwrap the ConDoc API envelope
        if (response && response.success === false) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                message: response.error || 'ConDoc API request failed',
            });
        }
        return (response === null || response === void 0 ? void 0 : response.data) !== undefined ? response.data : response;
    }
    catch (error) {
        if (error instanceof n8n_workflow_1.NodeApiError)
            throw error;
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Upload a file to the ConDoc OCR endpoint using multipart/form-data.
 * Automatically unwraps the response envelope.
 */
async function conDocApiFileUpload(itemIndex, projectId, externalId) {
    const credentials = await this.getCredentials('conDocApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex);
    const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
    const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: binaryData.mimeType }), binaryData.fileName || 'upload');
    if (projectId) {
        formData.append('projectId', projectId);
    }
    if (externalId) {
        formData.append('externalId', externalId);
    }
    const options = {
        method: 'POST',
        url: `${baseUrl}/api/v1/external/ocr`,
        body: formData,
    };
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', options);
        if (response && response.success === false) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                message: response.error || 'ConDoc file upload failed',
            });
        }
        return (response === null || response === void 0 ? void 0 : response.data) !== undefined ? response.data : response;
    }
    catch (error) {
        if (error instanceof n8n_workflow_1.NodeApiError)
            throw error;
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Upload file to Simple OCR endpoint with schema fields.
 * Returns OCR result synchronously (API waits for processing to complete).
 */
async function conDocApiSimpleOcrUpload(itemIndex, schemaFields) {
    var _a;
    const credentials = await this.getCredentials('conDocApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex);
    const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
    const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: binaryData.mimeType }), binaryData.fileName || 'upload');
    formData.append('schemaFields', JSON.stringify(schemaFields));
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', {
            method: 'POST',
            url: `${baseUrl}/api/v1/external/simple-ocr`,
            body: formData,
            timeout: 180000, // 3 minutes — API processes synchronously
        });
        if (response && response.success === false) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                message: ((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || 'Simple OCR failed',
            });
        }
        return (response === null || response === void 0 ? void 0 : response.data) !== undefined ? response.data : response;
    }
    catch (error) {
        if (error instanceof n8n_workflow_1.NodeApiError)
            throw error;
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
