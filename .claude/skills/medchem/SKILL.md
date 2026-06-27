# medchem

Reason about medicinal chemistry, analogs, SAR, and lead optimization.

## When to use
When working on drug design: generating analogs, analyzing structure-activity relationships (SAR), or optimizing a lead compound.

## Key concepts
- **SAR**: how structural changes to a molecule affect its biological activity.
- **Lead optimization**: systematic modification of a hit compound to improve potency, selectivity, ADMET.
- **Bioisostere**: a structural replacement with similar biological properties.

## Datamol for molecular operations
```python
import datamol as dm

mol = dm.to_mol("CC1=CC=CC=C1")
dm.to_smiles(mol)           # canonical SMILES
dm.descriptors.mw(mol)      # molecular weight
dm.descriptors.clogp(mol)   # lipophilicity
dm.descriptors.tpsa(mol)    # topological polar surface area
```

## Lipinski Ro5 (drug-likeness)
- MW ≤ 500
- cLogP ≤ 5
- H-bond donors ≤ 5
- H-bond acceptors ≤ 10

## Common analog strategies
- Scaffold hopping, ring opening/closure, bioisosteric replacement, fluorine scan.

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
