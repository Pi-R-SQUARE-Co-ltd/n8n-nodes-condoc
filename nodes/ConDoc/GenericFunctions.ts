import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	NodeApiError,
} from 'n8n-workflow';

/**
 * Fetch projects for the loadOptions dropdown.
 */
export async function getProjects(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const credentials = await this.getCredentials('conDocApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const response = await this.helpers.httpRequest({
		method: 'GET',
		url: `${baseUrl}/api/v1/external/projects`,
		headers: { 'X-API-Key': credentials.apiKey as string },
		json: true,
	});

	const projects = response?.data || response || [];
	return (projects as Array<{ name: string; code: string; id: string }>).map((p) => ({
		name: `${p.name} (${p.code})`,
		value: p.id,
	}));
}

/**
 * Fetch documents for the loadOptions dropdown.
 */
export async function getDocuments(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const credentials = await this.getCredentials('conDocApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const response = await this.helpers.httpRequest({
		method: 'GET',
		url: `${baseUrl}/api/v1/external/documents?limit=100`,
		headers: { 'X-API-Key': credentials.apiKey as string },
		json: true,
	});

	const docs = response?.data?.data || response?.data || response || [];
	return (docs as Array<{ id: string; originalFileName?: string; fileName?: string }>).map((d) => ({
		name: d.originalFileName || d.fileName || d.id,
		value: d.id,
	}));
}

/**
 * Make an authenticated JSON request to the ConDoc External API.
 * Automatically unwraps the `{ success, data, error }` response envelope.
 */
export async function conDocApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: object = {},
	qs: Record<string, string | number> = {},
): Promise<any> {
	const credentials = await this.getCredentials('conDocApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}/api/v1/external${endpoint}`,
		headers: {
			'X-API-Key': credentials.apiKey as string,
		},
		qs: Object.keys(qs).length > 0 ? qs : undefined,
		body: method !== 'GET' && Object.keys(body).length > 0 ? body : undefined,
		json: true,
	};

	const response = await this.helpers.httpRequest(options);

	// Unwrap the ConDoc API envelope
	if (response && response.success === false) {
		throw new NodeApiError(this.getNode(), response as any, {
			message: response.error || 'ConDoc API request failed',
		});
	}

	return response?.data !== undefined ? response.data : response;
}

/**
 * Upload a file to the ConDoc OCR endpoint using multipart/form-data.
 * Automatically unwraps the response envelope.
 */
export async function conDocApiFileUpload(
	this: IExecuteFunctions,
	itemIndex: number,
	projectId?: string,
): Promise<any> {
	const credentials = await this.getCredentials('conDocApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	const formData = new FormData();
	formData.append('file', new Blob([buffer], { type: binaryData.mimeType }), binaryData.fileName || 'upload');

	if (projectId) {
		formData.append('projectId', projectId);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/api/v1/external/ocr`,
		headers: {
			'X-API-Key': credentials.apiKey as string,
		},
		body: formData,
	};

	const response = await this.helpers.httpRequest(options);

	if (response && response.success === false) {
		throw new NodeApiError(this.getNode(), response as any, {
			message: response.error || 'ConDoc file upload failed',
		});
	}

	return response?.data !== undefined ? response.data : response;
}

/**
 * Poll OCR job status until terminal state or timeout.
 */
export async function pollForOcrResult(
	this: IExecuteFunctions,
	jobId: string,
	pollIntervalSeconds: number,
	maxWaitTimeSeconds: number,
): Promise<any> {
	const startTime = Date.now();
	const timeoutMs = maxWaitTimeSeconds * 1000;
	const intervalMs = pollIntervalSeconds * 1000;

	while (Date.now() - startTime < timeoutMs) {
		const result = await conDocApiRequest.call(this, 'GET', `/ocr/${jobId}`);

		if (result.status === 'succeeded') {
			return result;
		}
		if (result.status === 'failed') {
			throw new NodeApiError(this.getNode(), result as any, {
				message: result.errorMessage || `OCR job ${jobId} failed`,
			});
		}

		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}

	throw new NodeApiError(this.getNode(), {} as any, {
		message: `OCR job ${jobId} ไม่เสร็จภายใน ${maxWaitTimeSeconds} วินาที ใช้ "Get Job Status" เพื่อตรวจสอบด้วยตนเอง`,
	});
}

/**
 * Upload file to Simple OCR endpoint with project name + schema fields.
 */
export async function conDocApiSimpleOcrUpload(
	this: IExecuteFunctions,
	itemIndex: number,
	projectName: string,
	schemaFields: Array<{ name: string; description?: string }>,
): Promise<any> {
	const credentials = await this.getCredentials('conDocApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	const formData = new FormData();
	formData.append('file', new Blob([buffer], { type: binaryData.mimeType }), binaryData.fileName || 'upload');
	formData.append('projectName', projectName);

	if (schemaFields.length > 0) {
		formData.append('schemaFields', JSON.stringify(schemaFields));
	}

	const response = await this.helpers.httpRequest({
		method: 'POST',
		url: `${baseUrl}/api/v1/external/simple-ocr`,
		headers: { 'X-API-Key': credentials.apiKey as string },
		body: formData,
	});

	if (response && response.success === false) {
		throw new NodeApiError(this.getNode(), response as any, {
			message: response.error?.message || 'Simple OCR upload failed',
		});
	}

	return response?.data !== undefined ? response.data : response;
}
