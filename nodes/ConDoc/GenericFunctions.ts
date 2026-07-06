import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	JsonObject,
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

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', {
			method: 'GET',
			url: `${baseUrl}/api/v1/external/projects`,
			json: true,
		});

		const projects = response?.data || response || [];
		return (projects as Array<{ name: string; code: string; id: string }>).map((p) => ({
			name: `${p.name} (${p.code})`,
			value: p.id,
		}));
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Fetch documents for the loadOptions dropdown.
 */
export async function getDocuments(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const credentials = await this.getCredentials('conDocApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', {
			method: 'GET',
			url: `${baseUrl}/api/v1/external/documents?limit=100`,
			json: true,
		});

		const docs = response?.data?.data || response?.data || response || [];
		return (docs as Array<{ id: string; originalFileName?: string; fileName?: string }>).map((d) => ({
			name: d.originalFileName || d.fileName || d.id,
			value: d.id,
		}));
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
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
export function flattenOcrResult(
	result: any,
	renameRules: Array<{ from: string; to: string }> = [],
): any[] {
	const data =
		result && typeof result === 'object' && result.result !== undefined
			? result.result
			: result;
	if (!data || typeof data !== 'object') return [data];

	const rename = (obj: Record<string, any>): Record<string, any> => {
		if (!renameRules.length) return obj;
		const out: Record<string, any> = {};
		for (const [k, v] of Object.entries(obj)) {
			const rule = renameRules.find((r) => r.from === k);
			out[rule && rule.to ? rule.to : k] = v;
		}
		return out;
	};

	const headers: Record<string, any> = {};
	let tableRows: any[] | null = null;
	for (const [k, v] of Object.entries(data as Record<string, any>)) {
		if (Array.isArray(v)) {
			if (tableRows === null) tableRows = v; // first array field is the table
		} else {
			headers[k] = v;
		}
	}

	if (!tableRows) return [rename(data as Record<string, any>)];
	return tableRows.map((row) =>
		rename({ ...headers, ...(row as Record<string, any>) }),
	);
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
		qs: Object.keys(qs).length > 0 ? qs : undefined,
		body: method !== 'GET' && Object.keys(body).length > 0 ? body : undefined,
		json: true,
	};

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', options);

		// Unwrap the ConDoc API envelope
		if (response && response.success === false) {
			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: response.error || 'ConDoc API request failed',
			});
		}

		return response?.data !== undefined ? response.data : response;
	} catch (error) {
		if (error instanceof NodeApiError) throw error;
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Upload a file to the ConDoc OCR endpoint using multipart/form-data.
 * Automatically unwraps the response envelope.
 */
export async function conDocApiFileUpload(
	this: IExecuteFunctions,
	itemIndex: number,
	projectId?: string,
	externalId?: string,
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
	if (externalId) {
		formData.append('externalId', externalId);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/api/v1/external/ocr`,
		body: formData,
	};

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'conDocApi', options);

		if (response && response.success === false) {
			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: response.error || 'ConDoc file upload failed',
			});
		}

		return response?.data !== undefined ? response.data : response;
	} catch (error) {
		if (error instanceof NodeApiError) throw error;
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Upload file to Simple OCR endpoint with schema fields.
 * Returns OCR result synchronously (API waits for processing to complete).
 */
export async function conDocApiSimpleOcrUpload(
	this: IExecuteFunctions,
	itemIndex: number,
	schemaFields: Array<{ name: string; description?: string }>,
): Promise<any> {
	const credentials = await this.getCredentials('conDocApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
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
			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: response.error?.message || 'Simple OCR failed',
			});
		}

		return response?.data !== undefined ? response.data : response;
	} catch (error) {
		if (error instanceof NodeApiError) throw error;
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
