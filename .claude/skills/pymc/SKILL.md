# pymc

Build Bayesian models and probabilistic analysis workflows.

## When to use
When uncertainty quantification, prior knowledge incorporation, or small-data inference is needed.

## Basic model structure
```python
import pymc as pm
import numpy as np

with pm.Model() as model:
    # Priors
    mu = pm.Normal("mu", mu=0, sigma=10)
    sigma = pm.HalfNormal("sigma", sigma=1)

    # Likelihood
    obs = pm.Normal("obs", mu=mu, sigma=sigma, observed=data)

    # Inference
    trace = pm.sample(2000, return_inferencedata=True)

# Diagnostics
pm.plot_trace(trace)
pm.summary(trace)
```

## Diagnostics checklist
- R-hat < 1.01 for all parameters
- Effective sample size (ESS) > 400
- No divergences
- Trace plots show good mixing

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
