// utils/security.ts - Fixed version (replace the broken encrypt/decrypt methods)
import crypto from "crypto";

export class SecurityUtils {
  // Generate secure random token
  static generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  // Hash sensitive data
  static hashData(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString("base64");
  }

  // Validate CSRF token
  static validateCSRFToken(token: string, sessionToken: string): boolean {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(token, "base64"),
        Buffer.from(sessionToken, "base64")
      );
    } catch (error) {
      return false;
    }
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  // Rate limiting key generation
  static generateRateLimitKey(ip: string, endpoint: string): string {
    return `rate_limit:${ip}:${endpoint}`;
  }

  // Simple encryption (for non-critical data only)
  static encrypt(text: string, key: string): string {
    const algorithm = "aes-256-gcm";
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(key, "hex"),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
  }

  // Simple decryption (for non-critical data only)
  static decrypt(encryptedText: string, key: string): string {
    const algorithm = "aes-256-gcm";
    const [ivHex, authTagHex, encrypted] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key, "hex"),
      iv
    );

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
