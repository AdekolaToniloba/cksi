// components/admin/logout-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
