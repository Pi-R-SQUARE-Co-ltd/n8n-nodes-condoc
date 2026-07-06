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
 * Transform a Simple OCR result into flat rows for the "Mapping" output mode.
 * Explodes the single table/array field into one row per item, merging the
 * top-level scalar fields (headers) into every row. Optionally renames keys.
 *
 * Accepts either the result object directly or the legacy `{ result: {...} }`
 * envelope, so it works regardless of which API version answers.
 */
export declare function flattenOcrResult(result: any, renameRules?: Array<{
    from: string;
    to: string;
}>): any[];
/**
 * Make an authenticated JSON request to the ConDoc External API.
 * Automatically unwraps the `{ success, data, error }` response envelope.
 */
export declare function conDocApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: object, qs?: Record<string, string | number>): Promise<any>;
/**
 * Upload a file to the ConDoc OCR endpoint using multipart/form-data.
 * Automatically unwraps the response envelope.
 */
export declare function conDocApiFileUpload(this: IExecuteFunctions, itemIndex: number, projectId?: string, externalId?: string): Promise<any>;
/**
 * Upload file to Simple OCR endpoint with schema fields.
 * Returns OCR result synchronously (API waits for processing to complete).
 */
export declare function conDocApiSimpleOcrUpload(this: IExecuteFunctions, itemIndex: number, schemaFields: Array<{
    name: string;
    description?: string;
}>): Promise<any>;
