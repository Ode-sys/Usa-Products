# optimize-for-gpu

Improve GPU usage, batching, memory, and compute performance.

## When to use
When a PyTorch or JAX training loop is slow, hitting OOM errors, or underutilizing the GPU.

## Profiling first
```python
with torch.profiler.profile(activities=[torch.profiler.ProfilerActivity.CUDA]) as prof:
    model(inputs)
print(prof.key_averages().table(sort_by="cuda_time_total", row_limit=10))
```

## Common optimizations
1. **Mixed precision**: `torch.autocast("cuda", dtype=torch.float16)` — 2× speedup on Ampere+
2. **Larger batch size**: fill GPU memory. Use gradient accumulation to simulate larger batches.
3. **DataLoader workers**: `num_workers=4, pin_memory=True`
4. **torch.compile**: `model = torch.compile(model)` for PyTorch 2.0+
5. **Avoid CPU↔GPU transfers** in the training loop
6. **Use in-place operations** where safe to reduce memory allocation

## Memory debugging
```python
print(torch.cuda.memory_summary())
torch.cuda.empty_cache()
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
