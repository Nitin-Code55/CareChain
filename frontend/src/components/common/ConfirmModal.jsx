import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onCancel : undefined}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
          <div className="bg-white p-6">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                isDanger ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'
              }`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                <h3 className="text-lg font-semibold leading-6 text-slate-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-slate-500">
                    {message}
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="text-slate-400 hover:text-slate-500 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto transition-colors disabled:opacity-50 ${
                isDanger
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500'
              }`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
