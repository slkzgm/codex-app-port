export const TERMINAL_ACTION_METHOD_AUDIT = Object.freeze([
  terminalMethod(
    "command/exec",
    "sandboxed-command",
    "Runs an argv vector in the app-server sandbox; still executes host code and can stream output.",
  ),
  terminalMethod(
    "command/exec/write",
    "terminal-input",
    "Writes stdin bytes to an active command/exec session.",
  ),
  terminalMethod(
    "command/exec/resize",
    "terminal-control",
    "Resizes an active command/exec PTY session.",
  ),
  terminalMethod(
    "command/exec/terminate",
    "terminal-control",
    "Terminates an active command/exec session.",
  ),
  terminalMethod(
    "process/spawn",
    "host-process",
    "Spawns an unsandboxed host process with a caller-provided cwd and environment.",
  ),
  terminalMethod(
    "process/writeStdin",
    "terminal-input",
    "Writes stdin bytes to an active process/spawn session.",
  ),
  terminalMethod(
    "process/resizePty",
    "terminal-control",
    "Resizes an active process/spawn PTY session.",
  ),
  terminalMethod(
    "process/kill",
    "terminal-control",
    "Terminates an active process/spawn session.",
  ),
  terminalMethod(
    "thread/shellCommand",
    "thread-shell",
    "Runs a shell command on a thread without inheriting the thread sandbox policy.",
  ),
  terminalMethod(
    "thread/backgroundTerminals/clean",
    "terminal-control",
    "Mutates thread background terminal state.",
  ),
  terminalMethod(
    "thread/backgroundTerminals/list",
    "terminal-control",
    "Lists running background terminal identifiers for a loaded thread.",
  ),
  terminalMethod(
    "thread/backgroundTerminals/terminate",
    "terminal-control",
    "Terminates one running background terminal by app-server process id.",
  ),
  terminalMethod(
    "turn/interrupt",
    "turn-control",
    "Interrupts a running turn and changes live session state.",
  ),
  terminalMethod("fs/writeFile", "filesystem-write", "Writes file contents through app-server."),
  terminalMethod("fs/remove", "filesystem-write", "Removes filesystem entries through app-server."),
  terminalMethod("fs/copy", "filesystem-write", "Copies filesystem entries through app-server."),
  terminalMethod(
    "fs/createDirectory",
    "filesystem-write",
    "Creates filesystem directories through app-server.",
  ),
]);

export function terminalActionMethodNames() {
  return TERMINAL_ACTION_METHOD_AUDIT.map((entry) => entry.method);
}

export function terminalActionMethodAudit() {
  return TERMINAL_ACTION_METHOD_AUDIT.map((entry) => ({ ...entry }));
}

function terminalMethod(method, category, risk) {
  return Object.freeze({
    method,
    category,
    risk,
    status: "blocked",
    browserEnabled: false,
    reason: "requires-explicit-approval-pipeline",
  });
}
