import { IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Fetch projects for the loadOptions dropdown.
 */
export declare function getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
/**
 * Fetch documents for the loadOptions dropdown.
 */
export declare function getDocuments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
/**
 * Make an authenticated JSON request to the ConDoc External API.
 * Automatically unwraps the `{ success, data, error }` response envelope.
 */
export declare function conDocApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: object, qs?: Record<string, string | number>): Promise<any>;
/**
 * Upload a file to the ConDoc OCR endpoint using multipart/form-data.
 * Automatically unwraps the response envelope.
 */
export declare function conDocApiFileUpload(this: IExecuteFunctions, itemIndex: number, projectId?: string): Promise<any>;
/**
 * Poll OCR job status until terminal state or timeout.
 */
export declare function pollForOcrResult(this: IExecuteFunctions, jobId: string, pollIntervalSeconds: number, maxWaitTimeSeconds: number): Promise<any>;
/**
 * Upload file to Simple OCR endpoint with schema fields.
 * Returns OCR result synchronously (API waits for processing to complete).
 */
export declare function conDocApiSimpleOcrUpload(this: IExecuteFunctions, itemIndex: number, schemaFields: Array<{
    name: string;
    description?: string;
}>): Promise<any>;
