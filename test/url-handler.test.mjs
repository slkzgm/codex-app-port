import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import process from "node:process";
import { test } from "node:test";

import {
  buildBlockedUrlHandlerResult,
  buildRegisteredUrlHandlerResult,
  openRegisteredUrl,
  parseUrlHandlerInput,
} from "../src/desktop/url-handler.mjs";

const script = new URL("../scripts/url-handler.mjs", import.meta.url).pathname;

test("parseUrlHandlerInput accepts only the local port scheme and returns blocked metadata", () => {
  const result = parseUrlHandlerInput(
    "codex-app-port://thread/b0153f06?workspace=workspace-2&unused=/tmp/private",
  );

  assert.equal(result.ok, true);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "url-handler-not-registered");
  assert.equal(result.action, "thread");
  assert.equal(result.target.threadIdSuffix, "b0153f06");
  assert.equal(result.target.workspaceId, "workspace-2");
  assert.equal(result.capabilities.opensBrowser, false);
  assert.equal(result.capabilities.startsServer, false);
  assert.equal(result.capabilities.appServerTraffic, false);
  assert.equal(result.capabilities.modelTraffic, false);
  assert.equal(result.capabilities.commandExecution, false);
  assert.equal(result.unknownParamCount, 1);
  assert.equal(JSON.stringify(result).includes("/tmp/private"), false);
});

test("parseUrlHandlerInput rejects official codex scheme until callback behavior is audited", () => {
  assert.throws(
    () => parseUrlHandlerInput("codex://thread/b0153f06?workspace=default"),
    /Unsupported URL scheme/,
  );
});

test("parseUrlHandlerInput rejects callback and auth parameters without echoing values", () => {
  assert.throws(
    () =>
      parseUrlHandlerInput(
        "codex-app-port://open?code=secret-code&state=/tmp/private&redirect_uri=https://example.test/callback",
      ),
    /callback\/auth/,
  );
});

test("buildBlockedUrlHandlerResult reports registration policy", () => {
  const result = buildBlockedUrlHandlerResult("codex-app-port://open?workspace=default");

  assert.equal(result.policy.registeredInDesktopEntry, false);
  assert.equal(result.policy.requiresExplicitEnablement, true);
  assert.equal(result.policy.requiresSchemeAudit, true);
});

test("buildRegisteredUrlHandlerResult accepts only sanitized local UI targets", () => {
  const result = buildRegisteredUrlHandlerResult(
    "codex-app-port://thread/b0153f06?workspace=workspace-2",
    { origin: "http://127.0.0.1:14570/" },
  );

  assert.equal(result.accepted, true);
  assert.equal(result.capabilities.opensBrowser, true);
  assert.equal(result.capabilities.startsServer, false);
  assert.equal(result.capabilities.appServerTraffic, false);
  assert.equal(result.policy.registeredInDesktopEntry, true);
  assert.equal(result.policy.officialCodexSchemeRegistered, false);
  assert.equal(result.localUiUrl, "http://127.0.0.1:14570/#thread=b0153f06&workspace=workspace-2");
});

test("buildRegisteredUrlHandlerResult rejects unknown parameters before opening", () => {
  assert.throws(
    () =>
      buildRegisteredUrlHandlerResult(
        "codex-app-port://thread/b0153f06?workspace=default&unused=/tmp/private",
      ),
    /unsupported parameters/,
  );
});

test("openRegisteredUrl opens a loopback UI URL without a shell", () => {
  const calls = [];
  const result = openRegisteredUrl("codex-app-port://thread/b0153f06?workspace=default", {
    opener: "xdg-open",
    spawnFn(command, args, options) {
      calls.push({ command, args, options });
      return {
        unref() {
          calls.push({ unref: true });
        },
      };
    },
  });

  assert.equal(result.opened, true);
  assert.deepEqual(calls, [
    {
      command: "xdg-open",
      args: ["http://127.0.0.1:14570/#thread=b0153f06&workspace=default"],
      options: {
        detached: true,
        stdio: "ignore",
      },
    },
    { unref: true },
  ]);
});

test("url-handler script validates but does not execute URLs", () => {
  const result = spawnSync(
    process.execPath,
    [script, "--json", "codex-app-port://thread/b0153f06?workspace=default"],
    {
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, true);
  assert.equal(payload.accepted, false);
  assert.equal(payload.target.threadIdSuffix, "b0153f06");
  assert.equal(payload.capabilities.appServerTraffic, false);
  assert.equal(payload.capabilities.commandExecution, false);
});

test("url-handler script can open registered local scheme targets", () => {
  const result = spawnSync(
    process.execPath,
    [
      script,
      "--json",
      "--open",
      "--origin",
      "http://127.0.0.1:14570/",
      "codex-app-port://thread/b0153f06?workspace=default",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        CODEX_APP_PORT_OPENER: "/bin/true",
      },
    },
  );

  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.accepted, true);
  assert.equal(payload.opened, true);
  assert.equal(payload.localUiUrl, "http://127.0.0.1:14570/#thread=b0153f06&workspace=default");
});

test("url-handler script rejects unsupported URLs", () => {
  const result = spawnSync(process.execPath, [script, "--json", "codex://auth?code=secret"], {
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, false);
  assert.equal(payload.accepted, false);
  assert.equal(payload.code, "unsupported-scheme");
  assert.equal(JSON.stringify(payload).includes("secret"), false);
});
