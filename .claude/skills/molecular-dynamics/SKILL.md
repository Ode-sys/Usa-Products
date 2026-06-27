# molecular-dynamics

MD simulation workflows and trajectory reasoning.

## When to use
When setting up, running, or analyzing molecular dynamics simulations of proteins, lipids, or small molecules.

## Standard MD workflow
1. **System preparation**: clean PDB, add hydrogens, define box, solvate with water
2. **Force field**: AMBER, CHARMM, or GROMOS
3. **Energy minimization**: remove clashes
4. **Equilibration**: NVT (constant volume/temp) then NPT (constant pressure/temp)
5. **Production run**: 100 ns–1 μs depending on the question
6. **Analysis**: RMSD, RMSF, contacts, secondary structure, binding energies

## Tools
- **GROMACS**: most common, GPU accelerated
- **OpenMM**: Python API, flexible
- **MDAnalysis**: Python trajectory analysis library

## MDAnalysis example
```python
import MDAnalysis as mda

u = mda.Universe("topology.pdb", "trajectory.xtc")
protein = u.select_atoms("protein")

for ts in u.trajectory:
    rmsd = protein.rmsd(protein, superposition=True)
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
