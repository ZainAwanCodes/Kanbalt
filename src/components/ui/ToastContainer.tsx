import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeToast } from '../../store/slices/toastSlice';
import { CheckCircle2, Info, AlertCircle, X, RotateCcw } from 'lucide-react';

export function ToastContainer() {
  const { items } = useAppSelector(state => state.toast);
  const dispatch = useAppDispatch();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {items.map(toast => (
        <ToastItem key={toast.id} toast={toast} dispatch={dispatch} />
      ))}
    </div>
  );
}

function ToastItem({ toast, dispatch }: { toast: any; dispatch: any }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-moss shrink-0" />,
    info: <Info className="w-5 h-5 text-cobalt shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
  };

  const handleUndo = () => {
    if (toast.undoAction) {
      dispatch({ type: toast.undoAction.type, payload: toast.undoAction.payload });
      dispatch(removeToast(toast.id));
    }
  };

  return (
    <div className="pointer-events-auto bg-paper border border-line shadow-lg rounded-lg p-3 flex items-center gap-3 min-w-[300px] max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      {icons[toast.type as keyof typeof icons]}
      <div className="flex-1 text-sm font-medium text-ink truncate">{toast.message}</div>
      {toast.undoAction && (
        <button 
          onClick={handleUndo}
          className="flex items-center gap-1 text-xs font-semibold text-cobalt hover:text-cobalt-dark transition-colors px-2 py-1.5 rounded-md bg-cobalt/10 hover:bg-cobalt/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Undo
        </button>
      )}
      <button 
        onClick={() => dispatch(removeToast(toast.id))}
        className="p-1 text-ink-soft hover:text-ink hover:bg-stone/10 rounded transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
