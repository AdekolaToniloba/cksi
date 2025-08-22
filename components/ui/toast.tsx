// components/ui/toast.tsx
import * as React from "react";
import { Toaster } from "sonner";

export function Toast() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  );
}

// Add this to your root layout.tsx
// export { Toast }
