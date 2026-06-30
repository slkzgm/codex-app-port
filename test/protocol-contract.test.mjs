import assert from "node:assert/strict";
import { test } from "node:test";

import {
  APP_SERVER_METHODS,
  normalizeConfigReadResponse,
  normalizeNotification,
  normalizeThreadListResponse,
  normalizeThreadReadResponse,
} from "../src/app-server/protocol.mjs";
import { sanitizeNotification } from "../src/app-server/probe.mjs";

test("protocol contracts name the app-server methods currently used", () => {
  assert.equal(APP_SERVER_METHODS.initialize, "initialize");
  assert.equal(APP_SERVER_METHODS.accountLogout, "account/logout");
  assert.equal(APP_SERVER_METHODS.configRead, "config/read");
  assert.equal(APP_SERVER_METHODS.modelList, "model/list");
  assert.equal(
    APP_SERVER_METHODS.modelProviderCapabilitiesRead,
    "modelProvider/capabilities/read",
  );
  assert.equal(APP_SERVER_METHODS.collaborationModeList, "collaborationMode/list");
  assert.equal(APP_SERVER_METHODS.threadList, "thread/list");
  assert.equal(APP_SERVER_METHODS.threadSearch, "thread/search");
  assert.equal(APP_SERVER_METHODS.threadRead, "thread/read");
  assert.equal(APP_SERVER_METHODS.threadArchive, "thread/archive");
  assert.equal(APP_SERVER_METHODS.threadUnarchive, "thread/unarchive");
  assert.equal(APP_SERVER_METHODS.threadDelete, "thread/delete");
  assert.equal(APP_SERVER_METHODS.threadSetName, "thread/name/set");
  assert.equal(APP_SERVER_METHODS.threadFork, "thread/fork");
  assert.equal(APP_SERVER_METHODS.threadRollback, "thread/rollback");
  assert.equal(APP_SERVER_METHODS.threadSettingsUpdate, "thread/settings/update");
  assert.equal(APP_SERVER_METHODS.threadStart, "thread/start");
  assert.equal(APP_SERVER_METHODS.threadCompactStart, "thread/compact/start");
  assert.equal(APP_SERVER_METHODS.threadLoadedList, "thread/loaded/list");
  assert.equal(APP_SERVER_METHODS.threadBackgroundTerminalsClean, "thread/backgroundTerminals/clean");
  assert.equal(APP_SERVER_METHODS.threadBackgroundTerminalsList, "thread/backgroundTerminals/list");
  assert.equal(
    APP_SERVER_METHODS.threadBackgroundTerminalsTerminate,
    "thread/backgroundTerminals/terminate",
  );
  assert.equal(APP_SERVER_METHODS.threadRealtimeListVoices, "thread/realtime/listVoices");
  assert.equal(APP_SERVER_METHODS.commandExec, "command/exec");
  assert.equal(APP_SERVER_METHODS.commandExecWrite, "command/exec/write");
  assert.equal(APP_SERVER_METHODS.commandExecResize, "command/exec/resize");
  assert.equal(APP_SERVER_METHODS.commandExecTerminate, "command/exec/terminate");
  assert.equal(APP_SERVER_METHODS.processSpawn, "process/spawn");
  assert.equal(APP_SERVER_METHODS.processWriteStdin, "process/writeStdin");
  assert.equal(APP_SERVER_METHODS.processResizePty, "process/resizePty");
  assert.equal(APP_SERVER_METHODS.processKill, "process/kill");
  assert.equal(APP_SERVER_METHODS.configValueWrite, "config/value/write");
  assert.equal(APP_SERVER_METHODS.configBatchWrite, "config/batchWrite");
  assert.equal(APP_SERVER_METHODS.experimentalFeatureList, "experimentalFeature/list");
  assert.equal(
    APP_SERVER_METHODS.experimentalFeatureEnablementSet,
    "experimentalFeature/enablement/set",
  );
  assert.equal(APP_SERVER_METHODS.environmentAdd, "environment/add");
  assert.equal(APP_SERVER_METHODS.configMcpServerReload, "config/mcpServer/reload");
  assert.equal(APP_SERVER_METHODS.mcpServerOauthLogin, "mcpServer/oauth/login");
  assert.equal(APP_SERVER_METHODS.mcpToolCall, "mcpServer/tool/call");
  assert.equal(APP_SERVER_METHODS.mcpResourceRead, "mcpServer/resource/read");
  assert.equal(APP_SERVER_METHODS.pluginRead, "plugin/read");
  assert.equal(APP_SERVER_METHODS.pluginShareCheckout, "plugin/share/checkout");
  assert.equal(APP_SERVER_METHODS.pluginShareList, "plugin/share/list");
  assert.equal(APP_SERVER_METHODS.pluginSkillRead, "plugin/skill/read");
  assert.equal(APP_SERVER_METHODS.pluginUninstall, "plugin/uninstall");
  assert.equal(APP_SERVER_METHODS.remoteControlClientList, "remoteControl/client/list");
  assert.equal(APP_SERVER_METHODS.remoteControlClientRevoke, "remoteControl/client/revoke");
  assert.equal(APP_SERVER_METHODS.remoteControlDisable, "remoteControl/disable");
  assert.equal(APP_SERVER_METHODS.remoteControlStatusRead, "remoteControl/status/read");
  assert.equal(APP_SERVER_METHODS.skillsConfigWrite, "skills/config/write");
  assert.equal(APP_SERVER_METHODS.skillsExtraRootsSet, "skills/extraRoots/set");
  assert.equal(APP_SERVER_METHODS.threadUnsubscribe, "thread/unsubscribe");
  assert.equal(APP_SERVER_METHODS.turnStart, "turn/start");
  assert.equal(APP_SERVER_METHODS.turnInterrupt, "turn/interrupt");
  assert.equal(APP_SERVER_METHODS.turnSteer, "turn/steer");
});

