// utils/performance.ts
export class PerformanceUtils {
  // Measure function execution time
  static measureExecutionTime<T>(
    fn: () => T | Promise<T>,
    label?: string
  ): T | Promise<T> {
    const start = performance.now();
    const result = fn();

    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`${label || "Function"} execution time: ${end - start}ms`);
      });
    } else {
      const end = performance.now();
      console.log(`${label || "Function"} execution time: ${end - start}ms`);
      return result;
    }
  }

  // Lazy loading utility
  static createIntersectionObserver(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "10px",
      threshold: 0.1,
    };

    return new IntersectionObserver(callback, {
      ...defaultOptions,
      ...options,
    });
  }

  // Image optimization utility
  static getOptimizedImageUrl(
    src: string,
    width: number,
    quality = 75
  ): string {
    if (src.includes("cloudinary.com")) {
      // Cloudinary optimization
      return src.replace("/upload/", `/upload/w_${width},q_${quality},f_auto/`);
    }

    // Next.js Image optimization fallback
    return `/api/imageproxy?url=${encodeURIComponent(
      src
    )}&w=${width}&q=${quality}`;
  }

  // Bundle size analyzer
  static analyzeBundleSize(): void {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("Bundle analysis available in development mode");
      // Implementation would use tools like webpack-bundle-analyzer
    }
  }
}
