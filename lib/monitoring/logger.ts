// lib/monitoring/logger.ts
import { LogEntry } from "@/types";

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private addLog(
    level: LogEntry["level"],
    message: string,
    metadata?: Record<string, unknown>
  ) {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.logs.unshift(logEntry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output
    const logMethod = console[level] || console.log;
    const prefix = `[${level.toUpperCase()}] ${logEntry.timestamp}`;

    if (metadata) {
      logMethod(prefix, message, metadata);
    } else {
      logMethod(prefix, message);
    }
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.addLog("error", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.addLog("warn", message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.addLog("info", message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      this.addLog("debug", message, metadata);
    }
  }

  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(0, count);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
