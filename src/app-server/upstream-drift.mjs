export const OFFICIAL_CODEX_SOURCE_AUDIT = Object.freeze({
  checkedOn: "2026-07-01",
  stablePackage: "@openai/codex@0.142.5",
  stableCodexVersion: "codex-cli 0.142.5",
  stableSchemaCount: 335,
  stableDistTag: "latest",
  alphaDistTag: "0.143.0-alpha.32",
  openaiCodexHead: "042e61726d28d79cad6f307b2f3ab085861c2212",
  localSchemaStatus: "matches-stable-cli",
});

export const UPSTREAM_HEAD_METHOD_DRIFT = Object.freeze([
  driftMethod({
    method: "environment/info",
    kind: "client-request",
    upstreamStatus: "present-in-openai-codex-head",
    stableSchemaStatus: "absent-from-codex-cli-0.142.5",
    sourcePaths: [
      "codex-rs/app-server-protocol/src/protocol/common.rs",
      "codex-rs/app-server-protocol/src/protocol/v2/environment.rs",
      "codex-rs/app-server/src/request_processors/environment_processor.rs",
    ],
    localPolicy: "blocked-until-stable-schema",
    risk:
      "Connects to a configured execution environment and returns shell metadata plus a default cwd file URI.",
    requiredBeforeExposure: [
      "regenerate schemas from a stable Codex CLI that includes the method",
      "classify the method in local policy before any browser route can call it",
      "require an explicit environment-id allowlist and disabled-by-default gate",
      "return only counts or bounded shell-family metadata; never cwd file URIs, environment ids, paths, or raw payloads",
    ],
  }),
  driftMethod({
    method: "thread/items/list",
    kind: "client-request",
    upstreamStatus: "present-in-openai-codex-head",
    stableSchemaStatus: "absent-from-codex-cli-0.142.5",
    stablePredecessor: "thread/turns/items/list",
    sourcePaths: [
      "codex-rs/app-server-protocol/src/protocol/common.rs",
      "codex-rs/app-server-protocol/src/protocol/v2/thread.rs",
      "codex-rs/app-server/src/request_processors/thread_processor.rs",
    ],
    localPolicy: "blocked-until-stable-schema",
    risk:
      "Pages persisted thread items across a thread and can expose messages, tool calls, commands, patches, paths, cursors, or raw item payloads.",
    requiredBeforeExposure: [
      "regenerate schemas from a stable Codex CLI that includes the method",
      "replace or version the existing thread item route deliberately instead of silently aliasing methods",
      "keep output reduced to suffix, type, status, and count metadata only",
      "never return message text, commands, output, patches, full ids, timestamps, paths, cursors, or raw payloads",
    ],
  }),
]);

export function officialCodexSourceAudit() {
  return { ...OFFICIAL_CODEX_SOURCE_AUDIT };
}

export function upstreamHeadMethodDrift() {
  return UPSTREAM_HEAD_METHOD_DRIFT.map((entry) => ({
    ...entry,
    sourcePaths: [...entry.sourcePaths],
    requiredBeforeExposure: [...entry.requiredBeforeExposure],
  }));
}

export function upstreamHeadMethodDriftNames() {
  return UPSTREAM_HEAD_METHOD_DRIFT.map((entry) => entry.method);
}

function driftMethod(entry) {
  return Object.freeze({
    stablePredecessor: null,
    ...entry,
    sourcePaths: Object.freeze([...entry.sourcePaths]),
    requiredBeforeExposure: Object.freeze([...entry.requiredBeforeExposure]),
  });
}
