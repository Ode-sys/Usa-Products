# xlsx

Analyze, create, and format spreadsheets for business workflows.

## When to use
When the output must be a `.xlsx` file, or when reading structured data from a spreadsheet.

## Reading
```python
import openpyxl
wb = openpyxl.load_workbook("data.xlsx")
ws = wb.active
for row in ws.iter_rows(values_only=True):
    print(row)
```

## Writing
```python
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Report"
ws.append(["Name", "Value", "Date"])
ws.append(["Item A", 100, "2026-01-01"])
wb.save("output.xlsx")
```

## Formatting
- Use openpyxl styles for bold headers, number formats, and conditional formatting.
- Freeze header row: `ws.freeze_panes = "A2"`
- Auto-fit column width by iterating column letters.

## Analysis
Use pandas for bulk analysis: `df = pd.read_excel("data.xlsx")`

## Source
Anthropic (anthropics/skills)
