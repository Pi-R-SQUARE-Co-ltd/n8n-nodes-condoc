"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleOcrFields = exports.simpleOcrOperations = void 0;
exports.simpleOcrOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'hidden',
        noDataExpression: true,
        displayOptions: { show: { resource: ['simpleOcr'] } },
        default: 'process',
    },
];
exports.simpleOcrFields = [
    // Schema Fields — determines what to extract and project grouping
    {
        displayName: 'Output ที่ต้องการ',
        name: 'schemaFields',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true, sortable: true },
        default: {},
        required: true,
        displayOptions: { show: { resource: ['simpleOcr'] } },
        description: 'กำหนด field ที่ต้องการดึงจากเอกสาร (field เหมือนกัน = ใช้โปรเจคเดียวกัน)',
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
                        description: 'ชื่อ field ที่ต้องการดึง เช่น company_name, tax_id',
                    },
                    {
                        displayName: 'Description',
                        name: 'description',
                        type: 'string',
                        default: '',
                        description: 'คำอธิบายว่า field นี้คืออะไร เพื่อช่วยให้ OCR เข้าใจบริบท',
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
        description: 'ชื่อ binary property ที่มีไฟล์ (รองรับไฟล์เดียว, หน้าเดียวเท่านั้น)',
    },
];
