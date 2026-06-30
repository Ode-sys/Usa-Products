# pyhealth

Healthcare AI workflows and clinical machine learning experiments.

## When to use
When building ML models on clinical or electronic health record (EHR) data using the PyHealth library.

## Key modules
- `pyhealth.datasets` — load MIMIC-III, MIMIC-IV, eICU, OMOP CDM
- `pyhealth.tasks` — predefined clinical tasks (mortality, readmission, LOS)
- `pyhealth.models` — clinical ML models (LSTM, Transformer, CNN)
- `pyhealth.trainer` — training loop with evaluation

## Basic workflow
```python
from pyhealth.datasets import MIMIC3Dataset
from pyhealth.tasks import mortality_prediction_mimic3_fn
from pyhealth.models import Transformer
from pyhealth.trainer import Trainer

dataset = MIMIC3Dataset(root="data/mimic3", tables=["DIAGNOSES_ICD", "PROCEDURES_ICD"])
dataset.set_task(mortality_prediction_mimic3_fn)

model = Transformer(dataset=dataset, feature_keys=["conditions", "procedures"])
trainer = Trainer(model=model)
trainer.train(train_dataloader, val_dataloader)
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
