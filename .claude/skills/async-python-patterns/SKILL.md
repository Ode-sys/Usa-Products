# async-python-patterns

Use asyncio, queues, retries, and cancellation safely.

## When to use
When writing Python code that does I/O concurrently: HTTP calls, database queries, file operations, or pub/sub.

## Key patterns

### Concurrent tasks
```python
results = await asyncio.gather(task1(), task2(), return_exceptions=True)
```

### Queue-based worker pool
```python
queue = asyncio.Queue()
workers = [asyncio.create_task(worker(queue)) for _ in range(N)]
```

### Retry with backoff
```python
for attempt in range(max_retries):
    try:
        return await operation()
    except TransientError:
        await asyncio.sleep(2 ** attempt)
```

### Cancellation
Always handle `asyncio.CancelledError` and clean up resources in `finally` blocks.

## Rules
- Never block the event loop with sync I/O. Use `run_in_executor` for blocking calls.
- Always set timeouts: `asyncio.wait_for(coro(), timeout=30)`

## Source
Skill pattern
