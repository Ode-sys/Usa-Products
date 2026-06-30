# deepchem

Apply ML workflows to drug discovery and molecular prediction.

## When to use
When building ML models for molecular property prediction, virtual screening, or drug-target interaction using the DeepChem library.

## Common workflow
```python
import deepchem as dc

# Load dataset
tasks, datasets, transformers = dc.molnet.load_tox21()
train_dataset, valid_dataset, test_dataset = datasets

# Build model
model = dc.models.AttentiveFPModel(n_tasks=len(tasks), mode="classification")

# Train
model.fit(train_dataset, nb_epoch=50)

# Evaluate
metric = dc.metrics.Metric(dc.metrics.roc_auc_score)
train_score = model.evaluate(train_dataset, [metric], transformers)
test_score = model.evaluate(test_dataset, [metric], transformers)
```

## Key MoleculeNet datasets
- Tox21, ToxCast — toxicity
- BBBP, BACE — bioactivity
- QM9 — quantum properties
- ESOL, FreeSolv — physical properties

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
