# datamol

Cheminformatics utilities for molecule handling and drug workflows.

## When to use
When handling molecular data: reading SMILES, computing descriptors, filtering by drug-likeness, or preprocessing molecular datasets.

## Core operations
```python
import datamol as dm

# From SMILES
mol = dm.to_mol("CC1=CC=CC=C1")

# Sanitize and standardize
mol = dm.sanitize_mol(mol)
mol = dm.standardize_mol(mol)

# Compute descriptors
props = dm.descriptors.any_rdkit_descriptor(mol)

# Drug-like filter (Ro5)
dm.descriptors.mw(mol)       # molecular weight
dm.descriptors.clogp(mol)    # lipophilicity
dm.descriptors.tpsa(mol)     # polar surface area

# Convert back
smiles = dm.to_smiles(mol)
inchi = dm.to_inchi(mol)

# Batch processing
mols = dm.to_mol(["CCO", "CCC", "CCCC"])  # list of SMILES
```

## Visualization
```python
dm.to_image(mol)        # single molecule
dm.to_image(mols)       # grid of molecules
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
