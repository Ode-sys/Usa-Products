# grpc-service-builder

Create protobuf contracts, service handlers, and streaming patterns.

## When to use
When building a high-performance inter-service communication layer using gRPC.

## Process
1. Define service and message types in `.proto` files.
2. Generate stubs: `protoc --python_out=. --grpc_python_out=. service.proto`
3. Implement service handlers by subclassing the generated servicer.
4. Add interceptors for auth, logging, and error handling.
5. Write client code using the generated stub.
6. Test with grpcurl or a generated test client.

## Streaming patterns
- Unary: one request, one response (default)
- Server streaming: one request, many responses
- Client streaming: many requests, one response
- Bidirectional: many requests, many responses

## Source
Skill pattern
