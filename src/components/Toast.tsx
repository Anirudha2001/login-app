'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX, FiInfo } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <FiCheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <FiAlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'info':
      return <FiInfo className="w-5 h-5 text-blue-500" />;
  }
};

const getBgColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
  }
};

const getTextColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'text-green-800';
    case 'error':
      return 'text-red-800';
    case 'warning':
      return 'text-yellow-800';
    case 'info':
      return 'text-blue-800';
  }
};

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <AnimatePresence>
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`mb-3 pointer-events-auto ${getBgColor(toast.type)} border rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-sm max-w-md`}
          >
            {getIcon(toast.type)}
            <span className={`flex-1 text-sm font-medium ${getTextColor(toast.type)}`}>
              {toast.message}
            </span>
            <button
              onClick={() => onRemove(toast.id)}
              className={`${getTextColor(toast.type)} hover:opacity-70 transition`}
            >
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
