import assert from "node:assert/strict";
import { test } from "node:test";

import { createPreflightRegistry } from "../src/dev-server/preflight-registry.mjs";

test("preflight registry issues bounded one-time tokens without exposing intent", () => {
  let now = Date.parse("2026-05-16T00:00:00.000Z");
  let counter = 0;
  const registry = createPreflightRegistry({
    nowMs: () => now,
    randomToken: () => `token${String(++counter).padStart(12, "0")}`,
  });
  const intent = {
    command: "cat /tmp/private/secret.txt",
  };
  const preflight = registry.register({
    kind: "terminal-command-preflight",
    workspace: {
      id: "workspace-2",
    },
    intent,
  });

  assert.equal(preflight.tokenIssued, true);
  assert.match(preflight.token, /^preflight-/);
  assert.equal(preflight.scope.kind, "terminal-command-preflight");
  assert.equal(preflight.scope.workspaceId, "workspace-2");
  assert.equal(preflight.rawIntentStored, false);
  assert.equal(preflight.rawIntentReturned, false);
  assert.equal(preflight.intentHashReturned, false);
  assert.equal(JSON.stringify(preflight).includes("secret.txt"), false);

  const consumed = registry.consume({
    token: preflight.token,
    kind: "terminal-command-preflight",
    workspace: {
      id: "workspace-2",
    },
    intent,
  });
  assert.equal(consumed.consumed, true);
  assert.throws(
    () =>
      registry.consume({
        token: preflight.token,
        kind: "terminal-command-preflight",
        workspace: {
          id: "workspace-2",
        },
        intent,
      }),
    /already consumed/,
  );
});

test("preflight registry rejects scope mismatches and expiry", () => {
  let now = 1000;
  const registry = createPreflightRegistry({
    nowMs: () => now,
    randomToken: () => "token000000000001",
    ttlMs: 100,
  });
  const preflight = registry.register({
    kind: "file-action-preflight",
    workspace: {
      id: "default",
    },
    intent: {
      path: "safe.txt",
    },
  });

  assert.throws(
    () =>
      registry.consume({
        token: preflight.token,
        kind: "file-action-preflight",
        workspace: {
          id: "default",
        },
        intent: {
          path: "other.txt",
        },
      }),
    /scope mismatch/,
  );

  now = 1200;
  assert.throws(
    () =>
      registry.consume({
        token: preflight.token,
        kind: "file-action-preflight",
        workspace: {
          id: "default",
        },
        intent: {
          path: "safe.txt",
        },
      }),
    /Expired preflight token/,
  );
});