test("normalizeConfigReadResponse keeps only known config surface", () => {
  const normalized = normalizeConfigReadResponse({
    config: {
      model: "gpt-test",
      model_provider: "openai",
      approval_policy: "on-request",
      sandbox_mode: "workspace-write",
      profile: "default",
      profiles: {
        default: {
          model: "gpt-test",
        },
        invalid: "not-object",
      },
      secret: "Sensitive config value",
    },
    origins: {
      user: {
        path: "/tmp/private-config",
      },
    },
    layers: [
      {
        path: "/tmp/private-layer",
      },
    ],
    codexHome: "/tmp/private-home",
  });

  assert.equal(normalized.config.model, "gpt-test");
  assert.equal(normalized.config.model_provider, "openai");
  assert.deepEqual(Object.keys(normalized.config.profiles), ["default"]);
  assert.equal(Array.isArray(normalized.layers), true);
  const serialized = JSON.stringify(normalized);
  assert.equal(serialized.includes("Sensitive config value"), false);
  assert.equal(serialized.includes("codexHome"), false);
});

test("normalizeThreadListResponse filters invalid threads and keeps typed metadata", () => {
  const normalized = normalizeThreadListResponse({
    data: [
      {
        id: 123,
        preview: "invalid id",
      },
      {
        id: "thread-12345678",
        name: "Sensitive thread name",
        preview: "Sensitive preview",
        status: { type: "notLoaded", extra: "ignored" },
        cwd: "/tmp/private-workspace",
        createdAt: 1,
        updatedAt: 2,
        gitInfo: {
          branch: "main",
        },
      },
    ],
    nextCursor: 42,
  });

  assert.equal(normalized.data.length, 1);
  assert.equal(normalized.data[0].id, "thread-12345678");
  assert.deepEqual(normalized.data[0].status, { type: "notLoaded" });
  assert.equal(normalized.data[0].createdAt, 1);
  assert.equal(normalized.data[0].updatedAt, 2);
  assert.deepEqual(normalized.data[0].gitInfo, {});
  assert.equal(normalized.nextCursor, null);
});

