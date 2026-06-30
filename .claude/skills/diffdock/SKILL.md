# diffdock

Run docking and virtual screening style reasoning for molecules.

## When to use
When reasoning about protein-ligand docking using DiffDock, a diffusion-based docking model that predicts ligand binding poses.

## Conceptual workflow
1. Prepare the receptor: clean PDB structure, remove water/ligands, add hydrogens.
2. Prepare the ligand: generate 3D conformer from SMILES using RDKit.
3. Run DiffDock inference to generate candidate poses.
4. Score and rank poses by confidence score.
5. Visualize top poses in PyMOL or NGLview.

## Input preparation (RDKit)
```python
from rdkit import Chem
from rdkit.Chem import AllChem

mol = Chem.MolFromSmiles("CC1=CC=CC=C1")
mol = Chem.AddHs(mol)
AllChem.EmbedMolecule(mol, AllChem.ETKDG())
Chem.MolToMolFile(mol, "ligand.sdf")
```

## Interpreting results
- Confidence score > 0 indicates a plausible binding pose.
- Compare RMSD between top poses for consistency.
- Validate against known binding site residues.

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
