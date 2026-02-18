# n8n-nodes-condoc

![ConDoc](https://condoc.ai/assets/logo.png)

This is an n8n community node for the [ConDoc](https://condoc.ai) platform — a multi-tenant document processing and OCR solution built for Thai businesses.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Features

Automate your document processing pipeline with 21 API operations across 9 resources:

| Resource | Operations | Description |
|----------|-----------|-------------|
| **OCR** | Upload File, Get Job Status | Upload documents for OCR processing and poll results |
| **Document** | List, Get, Delete | Manage processed documents and retrieve OCR results |
| **Credit** | Get Balance | Check workspace credit balance |
| **Usage** | Get Summary, Get Daily | Monitor API usage and analytics |
| **Project** | Create, List, Get, Update, Delete | Manage projects within your workspace |
| **Project Settings** | Get, Update | Configure webhooks, processing mode, and more |
| **Project Definition** | Get, Update | Manage project schema definitions |
| **Project Fixed Data** | Get, Update | Manage custom field data for projects |
| **Project Field Mapping** | Get, Update | Configure field mapping rules |

### Supported File Types

PDF, JPG, PNG, HEIC, and more — up to 100MB and 50 pages per document.

## Prerequisites

- An active [ConDoc](https://condoc.ai) account
- A ConDoc API key (generate from your workspace settings)
- n8n version 1.0.0 or later

## Installation

### In n8n (Recommended)

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-condoc`
4. Click **Install**

### Manual Installation

```bash
cd ~/.n8n/custom
npm install n8n-nodes-condoc
```

Then restart n8n.

## Authentication

This node uses API Key authentication via the `X-API-Key` header.

1. In ConDoc, go to your workspace settings and create an API key
2. In n8n, create a new **ConDoc API** credential
3. Enter your **Base URL** (e.g., `https://app.condoc.ai`) and **API Key**

The credential will be automatically tested against the ConDoc API.

## Usage Examples

### Example 1: Upload and Process a Document

1. **Read Binary File** — Read a PDF/image file
2. **ConDoc (OCR > Upload File)** — Upload the file for processing
3. **Wait** — Wait for processing to complete
4. **ConDoc (OCR > Get Job Status)** — Retrieve OCR results

### Example 2: List and Export Documents

1. **ConDoc (Document > List)** — List all documents in a project
2. **Loop** — Iterate through documents
3. **ConDoc (Document > Get)** — Get OCR results for each document
4. **Spreadsheet File** — Export results to Excel/CSV

### Example 3: Monitor Credits and Usage

1. **Schedule Trigger** — Run daily
2. **ConDoc (Credit > Get Balance)** — Check remaining credits
3. **ConDoc (Usage > Get Daily)** — Get daily usage stats
4. **IF** — Check if credits are low
5. **Send Email / Slack** — Send alert notification

## API Rate Limiting

API requests are rate-limited per API key (default: 60 requests/minute). Rate limits can be configured by your workspace administrator.

## Resources

- [ConDoc Website](https://condoc.ai)
- [ConDoc API Documentation](https://docs.condoc.ai)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
