import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildOfficialCodexSourceReport,
  compareOfficialSnapshot,
  parseGitLsRemoteHead,
  parseNpmCodexView,
} from "../scripts/check-official-codex-source.mjs";
import { officialCodexSourceAudit } from "../src/app-server/upstream-drift.mjs";

test("official source checker parses npm dist tags", () => {
  const parsed = parseNpmCodexView(
    JSON.stringify({
      "dist-tags": {
        latest: "0.142.5",
        alpha: "0.143.0-alpha.32",
      },
      version: "0.142.5",
    }),
  );

  assert.deepEqual(parsed, {
    latest: "0.142.5",
    alpha: "0.143.0-alpha.32",
  });
});

test("official source checker parses git ls-remote HEAD without using source paths", () => {
  const parsed = parseGitLsRemoteHead(
    "db887d03e1f907467e33271572dffb73bceecd6b\tHEAD\n" +
      "db887d03e1f907467e33271572dffb73bceecd6b\trefs/heads/main\n",
  );

  assert.equal(parsed, "db887d03e1f907467e33271572dffb73bceecd6b");
});

test("official source checker reports no drift for the audited snapshot", async () => {
  const snapshot = officialCodexSourceAudit();
  const report = await buildOfficialCodexSourceReport({
    npmJson: JSON.stringify({
      "dist-tags": {
        latest: snapshot.stablePackage.replace("@openai/codex@", ""),
        alpha: snapshot.alphaDistTag,
      },
      version: snapshot.stablePackage.replace("@openai/codex@", ""),
    }),
    gitLsRemote: `${snapshot.openaiCodexHead}\tHEAD\n`,
    codexVersion: snapshot.stableCodexVersion,
    manifest: {
      generator: "codex app-server generate-json-schema --experimental",
      codexVersion: snapshot.stableCodexVersion,
      schemaCount: snapshot.stableSchemaCount,
      output: "json",
    },
    schemaCount: snapshot.stableSchemaCount,
    checkedAt: "2026-07-01T00:00:00.000Z",
  });

  assert.equal(report.ok, true);
  assert.deepEqual(report.drift, []);
  assert.equal(report.current.localSchemaStatus, "matches-stable-cli");
  assert.equal(report.policy.alphaPackageNotExecuted, true);
  assert.equal(report.policy.browserRoutesBlockedUntilAudited, true);
});

test("official source checker reports package and schema drift", () => {
  const snapshot = officialCodexSourceAudit();
  const drift = compareOfficialSnapshot(snapshot, {
    ...snapshot,
    stablePackage: "@openai/codex@9.9.9",
    stableSchemaCount: snapshot.stableSchemaCount + 1,
    manifestCodexVersion: "codex-cli 9.9.9",
    manifestSchemaCount: snapshot.stableSchemaCount + 1,
  });

  assert.deepEqual(
    drift.map((entry) => entry.field),
    ["stablePackage", "stableSchemaCount", "manifestCodexVersion", "manifestSchemaCount"],
  );
});
