# arboreto

Infer gene regulatory networks from expression data.

## When to use
When inferring transcription factor - target gene regulatory relationships from single-cell or bulk RNA expression data.

## GENIE3 / GRNBoost2 workflow
```python
from arboreto.algo import genie3, grnboost2
from arboreto.utils import load_tf_names
import pandas as pd

# Load expression matrix (genes × cells or cells × genes)
ex_matrix = pd.read_csv("expression.csv", index_col=0).T

# Load transcription factor list
tf_names = load_tf_names("tf_names.txt")

# Infer network
network = grnboost2(expression_data=ex_matrix, tf_names=tf_names)

# Output: DataFrame with columns TF, target, importance
network.to_csv("grn.csv", index=False)
```

## Interpreting output
- Higher `importance` score = stronger predicted regulatory relationship.
- Filter by importance threshold before downstream analysis.
- Validate top edges with known TF-target databases (JASPAR, ChIP-Atlas).

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
