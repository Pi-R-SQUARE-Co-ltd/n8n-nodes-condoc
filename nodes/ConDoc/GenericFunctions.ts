import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeApiError,
} from 'n8n-workflow';

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
