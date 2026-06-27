# matplotlib

Create scientific charts, publication plots, and explanatory visuals.

## When to use
When creating charts for papers, reports, or data exploration in Python.

## Publication-quality setup
```python
import matplotlib.pyplot as plt
import matplotlib as mpl

mpl.rcParams.update({
    "font.family": "serif",
    "font.size": 12,
    "axes.labelsize": 12,
    "axes.titlesize": 14,
    "legend.fontsize": 10,
    "figure.dpi": 300,
})
```

## Common chart types
```python
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(x, y, label="Series A")           # line
ax.scatter(x, y, c=colors, s=sizes)       # scatter
ax.bar(categories, values)                 # bar
ax.hist(data, bins=30, density=True)       # histogram
ax.boxplot(groups)                         # box plot
```

## Saving
```python
fig.savefig("figure.pdf", bbox_inches="tight")
fig.savefig("figure.png", dpi=300, bbox_inches="tight")
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
