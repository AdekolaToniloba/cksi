// hooks/use-alert-dialog.tsx
import { create } from "zustand";

interface AlertDialogStore {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm?: () => void;
  showAlert: (
    title: string,
    description: string,
    onConfirm?: () => void
  ) => void;
  hideAlert: () => void;
}

export const useAlertDialog = create<AlertDialogStore>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  onConfirm: undefined,
  showAlert: (title, description, onConfirm) =>
    set({ isOpen: true, title, description, onConfirm }),
  hideAlert: () =>
    set({ isOpen: false, title: "", description: "", onConfirm: undefined }),
}));
