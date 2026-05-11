// lib/monitoring/volunteer-logger.ts
// Task 11: Extracted shared volunteer logging utility — replaces duplicate
// function definitions in app/api/volunteer/route.ts and app/api/volunteer/[id]/route.ts

export function logVolunteerActivity(
  action: string,
  data: Record<string, unknown>,
  level: "info" | "error" | "warn" = "info"
) {
  const timestamp = new Date().toISOString();
  const logMessage = { timestamp, action, level, ...data };

  if (level === "error") {
    console.error("[VOLUNTEER API]", JSON.stringify(logMessage));
  } else if (level === "warn") {
    console.warn("[VOLUNTEER API]", JSON.stringify(logMessage));
  } else {
    console.log("[VOLUNTEER API]", JSON.stringify(logMessage));
  }
}
