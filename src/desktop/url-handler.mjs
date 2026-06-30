import { spawn } from "node:child_process";

export const URL_HANDLER_SCHEME = "codex-app-port:";
export const MAX_HANDLER_URL_CHARS = 2_048;
export const DEFAULT_LOCAL_UI_ORIGIN = "http://127.0.0.1:14570/";
export const LOCAL_URL_HANDLER_DESTINATIONS = Object.freeze({
  open: Object.freeze({ action: "open", sectionId: "overview", query: ["thread", "workspace"] }),
  workspace: Object.freeze({ action: "workspace", sectionId: "overview", query: ["workspace"] }),
  thread: Object.freeze({ action: "thread", sectionId: "threads", query: ["thread", "workspace"] }),
  "threads/new": Object.freeze({ action: "threads-new", sectionId: "threads", query: [] }),
  new: Object.freeze({ action: "threads-new", sectionId: "threads", query: [] }),
  settings: Object.freeze({ action: "settings", sectionId: "settings", query: [] }),
  skills: Object.freeze({ action: "skills", sectionId: "settings", query: [] }),
  automations: Object.freeze({ action: "automations", sectionId: "settings", query: [] }),
});
export const BLOCKED_OFFICIAL_DEEP_LINK_PARAMS = Object.freeze([
  "description",
  "hostId",
  "imageUrl",
  "marketplace",
  "marketplacePath",
  "mode",
  "name",
  "originUrl",
  "path",
  "prompt",
  "source",
]);

const CALLBACK_PARAM_NAMES = new Set([
  "callback",
  "code",
  "redirect_uri",
  "state",
  "token",
]);
const BLOCKED_OFFICIAL_DEEP_LINK_PARAM_SET = new Set(
  BLOCKED_OFFICIAL_DEEP_LINK_PARAMS.map((name) => name.toLowerCase()),
);

export function parseUrlHandlerInput(value) {
  const url = parseRawUrl(value);
  if (url.protocol !== URL_HANDLER_SCHEME) {
    throwRequestError("Unsupported URL scheme", "unsupported-scheme");
  }

  const callbackParams = [...url.searchParams.keys()].filter((key) =>
    CALLBACK_PARAM_NAMES.has(key),
  );
  if (callbackParams.length > 0) {
    throwRequestError("URL callback/auth parameters are not supported", "callback-params-blocked");
  }

  const sensitiveParams = [...url.searchParams.keys()].filter((key) =>
    BLOCKED_OFFICIAL_DEEP_LINK_PARAM_SET.has(key.toLowerCase()),
  );
  if (sensitiveParams.length > 0) {
    throwRequestError(
      "URL contains unsupported official deep-link parameters",
      "sensitive-params-blocked",
    );
  }

  const destination = parseDestination(url);
  const threadIdSuffix = parseThreadSuffix(url, destination);
  const workspaceId = destination.allowedQuery.has("workspace")
    ? parseWorkspaceId(url.searchParams.get("workspace"))
    : null;

  return {
    ok: true,
    accepted: false,
    reason: "url-handler-not-registered",
    scheme: "codex-app-port",
    action: destination.action,
    target: {
      threadIdSuffix,
      workspaceId,
      sectionId: destination.sectionId,
    },
    capabilities: {
      opensBrowser: false,
      startsServer: false,
      appServerTraffic: false,
      modelTraffic: false,
      commandExecution: false,
      acceptsCallbacks: false,
    },
    unknownParamCount: countUnknownParams(url, destination.allowedQuery),
  };
}

export function buildBlockedUrlHandlerResult(value) {
  const parsed = parseUrlHandlerInput(value);
  return {
    ...parsed,
    policy: {
      registeredInDesktopEntry: false,
      requiresExplicitEnablement: true,
      requiresSchemeAudit: true,
    },
  };
}

export function buildRegisteredUrlHandlerResult(value, { origin = DEFAULT_LOCAL_UI_ORIGIN } = {}) {
  const parsed = parseUrlHandlerInput(value);
  if (parsed.unknownParamCount > 0) {
    throwRequestError("URL contains unsupported parameters", "unsupported-params");
  }
  if (parsed.action === "thread" && !parsed.target.threadIdSuffix) {
    throwRequestError("Thread URL requires a thread selector", "missing-thread");
  }

  return {
    ...parsed,
    accepted: true,
    reason: "url-handler-accepted",
    localUiUrl: buildLocalUiUrl(parsed, { origin }),
    capabilities: {
      ...parsed.capabilities,
      opensBrowser: true,
    },
    policy: {
      registeredInDesktopEntry: true,
      registeredScheme: "codex-app-port",
      officialCodexSchemeRegistered: false,
      requiresExplicitEnablement: false,
      requiresSchemeAudit: false,
    },
  };
}

