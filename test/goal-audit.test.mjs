import assert from "node:assert/strict";
import { test } from "node:test";

import { formatGoalAudit, runGoalAudit } from "../src/goal/audit.mjs";

test("goal audit reports the current port as incomplete with concrete gaps", async () => {
  const audit = await runGoalAudit({
    root: new URL("../", import.meta.url).pathname,
  });

  assert.equal(audit.complete, false);
  assert.equal(audit.summary.total, audit.items.length);
  assert.ok(audit.summary.met > 0);
  assert.ok(audit.summary.partial > 0);

  const byId = new Map(audit.items.map((item) => [item.id, item]));
  assert.equal(byId.get("security-threat-model")?.status, "met");
  assert.equal(byId.get("turn-start-fail-closed")?.status, "met");
  assert.equal(byId.get("local-user-installer")?.status, "met");
  assert.equal(byId.get("local-threads")?.status, "met");
  assert.equal(byId.get("thread-transcript")?.status, "met");
  assert.equal(byId.get("project-selection")?.status, "met");
  assert.equal(byId.get("streamed-agent-output")?.status, "met");
  assert.equal(byId.get("real-turn-start")?.status, "met");
  assert.equal(byId.get("approval-decisions")?.status, "met");
  assert.equal(byId.get("diff-review")?.status, "met");
  assert.equal(byId.get("git-worktree-workflows")?.status, "met");
  assert.equal(byId.get("protocol-types")?.status, "met");
  assert.equal(byId.get("package-icon-update-policy")?.status, "met");
  assert.equal(byId.get("terminal-action-surfaces")?.status, "met");
  assert.equal(byId.get("url-handler")?.status, "met");
});

test("formatGoalAudit highlights only partial or missing work", async () => {
  const audit = await runGoalAudit({
    root: new URL("../", import.meta.url).pathname,
  });
  const formatted = formatGoalAudit(audit);

  assert.match(formatted, /Complete: no/);
  assert.doesNotMatch(formatted, /real-turn-start/);
  assert.doesNotMatch(formatted, /approval-decisions/);
  assert.equal(formatted.includes("[met] security-threat-model"), false);
});
