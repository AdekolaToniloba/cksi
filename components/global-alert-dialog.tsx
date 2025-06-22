// components/global-alert-dialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertDialog } from "@/hooks/use-alert-dialog";

export function GlobalAlertDialog() {
  const { isOpen, title, description, onConfirm, hideAlert } = useAlertDialog();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    hideAlert();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && hideAlert()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
