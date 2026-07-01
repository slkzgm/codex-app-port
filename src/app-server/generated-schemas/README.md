# App-Server Schema Snapshot

This directory contains JSON Schema generated from the local official Codex CLI:

```sh
npm run protocol:generate
```

Current manifest: `codex-cli 0.142.5`, generated with
`codex app-server generate-json-schema --experimental`.

The snapshot is intentionally read-only input for this port. It is used to audit
method names and payload shapes before any browser API is allowed to send
prompts, approval decisions, terminal input, command execution, filesystem
writes, auth callbacks, MCP tool calls, or plugin/skill mutations.
