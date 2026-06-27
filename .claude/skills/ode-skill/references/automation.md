# Domain 12: Automation, Workflows & Integrations
*Most critical domain for Ode's daily work*

## Skills in This Domain

### n8n Workflows
Build automation workflows in n8n:
```
Pattern:
Trigger → Transform → Action → Error Handler

Triggers: Webhook · Schedule · HTTP · Google Sheets
Actions: HTTP Request · Gmail · Slack · Google Sheets · Code node
```

**Ode's common workflows:**
- Amazon SP-API → Google Sheets → WBR Report
- Webhook → n8n → Make.com → Notification
- Schedule → Pull data → Transform → Email report

**n8n Code Node (JavaScript):**
```javascript
// Always structure like this
const items = $input.all();
const results = [];

for (const item of items) {
  const data = item.json;
  // process data
  results.push({ json: { ...data, processed: true } });
}

return results;
```

### Make.com Scenarios
- Module: each step is a module
- Filters: add between modules for conditions
- Error handlers: always add "Resume" or "Break"
- Data stores: for cross-scenario state

### Amazon SP-API
```python
# Auth pattern
import requests
from datetime import datetime

headers = {
    'x-amz-access-token': access_token,
    'x-amz-date': datetime.utcnow().strftime('%Y%m%dT%H%M%SZ'),
    'Content-Type': 'application/json'
}

# Common endpoints
ORDERS = '/orders/v0/orders'
INVENTORY = '/fba/inventory/v1/summaries'
REPORTS = '/reports/2021-06-30/reports'
ADVERTISING = 'https://advertising-api.amazon.com'
```

### Google Apps Script
```javascript
// Sheet automation pattern
function processData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Data');
  const data = sheet.getDataRange().getValues();
  
  // Process
  const results = data.slice(1).map(row => ({
    // transform
  }));
  
  // Write back
  const output = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Output');
  output.clearContents();
  output.getRange(1, 1, results.length, results[0].length)
    .setValues(results);
}
```

### Webhook Patterns
```
Incoming webhook → validate → process → respond

Always:
1. Validate payload structure first
2. Respond 200 immediately (async processing)
3. Log errors to separate sheet/DB
4. Alert on failure
```

### WBR Report Automation
Weekly Business Review pipeline:
```
SP-API (Orders + Ads + Inventory)
  ↓
n8n Transform Node
  ↓
Google Sheets (raw data)
  ↓
Apps Script (calculate metrics)
  ↓
Email/Slack (formatted report)
```

**Key WBR metrics:**
- Revenue · Units · ACOS · TACOS · Conversion Rate
- Week-over-Week · Month-over-Month · YoY
- Inventory Days of Stock · Reorder alerts

---

## Error Handling Standard

Always implement:
```
1. Try/catch with specific error types
2. Retry logic (3 attempts, exponential backoff)
3. Dead letter queue for failed items
4. Alert notification (email/Slack)
5. Error log with timestamp + payload
```
