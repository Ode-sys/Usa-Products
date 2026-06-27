# pufferlib

Reinforcement learning environments and agent training workflows.

## When to use
When training reinforcement learning agents using PufferLib, which provides a clean interface over gym-style environments with efficient vectorization.

## Basic training loop
```python
import pufferlib
import pufferlib.emulation

env = pufferlib.emulation.GymnasiumPufferEnv(env_creator=make_env)
obs, _ = env.reset()

for step in range(max_steps):
    action = policy(obs)
    obs, reward, done, truncated, info = env.step(action)
    if done or truncated:
        obs, _ = env.reset()
```

## Key features
- Vectorized environments for parallel rollout collection
- Compatible with CleanRL and other RL frameworks
- Supports PettingZoo multi-agent environments

## Integration with CleanRL
PufferLib wraps environments for use with CleanRL training scripts directly.

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
