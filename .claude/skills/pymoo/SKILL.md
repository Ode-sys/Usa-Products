# pymoo

Run multi-objective optimization and experimental search problems.

## When to use
When optimizing a problem with multiple competing objectives (e.g., maximize accuracy while minimizing latency).

## Basic usage
```python
from pymoo.core.problem import Problem
from pymoo.algorithms.moo.nsga2 import NSGA2
from pymoo.optimize import minimize
import numpy as np

class MyProblem(Problem):
    def __init__(self):
        super().__init__(n_var=2, n_obj=2, xl=0.0, xu=1.0)

    def _evaluate(self, x, out, *args, **kwargs):
        out["F"] = np.column_stack([x[:, 0], (1 - x[:, 0]) / x[:, 1]])

problem = MyProblem()
algorithm = NSGA2(pop_size=100)
res = minimize(problem, algorithm, termination=("n_gen", 200), verbose=True)
```

## Output
`res.F` — objective values on the Pareto front
`res.X` — decision variable values on the Pareto front

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
