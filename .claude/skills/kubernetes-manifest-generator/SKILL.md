# kubernetes-manifest-generator

Generate deployment, service, ingress, and config resources.

## When to use
When deploying an application to Kubernetes for the first time, or when generating manifests for a new service.

## Manifest set for a typical service
1. `deployment.yaml` — replicas, image, resource limits, liveness/readiness probes
2. `service.yaml` — ClusterIP for internal, LoadBalancer or NodePort for external
3. `ingress.yaml` — host-based routing with TLS
4. `configmap.yaml` — non-secret configuration
5. `secret.yaml` — credentials (prefer external secret operator in production)
6. `hpa.yaml` — horizontal pod autoscaler

## Required fields checklist
- [ ] Resource requests and limits on all containers
- [ ] Liveness and readiness probes
- [ ] Image tag is not `latest`
- [ ] Pod disruption budget for stateful workloads
- [ ] Network policy restricting ingress/egress

## Source
Skill pattern
