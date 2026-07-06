"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleOcrFields = exports.simpleOcrOperations = void 0;
exports.simpleOcrOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['simpleOcr'] } },
        options: [
            {
                name: 'Process',
                value: 'process',
                description: 'Upload file with auto project creation and OCR processing',
                action: 'Process file with simple OCR',
            },
        ],
        default: 'process',
    },
];
exports.simpleOcrFields = [
    // Schema Fields — supports string and table (array) types
    {
        displayName: 'Desired Output',
        name: 'schemaFields',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true, sortable: true },
        default: {},
        required: true,
        displayOptions: { show: { resource: ['simpleOcr'] } },
        description: 'Define the fields to extract from the document (same fields will reuse the same project)',
        options: [
            {
                displayName: 'Fields',
                name: 'fields',
                values: [
                    {
                        displayName: 'Name',
                        name: 'fieldName',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'Field name to extract, e.g. company_name, tax_id, items',
                    },
                    {
                        displayName: 'Type',
                        name: 'fieldType',
                        type: 'options',
                        default: 'string',
                        options: [
                            { name: 'Text', value: 'string' },
                            { name: 'Table (Multiple Items)', value: 'array' },
                        ],
                        description: 'Whether the field is plain text or a table with multiple rows',
                    },
                    {
                        displayName: 'Description',
                        name: 'description',
                        type: 'string',
                        default: '',
                        description: 'Describe what this field represents to help OCR understand the context',
                    },
                    {
                        displayName: 'Table Columns',
                        name: 'subFields',
                        type: 'fixedCollection',
                        typeOptions: { multipleValues: true },
                        default: {},
                        displayOptions: { show: { fieldType: ['array'] } },
                        description: 'Define the columns within the table',
                        options: [
                            {
                                displayName: 'Columns',
                                name: 'columns',
                                values: [
                                    {
                                        displayName: 'Column Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        required: true,
                                        description: 'Column name, e.g. product_name, quantity',
                                    },
                                    {
                                        displayName: 'Description',
                                        name: 'description',
                                        type: 'string',
                                        default: '',
                                        description: 'Describe what this column represents',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // Binary Property
    {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        displayOptions: { show: { resource: ['simpleOcr'] } },
        description: 'Name of the binary property containing the file (single file, single page only)',
    },
    // Output Mode — raw result, or flattened table rows ("Mapping")
    {
        displayName: 'Output Mode',
        name: 'outputMode',
        type: 'options',
        default: 'raw',
        displayOptions: { show: { resource: ['simpleOcr'] } },
        options: [
            {
                name: 'Raw',
                value: 'raw',
                description: 'Return the OCR result as-is',
            },
            {
                name: 'Mapping',
                value: 'mapping',
                description: 'Flatten the table into one item per row and merge the header fields into every row',
            },
        ],
    },
    // Optional key renaming, only for Mapping mode (e.g. Items -> item)
    {
        displayName: 'Rename Fields',
        name: 'renameFields',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
            show: { resource: ['simpleOcr'], outputMode: ['mapping'] },
        },
        description: 'Optionally rename output keys, e.g. Items to item, Price to price',
        options: [
            {
                displayName: 'Rule',
                name: 'rules',
                values: [
                    {
                        displayName: 'From',
                        name: 'from',
                        type: 'string',
                        default: '',
                        description: 'Original field name',
                    },
                    {
                        displayName: 'To',
                        name: 'to',
                        type: 'string',
                        default: '',
                        description: 'New field name',
                    },
                ],
            },
        ],
    },
];
