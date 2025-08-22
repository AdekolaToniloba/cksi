// utils/accessibility.ts
export class AccessibilityUtils {
  // Generate unique IDs for form elements
  static generateUniqueId(prefix = "element"): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check color contrast ratio
  static getContrastRatio(color1: string, color2: string): number {
    const getLuminance = (color: string) => {
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  // Validate WCAG compliance
  static isWCAGCompliant(
    contrastRatio: number,
    level: "AA" | "AAA" = "AA"
  ): boolean {
    return level === "AA" ? contrastRatio >= 4.5 : contrastRatio >= 7;
  }

  // Generate ARIA labels
  static generateAriaLabel(element: string, context?: string): string {
    if (context) {
      return `${element} for ${context}`;
    }
    return element;
  }

  // Screen reader text utility
  static createScreenReaderText(text: string): string {
    return `<span class="sr-only">${text}</span>`;
  }
}