export function openRegisteredUrl(value, {
  origin = DEFAULT_LOCAL_UI_ORIGIN,
  opener = "xdg-open",
  spawnFn = spawn,
} = {}) {
  const result = buildRegisteredUrlHandlerResult(value, { origin });
  const child = spawnFn(opener, [result.localUiUrl], {
    detached: true,
    stdio: "ignore",
  });
  if (typeof child.unref === "function") {
    child.unref();
  }
  return {
    ...result,
    opened: true,
  };
}

export function buildLocalUiUrl(parsed, { origin = DEFAULT_LOCAL_UI_ORIGIN } = {}) {
  const url = new URL(origin);
  const hash = new URLSearchParams();
  if (parsed.target.threadIdSuffix) {
    hash.set("thread", parsed.target.threadIdSuffix);
  }
  if (parsed.target.workspaceId) {
    hash.set("workspace", parsed.target.workspaceId);
  }
  if ([...hash.keys()].length > 0) {
    url.hash = hash.toString();
  } else if (parsed.target.sectionId && parsed.target.sectionId !== "overview") {
    url.hash = parsed.target.sectionId;
  }
  return url.toString();
}

function parseRawUrl(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throwRequestError("URL is required", "missing-url");
  }
  if (value.includes("\0")) {
    throwRequestError("URL contains an invalid NUL byte", "invalid-url");
  }
  if (value.length > MAX_HANDLER_URL_CHARS) {
    throwRequestError("URL is too large", "url-too-large");
  }
  try {
    return new URL(value);
  } catch {
    throwRequestError("URL is invalid", "invalid-url");
  }
}

function parseDestination(url) {
  const host = cleanToken(url.hostname);
  const pathParts = url.pathname.split("/").filter(Boolean).map(cleanToken).filter(Boolean);
  const route = [host, ...pathParts].filter(Boolean).join("/") || "open";

  if (route === "thread" || route.startsWith("thread/")) {
    if (pathParts.length > 1) {
      throwRequestError("URL action path is not supported", "unsupported-action-path");
    }
    return buildDestination("thread", pathParts);
  }

  if (Object.hasOwn(LOCAL_URL_HANDLER_DESTINATIONS, route)) {
    return buildDestination(route, pathParts);
  }

  throwRequestError("URL action is not supported", "unsupported-action");
}

function buildDestination(route, pathParts) {
  const definition = LOCAL_URL_HANDLER_DESTINATIONS[route];
  if (!definition) {
    throwRequestError("URL action is not supported", "unsupported-action");
  }
  return {
    action: definition.action,
    sectionId: definition.sectionId,
    allowedQuery: new Set(definition.query),
    pathThreadSuffix: route === "thread" ? pathParts[0] ?? null : null,
  };
}

function parseThreadSuffix(url, destination) {
  if (!destination.allowedQuery.has("thread") && !destination.pathThreadSuffix) {
    return null;
  }
  const fromQuery = destination.allowedQuery.has("thread") ? url.searchParams.get("thread") : null;
  const fromPath = destination.pathThreadSuffix;
  if (fromQuery && fromPath && fromQuery !== fromPath) {
    throwRequestError("Thread selectors must match", "invalid-thread");
  }
  const candidate = fromQuery ?? fromPath;
  if (candidate == null || candidate.length === 0) {
    return null;
  }
  if (!/^[A-Za-z0-9_-]{8}$/.test(candidate)) {
    throwRequestError("Thread selector must be an 8-character id suffix", "invalid-thread");
  }
  return candidate;
}

function parseWorkspaceId(value) {
  if (value == null || value.length === 0) {
    return null;
  }
  if (!/^(?:default|workspace-[0-9]+)$/.test(value)) {
    throwRequestError("Workspace selector is not allowed", "invalid-workspace");
  }
  return value;
}

function countUnknownParams(url, allowedQuery) {
  let count = 0;
  for (const key of url.searchParams.keys()) {
    if (!allowedQuery.has(key)) {
      count += 1;
    }
  }
  return count;
}

function cleanToken(value) {
  if (typeof value !== "string") {
    return null;
  }
  const clean = value.replace(/[^\x20-\x7E]/g, " ").trim().toLowerCase();
  return clean || null;
}

function throwRequestError(message, code) {
  const error = new Error(message);
  error.code = code;
  throw error;
}
