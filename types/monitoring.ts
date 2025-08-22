// types/monitoring.ts
export interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: ServiceHealthStatus;
  metrics: SystemMetrics;
  logs: LogEntry[];
}

export interface ServiceHealthStatus {
  database: "connected" | "disconnected";
  external_apis: "operational" | "degraded";
  server: "running" | "error";
}

export interface SystemMetrics {
  response_time: number;
  memory_usage: number;
  active_connections: number;
  uptime: number;
}

export interface LogEntry {
  level: "error" | "warn" | "info" | "debug";
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface MetricData {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags?: Record<string, string>;
}
