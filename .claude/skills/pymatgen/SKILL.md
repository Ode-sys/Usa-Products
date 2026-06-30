# pymatgen

Materials science, structures, crystals, and computed properties.

## When to use
When working with crystal structures, phase diagrams, electronic structure calculations, or the Materials Project database.

## Core operations
```python
from pymatgen.core import Structure, Lattice, Element
from pymatgen.ext.matproj import MPRester

# Load structure from file
structure = Structure.from_file("POSCAR")
print(structure.formula, structure.volume)

# Query Materials Project
with MPRester("YOUR_API_KEY") as mpr:
    docs = mpr.materials.search(elements=["Li", "Fe", "O"], fields=["material_id", "formula_pretty", "band_gap"])

# Build structure programmatically
lattice = Lattice.cubic(4.2)
structure = Structure(lattice, ["Fe", "Fe"], [[0, 0, 0], [0.5, 0.5, 0.5]])
```

## Key modules
- `pymatgen.core` — Structure, Lattice, Element, Species
- `pymatgen.io` — VASP, Quantum ESPRESSO, CIF I/O
- `pymatgen.analysis` — phase diagrams, pourbaix diagrams, diffusion
- `pymatgen.ext.matproj` — Materials Project API

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
