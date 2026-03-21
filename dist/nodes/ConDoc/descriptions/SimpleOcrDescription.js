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
    // Project Name
    {
        displayName: 'ชื่อโปรเจกต์ (Project Name)',
        name: 'projectName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['simpleOcr'], operation: ['process'] } },
        description: 'ชื่อโปรเจกต์ — ถ้ามีอยู่แล้วจะใช้โปรเจกต์เดิม ถ้าไม่มีจะสร้างใหม่',
    },
    // Schema Fields — supports string and table (array) types
    {
        displayName: 'Output ที่ต้องการ',
        name: 'schemaFields',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true, sortable: true },
        default: {},
        displayOptions: { show: { resource: ['simpleOcr'], operation: ['process'] } },
        description: 'กำหนด field ที่ต้องการดึงจากเอกสาร',
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
                        description: 'ชื่อ field ที่ต้องการดึง เช่น company_name, tax_id, items',
                    },
                    {
                        displayName: 'ประเภท',
                        name: 'fieldType',
                        type: 'options',
                        default: 'string',
                        options: [
                            { name: 'ข้อความ', value: 'string' },
                            { name: 'ตาราง (หลายรายการ)', value: 'array' },
                        ],
                        description: 'ประเภทของข้อมูล — ข้อความ หรือ ตาราง',
                    },
                    {
                        displayName: 'Description',
                        name: 'description',
                        type: 'string',
                        default: '',
                        description: 'คำอธิบายว่า field นี้คืออะไร เพื่อช่วยให้ OCR เข้าใจบริบท',
                    },
                    {
                        displayName: 'คอลัมน์ในตาราง',
                        name: 'subFields',
                        type: 'fixedCollection',
                        typeOptions: { multipleValues: true },
                        default: {},
                        displayOptions: { show: { fieldType: ['array'] } },
                        description: 'กำหนดคอลัมน์ภายในตาราง',
                        options: [
                            {
                                displayName: 'คอลัมน์',
                                name: 'columns',
                                values: [
                                    {
                                        displayName: 'SubName',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        required: true,
                                        description: 'ชื่อคอลัมน์ เช่น product_name, quantity',
                                    },
                                    {
                                        displayName: 'Description',
                                        name: 'description',
                                        type: 'string',
                                        default: '',
                                        description: 'คำอธิบายว่าคอลัมน์นี้คืออะไร',
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
        displayOptions: { show: { resource: ['simpleOcr'], operation: ['process'] } },
        description: 'ชื่อ binary property ที่มีไฟล์',
    },
    // Wait for Result
    {
        displayName: 'รอผลลัพธ์ (Wait for Result)',
        name: 'waitForResult',
        type: 'boolean',
        default: true,
        displayOptions: { show: { resource: ['simpleOcr'], operation: ['process'] } },
        description: 'เมื่อเปิด จะรอจนกว่า OCR จะเสร็จแล้วส่งผลลัพธ์กลับ (poll ทุก 3 วินาที, timeout 300 วินาที)',
    },
];
