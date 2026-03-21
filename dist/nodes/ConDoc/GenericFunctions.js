"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = getProjects;
exports.getDocuments = getDocuments;
exports.conDocApiRequest = conDocApiRequest;
exports.conDocApiFileUpload = conDocApiFileUpload;
exports.pollForOcrResult = pollForOcrResult;
exports.conDocApiSimpleOcrUpload = conDocApiSimpleOcrUpload;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Fetch projects for the loadOptions dropdown.
 */
async function getProjects() {
    const credentials = await this.getCredentials('conDocApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const response = await this.helpers.httpRequest({
        method: 'GET',
        url: `${baseUrl}/api/v1/external/projects`,
        headers: { 'X-API-Key': credentials.apiKey },
        json: true,
    });
    const projects = (response === null || response === void 0 ? void 0 : response.data) || response || [];
    return projects.map((p) => ({
        name: `${p.name} (${p.code})`,
        value: p.id,
    }));
}
/**
 * Fetch documents for the loadOptions dropdown.
 */
async function getDocuments() {
    var _a;
    const credentials = await this.getCredentials('conDocApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const response = await this.helpers.httpRequest({
        method: 'GET',
        url: `${baseUrl}/api/v1/external/documents?limit=100`,
        headers: { 'X-API-Key': credentials.apiKey },
        json: true,
    });
    const docs = ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) || (response === null || response === void 0 ? void 0 : response.data) || response || [];
    return docs.map((d) => ({
        name: d.originalFileName || d.fileName || d.id,
        value: d.id,
    }));
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
        headers: {
            'X-API-Key': credentials.apiKey,
        },
        qs: Object.keys(qs).length > 0 ? qs : undefined,
        body: method !== 'GET' && Object.keys(body).length > 0 ? body : undefined,
        json: true,
    };
    const response = await this.helpers.httpRequest(options);
    // Unwrap the ConDoc API envelope
    if (response && response.success === false) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
            message: response.error || 'ConDoc API request failed',
        });
    }
    return (response === null || response === void 0 ? void 0 : response.data) !== undefined ? response.data : response;
}
/**
 * Upload a file to the ConDoc OCR endpoint using multipart/form-data.
 * Automatically unwraps the response envelope.
 */
async function conDocApiFileUpload(itemIndex, projectId) {
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
    const options = {
        method: 'POST',
        url: `${baseUrl}/api/v1/external/ocr`,
        headers: {
            'X-API-Key': credentials.apiKey,
        },
        body: formData,
    };
    const response = await this.helpers.httpRequest(options);
    if (response && response.success === false) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
            message: response.error || 'ConDoc file upload failed',
        });
    }
    return (response === null || response === void 0 ? void 0 : response.data) !== undefined ? response.data : response;
}
/**
 * Poll OCR job status until terminal state or timeout.
 */
async function pollForOcrResult(jobId, pollIntervalSeconds, maxWaitTimeSeconds) {
    const startTime = Date.now();
    const timeoutMs = maxWaitTimeSeconds * 1000;
    const intervalMs = pollIntervalSeconds * 1000;
    while (Date.now() - startTime < timeoutMs) {
        const result = await conDocApiRequest.call(this, 'GET', `/ocr/${jobId}`);
        if (result.status === 'succeeded') {
            return result;
        }
        if (result.status === 'failed') {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), result, {
                message: result.errorMessage || `OCR job ${jobId} failed`,
            });
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new n8n_workflow_1.NodeApiError(this.getNode(), {}, {
        message: `OCR job ${jobId} ไม่เสร็จภายใน ${maxWaitTimeSeconds} วินาที ใช้ "Get Job Status" เพื่อตรวจสอบด้วยตนเอง`,
    });
}
/**
 * Upload file to Simple OCR endpoint with project name + schema fields.
 */
async function conDocApiSimpleOcrUpload(itemIndex, projectName, schemaFields) {
    var _a, _b, _c;
    const credentials = await this.getCredentials('conDocApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex);
    const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
    const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: binaryData.mimeType }), binaryData.fileName || 'upload');
    formData.append('projectName', projectName);
    if (schemaFields.length > 0) {
        formData.append('schemaFields', JSON.stringify(schemaFields));
    }
    let response;
    try {
        response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/api/v1/external/simple-ocr`,
            headers: { 'X-API-Key': credentials.apiKey },
            body: formData,
        });
    }
    catch (error) {
        // Extract meaningful error message from API response
        const responseData = ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || (error === null || error === void 0 ? void 0 : error.body);
        if (responseData) {
            const msg = responseData === null || responseData === void 0 ? void 0 : responseData.message;
            if (typeof msg === 'string' && msg.toLowerCase().includes('insufficient')) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, {
                    message: `เครดิตไม่เพียงพอ (Insufficient credits) — ต้องการ ${responseData.required || '?'} เครดิต แต่เหลือ ${responseData.available || '?'} เครดิต กรุณาเติมเครดิตก่อนใช้งาน`,
                });
            }
            const errorMsg = typeof msg === 'string' ? msg
                : ((_b = responseData === null || responseData === void 0 ? void 0 : responseData.error) === null || _b === void 0 ? void 0 : _b.message) || (responseData === null || responseData === void 0 ? void 0 : responseData.error) || JSON.stringify(responseData);
            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, {
                message: `Simple OCR failed: ${errorMsg}`,
            });
        }
        throw error;
    }
    if (response && response.success === false) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
            message: ((_c = response.error) === null || _c === void 0 ? void 0 : _c.message) || 'Simple OCR upload failed',
        });
    }
    return (response === null || response === void 0 ? void 0 : response.data) !== undefined ? response.data : response;
}
