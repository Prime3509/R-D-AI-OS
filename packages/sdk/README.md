# @rd/sdk

**Owner (per [Masterfile v2.4](../../docs/MASTERFILE.md) §4):** Shared logic & interfaces.

Placeholder package — reserves the `packages/sdk` slot and its six
sub-modules in the target repo layout
([Masterfile §3](../../docs/MASTERFILE.md#3-repository-structure)). No
implementation yet: extracting real shared logic out of
[`apps/nexus`](../../apps/nexus) here is premature with only one consumer —
do it once a second app (R&D Forge) needs the same abstractions, moving
concrete code rather than pre-writing speculative interfaces.

| Sub-module | Intended responsibility |
|---|---|
| [`core/`](./core) | Core types, interfaces, and standards |
| [`memory/`](./memory) | Memory abstractions & interfaces |
| [`events/`](./events) | Event bus and event types |
| [`verification/`](./verification) | Verification & reflection logic |
| [`security/`](./security) | Security utilities |
| [`utils/`](./utils) | Shared utilities |
