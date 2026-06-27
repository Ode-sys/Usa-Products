# aeon

Time-series machine learning workflows and forecasting structures.

## When to use
When working with time-series data for classification, regression, clustering, or forecasting using the aeon Python library.

## Common tasks
```python
from aeon.classification.interval_based import TimeSeriesForestClassifier
from aeon.datasets import load_basic_motions

X_train, y_train = load_basic_motions(split="train")
clf = TimeSeriesForestClassifier()
clf.fit(X_train, y_train)
```

## Key modules
- `aeon.classification` — time-series classification
- `aeon.regression` — time-series regression
- `aeon.clustering` — time-series clustering
- `aeon.forecasting` — forecasting models
- `aeon.transformations` — feature extraction (catch22, TSFresh)

## Data format
aeon uses 3D numpy arrays: `(n_instances, n_channels, n_timepoints)` for collections.

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
