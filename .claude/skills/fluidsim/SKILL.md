# fluidsim

Computational fluid dynamics workflows and simulation setup.

## When to use
When running fluid dynamics simulations using the fluidsim Python framework (based on pseudo-spectral methods).

## Basic simulation setup
```python
from fluidsim.solvers.ns2d.solver import Simul

params = Simul.create_default_params()
params.short_name_type_run = "tutorial"
params.oper.nx = 64
params.oper.ny = 64
params.oper.Lx = params.oper.Ly = 2 * 3.14159  # 2π domain
params.time_stepping.t_end = 10.0
params.output.periods_print.print_stdout = 1.0

sim = Simul(params)
sim.time_stepping.start()
```

## Key solvers
- `ns2d` — 2D Navier-Stokes
- `ns3d` — 3D Navier-Stokes
- `sw1l` — shallow water 1 layer

## Output analysis
```python
sim.output.spatial_means.plot()
sim.output.spectra.plot1d()
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
