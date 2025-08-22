// lib/monitoring/health.ts
import { HealthStatus, ServiceHealthStatus } from "@/types";
import { checkDatabaseHealth } from "@/lib/db";
import { logger } from "./logger";
import { metrics } from "./metrics";

export async function getHealthStatus(): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();
  let overallStatus: "healthy" | "unhealthy" = "healthy";

  // Check database
  const dbHealthy = await checkDatabaseHealth();

  // Check external APIs (mock for now)
  const externalApisHealthy = await checkExternalApis();

  // Server status
  const serverHealthy = true; // Process is running if we're here

  const services: ServiceHealthStatus = {
    database: dbHealthy ? "connected" : "disconnected",
    external_apis: externalApisHealthy ? "operational" : "degraded",
    server: serverHealthy ? "running" : "error",
  };

  // Determine overall status
  if (!dbHealthy || !serverHealthy) {
    overallStatus = "unhealthy";
  }

  const systemMetrics = metrics.getSystemMetrics();
  const recentLogs = logger.getRecentLogs(20);

  return {
    status: overallStatus,
    timestamp,
    services,
    metrics: systemMetrics,
    logs: recentLogs,
  };
}

async function checkExternalApis(): Promise<boolean> {
  try {
    // Check Paystack API
    const paystackHealthy = await checkPaystackHealth();

    // Check Cloudinary API
    const cloudinaryHealthy = await checkCloudinaryHealth();

    return paystackHealthy && cloudinaryHealthy;
  } catch (error) {
    logger.error("External API health check failed", { error });
    return false;
  }
}

async function checkPaystackHealth(): Promise<boolean> {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) return false;

    const response = await fetch("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    return response.ok;
  } catch (error) {
    logger.error("Paystack health check failed", { error });
    return false;
  }
}

async function checkCloudinaryHealth(): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) return false;

    const response = await fetch(
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto/v1/sample.jpg`,
      { method: "HEAD" }
    );

    return response.ok;
  } catch (error) {
    logger.error("Cloudinary health check failed", { error });
    return false;
  }
}
