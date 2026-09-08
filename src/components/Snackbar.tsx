import { useEffect } from "react";

export type SnackbarTone = "success" | "error";

interface SnackbarProps {
  message: string | null;
  tone: SnackbarTone;
  onClose: () => void;
  confirm?: {
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  };
}

export default function Snackbar({ message, tone, onClose, confirm }: SnackbarProps) {
  useEffect(() => {
    if (!message) return undefined;

    if (confirm) return undefined;

    const timeoutId = window.setTimeout(onClose, 4500);
    return () => window.clearTimeout(timeoutId);
  }, [message, onClose, confirm]);

  if (!message) return null;

  const isSuccess = tone === "success";

  return (
    <div className="fixed right-5 top-5 z-50 w-[min(24rem,calc(100vw-2.5rem))]" role="status" aria-live="polite">
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur ${
          isSuccess
            ? "border-emerald-400/40 bg-emerald-950/90 text-emerald-100"
            : "border-rose-400/40 bg-rose-950/90 text-rose-100"
        }`}
      >
        <span className={`mt-0.5 text-base ${isSuccess ? "text-emerald-300" : "text-rose-300"}`} aria-hidden="true">
          {isSuccess ? "✓" : "!"}
        </span>
        <div className="flex-1">
          <p className="leading-5">{message}</p>
          {confirm && (
            <div className="mt-3 flex gap-2">
              <button type="button" className="rounded-md bg-rose-400 px-3 py-1.5 text-xs font-bold text-rose-950 hover:bg-rose-300" onClick={confirm.onConfirm}>
                {confirm.confirmLabel ?? "Yes"}
              </button>
              <button type="button" className="rounded-md border border-current/30 px-3 py-1.5 text-xs font-semibold opacity-80 hover:opacity-100" onClick={onClose}>
                {confirm.cancelLabel ?? "No"}
              </button>
            </div>
          )}
        </div>
        {!confirm && <button type="button" className="text-lg leading-none opacity-70 hover:opacity-100" onClick={onClose} aria-label="Close notification">×</button>}
      </div>
    </div>
  );
}