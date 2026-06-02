import { createContext, useCallback, useContext, useState } from "react";
import Toast from "../components/toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showSuccess = useCallback((message) => {
    setToast({ message, type: "success" });
  }, []);

  const showError = useCallback((message) => {
    setToast({ message, type: "error" });
  }, []);

  const clear = useCallback(() => setToast({ message: "" }), []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Toast {...toast} onClose={clear} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
