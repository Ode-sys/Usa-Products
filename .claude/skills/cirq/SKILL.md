# cirq

Quantum circuits, simulation patterns, and quantum experiment code.

## When to use
When designing, simulating, or analyzing quantum circuits using Google's Cirq framework.

## Basic circuit
```python
import cirq

# Define qubits
q0, q1 = cirq.LineQubit.range(2)

# Build circuit
circuit = cirq.Circuit(
    cirq.H(q0),            # Hadamard gate
    cirq.CNOT(q0, q1),     # entangle
    cirq.measure(q0, q1, key="result")
)

print(circuit)

# Simulate
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1000)
print(result.histogram(key="result"))
```

## Key gates
- `cirq.H` — Hadamard
- `cirq.X`, `cirq.Y`, `cirq.Z` — Pauli gates
- `cirq.CNOT` — controlled-NOT
- `cirq.Rz(rads)` — rotation around Z

## Noise simulation
```python
noisy = circuit.with_noise(cirq.depolarize(p=0.01))
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
