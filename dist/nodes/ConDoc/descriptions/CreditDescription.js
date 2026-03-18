"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditFields = exports.creditOperations = void 0;
exports.creditOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: { resource: ['credit'] },
        },
        options: [
            {
                name: 'Get Balance',
                value: 'getBalance',
                description: 'Get workspace credit balance',
                action: 'Get credit balance',
            },
        ],
        default: 'getBalance',
    },
];
exports.creditFields = [];
