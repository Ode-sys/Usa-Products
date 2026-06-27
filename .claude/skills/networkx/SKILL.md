# networkx

Analyze graphs, networks, relationships, and dependencies.

## When to use
When the data has a graph structure: social networks, dependency graphs, citation networks, biological pathways, knowledge graphs.

## Core patterns
```python
import networkx as nx

G = nx.DiGraph()
G.add_edges_from([("A", "B"), ("B", "C"), ("A", "C")])

# Basic metrics
nx.degree_centrality(G)
nx.betweenness_centrality(G)
nx.pagerank(G)

# Paths
nx.shortest_path(G, "A", "C")

# Community detection
import community  # python-louvain
partition = community.best_partition(G.to_undirected())
```

## Visualization
```python
import matplotlib.pyplot as plt
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos, with_labels=True, node_size=500)
plt.savefig("graph.png")
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
