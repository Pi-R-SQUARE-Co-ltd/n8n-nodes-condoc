import { IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Fetch projects for the loadOptions dropdown.
 */
export declare function getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
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
