# Domain 07: Research & Knowledge Work
*Source: K-Dense-AI/scientific-agent-skills (26.8k stars)*

## Skills 61–70

### literature-review
Synthesize papers into themes, gaps, and takeaways:
```
Structure:
1. Search strategy (keywords, databases, date range)
2. Inclusion/exclusion criteria
3. Theme extraction (group by finding, not by paper)
4. Gaps identified
5. Recommended next steps
```

### hypothesis-generation
```
Format:
"We hypothesize that [X] causes [Y] in [Z context]
because [mechanism], which can be tested by [method]
with [measurable outcome]."
```

### exploratory-data-analysis
```python
# Standard EDA pattern
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data.csv')

# 1. Shape and types
print(df.shape, df.dtypes)

# 2. Missing values
print(df.isnull().sum())

# 3. Distributions
df.describe()

# 4. Correlations
df.corr().style.background_gradient()

# 5. Target variable distribution
df['target'].value_counts().plot(kind='bar')
```

### citation-management
Format: APA 7th edition by default
```
Journal: Author, A. A. (Year). Title. Journal, Vol(Issue), pages. DOI
Book: Author, A. A. (Year). Title. Publisher.
Website: Author. (Year, Month Day). Title. URL
```

# Domain 08: Data Science & ML
*Source: Scientific Agent Skills data/ML package skills*

## Skills 71–80

### polars (fast dataframes)
```python
import polars as pl

df = pl.read_csv("data.csv")
result = (df
  .filter(pl.col("value") > 0)
  .group_by("category")
  .agg(pl.col("value").sum().alias("total"))
  .sort("total", descending=True)
)
```

### matplotlib (scientific charts)
```python
import matplotlib.pyplot as plt
import matplotlib as mpl

mpl.rcParams['font.family'] = 'DejaVu Sans'
fig, ax = plt.subplots(figsize=(10, 6), dpi=150)
ax.plot(x, y, color='#009736', linewidth=2, label='Revenue')
ax.set_title('Weekly Revenue', fontsize=14, fontweight='bold')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig('chart.png', dpi=300, bbox_inches='tight')
```

### Amazon data analysis patterns
```python
# WBR metrics calculation
def calculate_acos(ad_spend, ad_revenue):
    return (ad_spend / ad_revenue * 100) if ad_revenue > 0 else None

def calculate_tacos(ad_spend, total_revenue):
    return (ad_spend / total_revenue * 100) if total_revenue > 0 else None

def week_over_week(current, previous):
    if previous == 0: return None
    return ((current - previous) / previous) * 100
```

# Domain 09: Biology & Medicine
*Source: Scientific Agent Skills life sciences collection*
## Skills 81–90
Reference: Install K-Dense-AI/scientific-agent-skills for full skills.
Key packages: biopython · anndata · deepchem · pyhealth

# Domain 10: Physics, Chemistry & Engineering
*Source: Scientific Agent Skills physical science tools*
## Skills 91–100
Reference: Install K-Dense-AI/scientific-agent-skills for full skills.
Key packages: astropy · cirq · geopandas · pymatgen · pennylane