test("normalizeThreadReadResponse strips raw file-change payloads", () => {
  const normalized = normalizeThreadReadResponse({
    thread: {
      id: "thread-12345678",
      cwd: "/tmp/private-workspace",
      turns: [
        {
          id: "turn-87654321",
          status: "completed",
          items: [
            {
              id: "item-message",
              type: "userMessage",
              content: "User-visible transcript text",
            },
            {
              id: "item-change",
              type: "fileChange",
              text: "Sensitive file-change text",
              content: "Sensitive file content",
              changes: [
                {
                  path: "/tmp/private-workspace/secret.txt",
                  kind: "update",
                  diff: "Sensitive raw diff",
                  command: "rm -rf /tmp/private-workspace",
                  additions: 2,
                  deletions: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const [message, fileChange] = normalized.thread.turns[0].items;
  assert.equal(message.content, "User-visible transcript text");
  assert.equal(fileChange.unsafeFieldsPresent, true);
  assert.equal(Object.hasOwn(fileChange, "text"), false);
  assert.equal(Object.hasOwn(fileChange, "content"), false);
  assert.equal(fileChange.changes[0].path, "/tmp/private-workspace/secret.txt");
  assert.equal(fileChange.changes[0].unsafeFieldsPresent, true);
  assert.equal(Object.hasOwn(fileChange.changes[0], "diff"), false);
  assert.equal(Object.hasOwn(fileChange.changes[0], "command"), false);
  const serialized = JSON.stringify(normalized);
  assert.equal(serialized.includes("Sensitive raw diff"), false);
  assert.equal(serialized.includes("Sensitive file content"), false);
  assert.equal(serialized.includes("rm -rf"), false);
});

test("normalizeNotification keeps notification metadata without text payloads", () => {
  const normalized = normalizeNotification({
    method: "turn/completed",
    params: {
      threadId: "thread-12345678",
      turn: {
        id: "turn-87654321",
        status: "completed",
        items: [
          {
            type: "agentMessage",
            text: "Sensitive streamed assistant text",
          },
        ],
      },
      item: {
        id: "item-11111111",
        type: "agentMessage",
        text: "Sensitive streamed item text",
      },
    },
  });

  assert.equal(normalized.method, "turn/completed");
  assert.equal(normalized.params.threadId, "thread-12345678");
  assert.equal(normalized.params.turn.id, "turn-87654321");
  assert.equal(normalized.params.item.type, "agentMessage");
  const serialized = JSON.stringify(normalized);
  assert.equal(serialized.includes("Sensitive streamed"), false);
  assert.equal(serialized.includes("items"), false);
});

test("sanitizeNotification summarizes terminal lifecycle without terminal payloads", () => {
  const commandOutput = sanitizeNotification({
    method: "item/commandExecution/outputDelta",
    params: {
      threadId: "thread-12345678",
      turnId: "turn-87654321",
      itemId: "item-sensitive-11111111",
      delta: "Sensitive output from /tmp/private/secret.txt",
    },
  });
  assert.equal(commandOutput.terminalLifecycle.kind, "command-execution-output");
  assert.equal(commandOutput.terminalLifecycle.itemIdSuffix, "11111111");
  assert.equal(commandOutput.terminalLifecycle.output.charCount, 45);
  assert.equal(commandOutput.terminalLifecycle.output.textReturned, false);

  const terminalInput = sanitizeNotification({
    method: "item/commandExecution/terminalInteraction",
    params: {
      threadId: "thread-12345678",
      turnId: "turn-87654321",
      itemId: "item-sensitive-22222222",
      processId: "process-sensitive-33333333",
      stdin: "password=secret\nsecond line",
    },
  });
  assert.equal(terminalInput.terminalLifecycle.kind, "terminal-interaction");
  assert.equal(terminalInput.terminalLifecycle.process.charCount, 26);
  assert.equal(terminalInput.terminalLifecycle.process.valueReturned, false);
  assert.equal(terminalInput.terminalLifecycle.process.suffixReturned, false);
  assert.equal(terminalInput.terminalLifecycle.input.lineCount, 2);

  const encodedSecret = Buffer.from("Sensitive process output").toString("base64");
  const processOutput = sanitizeNotification({
    method: "process/outputDelta",
    params: {
      processHandle: "handle-sensitive-44444444",
      stream: "stderr",
      deltaBase64: encodedSecret,
      capReached: true,
    },
  });
  assert.equal(processOutput.terminalLifecycle.kind, "process-output");
  assert.equal(processOutput.terminalLifecycle.stream, "stderr");
  assert.equal(processOutput.terminalLifecycle.output.encodedCharCount, encodedSecret.length);
  assert.equal(processOutput.terminalLifecycle.output.estimatedByteCount, 24);
  assert.equal(processOutput.terminalLifecycle.capReached, true);

  const exited = sanitizeNotification({
    method: "process/exited",
    params: {
      processHandle: "handle-sensitive-55555555",
      exitCode: 127,
      stdout: "Sensitive stdout",
      stderr: "Sensitive stderr",
      stdoutCapReached: false,
      stderrCapReached: true,
    },
  });
  assert.equal(exited.terminalLifecycle.kind, "process-exited");
  assert.equal(exited.terminalLifecycle.exitCode, 127);
  assert.equal(exited.terminalLifecycle.stdout.charCount, 16);
  assert.equal(exited.terminalLifecycle.stderr.capReached, true);

  const serialized = JSON.stringify([commandOutput, terminalInput, processOutput, exited]);
  for (const marker of [
    "Sensitive output",
    "/tmp/private",
    "password=secret",
    "process-sensitive-33333333",
    "handle-sensitive-44444444",
    "handle-sensitive-55555555",
    encodedSecret,
    "Sensitive stdout",
    "Sensitive stderr",
  ]) {
    assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
  }
});
