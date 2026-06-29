import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

import { integrationMethodNames } from "../src/app-server/integration-policy.mjs";
import { terminalActionMethodNames } from "../src/app-server/terminal-policy.mjs";

const SCHEMA_ROOT = new URL("../src/app-server/generated-schemas/", import.meta.url).pathname;
const JSON_ROOT = join(SCHEMA_ROOT, "json");
const CODEX_0142_ADDED_CLIENT_METHODS = Object.freeze([
  "account/rateLimitResetCredit/consume",
  "account/usage/read",
  "account/workspaceMessages/read",
  "environment/add",
  "externalAgentConfig/import/readHistories",
  "permissionProfile/list",
  "plugin/installed",
  "plugin/share/checkout",
  "remoteControl/client/list",
  "remoteControl/client/revoke",
  "remoteControl/disable",
  "remoteControl/enable",
  "remoteControl/pairing/start",
  "remoteControl/pairing/status",
  "remoteControl/status/read",
  "skills/extraRoots/set",
  "thread/backgroundTerminals/list",
  "thread/backgroundTerminals/terminate",
  "thread/delete",
  "thread/realtime/appendSpeech",
  "thread/search",
  "thread/settings/update",
]);

test("generated app-server schema snapshot covers critical client and server methods", async () => {
  const manifest = await readJson(join(SCHEMA_ROOT, "manifest.json"));
  assert.equal(manifest.generator, "codex app-server generate-json-schema --experimental");
  assert.match(manifest.codexVersion, /^codex-cli /);
  assert.equal(manifest.schemaCount, await countFiles(JSON_ROOT));

  const clientMethods = enumValues(await readJson(join(JSON_ROOT, "ClientRequest.json")));
  for (const method of [
    "initialize",
    "config/read",
    "thread/start",
    "thread/read",
    "thread/loaded/list",
    "turn/start",
    "turn/interrupt",
    "command/exec",
    "command/exec/write",
    "command/exec/resize",
    "command/exec/terminate",
    "process/spawn",
    "process/writeStdin",
    "process/kill",
    "process/resizePty",
    "skills/list",
    "plugin/list",
    "account/read",
    "mcpServerStatus/list",
    ...integrationMethodNames(),
    ...terminalActionMethodNames(),
  ]) {
    assert.equal(clientMethods.has(method), true, `missing client method ${method}`);
  }

  const serverMethods = enumValues(await readJson(join(JSON_ROOT, "ServerRequest.json")));
  for (const method of [
    "item/commandExecution/requestApproval",
    "item/fileChange/requestApproval",
    "item/permissions/requestApproval",
    "item/tool/requestUserInput",
    "mcpServer/elicitation/request",
    "attestation/generate",
    "currentTime/read",
  ]) {
    assert.equal(serverMethods.has(method), true, `missing server request ${method}`);
  }
});

test("terminal action policy names only generated client methods", async () => {
  const clientMethods = enumValues(await readJson(join(JSON_ROOT, "ClientRequest.json")));
  for (const method of terminalActionMethodNames()) {
    assert.equal(clientMethods.has(method), true, `terminal policy method not in schema ${method}`);
  }
});

test("integration policy names only generated client methods", async () => {
  const clientMethods = enumValues(await readJson(join(JSON_ROOT, "ClientRequest.json")));
  for (const method of integrationMethodNames()) {
    assert.equal(clientMethods.has(method), true, `integration policy method not in schema ${method}`);
  }
});

test("Codex 0.142 added client methods are classified by local policy", async () => {
  const clientMethods = enumValues(await readJson(join(JSON_ROOT, "ClientRequest.json")));
  const classifiedMethods = new Set([...integrationMethodNames(), ...terminalActionMethodNames()]);
  for (const method of CODEX_0142_ADDED_CLIENT_METHODS) {
    assert.equal(clientMethods.has(method), true, `new upstream method missing from schema ${method}`);
    assert.equal(classifiedMethods.has(method), true, `new upstream method not classified ${method}`);
  }
});

test("generated turn and approval schemas expose the unsafe fields that must stay gated", async () => {
  const turnStart = await readJson(join(JSON_ROOT, "v2", "TurnStartParams.json"));
  assert.deepEqual(new Set(turnStart.required), new Set(["threadId", "input"]));
  for (const property of [
    "cwd",
    "approvalPolicy",
    "approvalsReviewer",
    "sandboxPolicy",
    "permissions",
    "model",
  ]) {
    assert.equal(Object.hasOwn(turnStart.properties, property), true, `missing ${property}`);
  }

  const commandApproval = await readJson(
    join(JSON_ROOT, "CommandExecutionRequestApprovalParams.json"),
  );
  for (const property of [
    "threadId",
    "turnId",
    "itemId",
    "approvalId",
    "command",
    "cwd",
    "availableDecisions",
  ]) {
    assert.equal(Object.hasOwn(commandApproval.properties, property), true, `missing ${property}`);
  }

  const fileApproval = await readJson(join(JSON_ROOT, "FileChangeRequestApprovalParams.json"));
  for (const property of ["threadId", "turnId", "itemId", "reason", "grantRoot"]) {
    assert.equal(Object.hasOwn(fileApproval.properties, property), true, `missing ${property}`);
  }

  const turnInterrupt = await readJson(join(JSON_ROOT, "v2", "TurnInterruptParams.json"));
  assert.deepEqual(new Set(turnInterrupt.required), new Set(["threadId", "turnId"]));

  const turnSteer = await readJson(join(JSON_ROOT, "v2", "TurnSteerParams.json"));
  assert.deepEqual(new Set(turnSteer.required), new Set(["expectedTurnId", "input", "threadId"]));

  const threadUnsubscribe = await readJson(join(JSON_ROOT, "v2", "ThreadUnsubscribeParams.json"));
  assert.deepEqual(new Set(threadUnsubscribe.required), new Set(["threadId"]));

  const permissionsApproval = await readJson(
    join(JSON_ROOT, "PermissionsRequestApprovalParams.json"),
  );
  for (const property of ["threadId", "turnId", "itemId", "cwd", "reason", "permissions"]) {
    assert.equal(
      Object.hasOwn(permissionsApproval.properties, property),
      true,
      `missing ${property}`,
    );
  }
});

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function countFiles(dir) {
  let count = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(path);
    } else if (entry.isFile()) {
      count += 1;
    }
  }
  return count;
}

function enumValues(value, output = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) {
      enumValues(item, output);
    }
    return output;
  }

  if (!value || typeof value !== "object") {
    return output;
  }

  if (Array.isArray(value.enum)) {
    for (const item of value.enum) {
      if (typeof item === "string") {
        output.add(item);
      }
    }
  }

  for (const item of Object.values(value)) {
    enumValues(item, output);
  }
  return output;
}
