# exploratory-data-analysis

Run first-pass analysis, summaries, charts, and data checks.

## When to use
When the user has a new dataset and wants to understand its structure, quality, and patterns before modeling.

## EDA checklist
1. **Shape**: rows, columns, dtypes
2. **Missing values**: count and percentage per column
3. **Duplicates**: detect and report duplicate rows
4. **Distributions**: histogram for numeric, bar chart for categorical
5. **Outliers**: IQR or z-score method on numeric columns
6. **Correlations**: heatmap of numeric correlations
7. **Target analysis**: distribution of the target variable if supervised task
8. **Temporal patterns**: if datetime column exists, plot over time

## Python template
```python
import pandas as pd, matplotlib.pyplot as plt, seaborn as sns

df = pd.read_csv("data.csv")
print(df.shape, df.dtypes, df.isnull().sum())
df.describe()
sns.heatmap(df.corr(), annot=True)
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
