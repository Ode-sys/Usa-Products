# pennylane

Differentiable quantum programming and hybrid quantum ML workflows.

## When to use
When building quantum machine learning models, variational quantum circuits, or hybrid classical-quantum algorithms.

## Basic QNode
```python
import pennylane as qml
from pennylane import numpy as np

dev = qml.device("default.qubit", wires=2)

@qml.qnode(dev)
def circuit(params):
    qml.RX(params[0], wires=0)
    qml.RY(params[1], wires=1)
    qml.CNOT(wires=[0, 1])
    return qml.expval(qml.PauliZ(0))

params = np.array([0.1, 0.2], requires_grad=True)
print(circuit(params))

# Gradient
grad = qml.grad(circuit)(params)
```

## Variational quantum eigensolver (VQE)
```python
from pennylane import qchem
H, qubits = qchem.molecular_hamiltonian(["H", "H"], np.array([[0,0,0],[0,0,0.74]]))
```

## Devices
- `default.qubit` — classical simulation
- `lightning.qubit` — fast CPU simulation
- AWS/IBM backends for real hardware

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
