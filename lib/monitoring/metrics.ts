// lib/monitoring/metrics.ts
import { SystemMetrics, MetricData } from "@/types";

class MetricsCollector {
  private metrics: MetricData[] = [];
  private maxMetrics = 10000;

  collect(
    name: string,
    value: number,
    unit: string,
    tags?: Record<string, string>
  ) {
    const metric: MetricData = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      tags,
    };

    this.metrics.unshift(metric);

    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(0, this.maxMetrics);
    }
  }

  getSystemMetrics(): SystemMetrics {
    const now = Date.now();
    const processStart = process.uptime() * 1000;
    const memoryUsage = process.memoryUsage();

    return {
      response_time: this.getAverageResponseTime(),
      memory_usage:
        Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100, // MB
      active_connections: this.getActiveConnections(),
      uptime: Math.round(processStart / 1000), // seconds
    };
  }

  private getAverageResponseTime(): number {
    const responseTimeMetrics = this.metrics
      .filter((m) => m.name === "response_time")
      .slice(0, 100); // Last 100 requests

    if (responseTimeMetrics.length === 0) return 0;

    const sum = responseTimeMetrics.reduce((acc, m) => acc + m.value, 0);
    return Math.round(sum / responseTimeMetrics.length);
  }

  private getActiveConnections(): number {
    // This would typically come from your server/database connection pool
    // For now, return a mock value
    return Math.floor(Math.random() * 10) + 1;
  }

  getMetrics(name?: string, limit = 100): MetricData[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter((m) => m.name === name);
    }

    return filtered.slice(0, limit);
  }

  clear() {
    this.metrics = [];
  }
}

export const metrics = new MetricsCollector();
