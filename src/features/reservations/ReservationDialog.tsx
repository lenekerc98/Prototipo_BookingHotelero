import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../../i18n";

export function ReservationDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const tx = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex='0']") ?? [])
        .filter(element => element.getClientRects().length > 0);
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, []);

  return createPortal(<div className="reservation-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-5" onClick={event => event.target === event.currentTarget && onClose()}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={title} className="reservation-modal-dialog w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-2xl border border-border bg-card text-foreground shadow-2xl">
      <header data-print-ui className="flex items-center justify-between gap-3 bg-slate-900 text-white px-5 py-4">
        <h2 className="text-lg text-amber-400">{title}</h2>
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm hover:bg-slate-800">{tx("Cerrar")}</button>
      </header>
      {children}
    </div>
  </div>, document.body);
}
