import { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class ConDocApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: "file:condoc.png";
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
