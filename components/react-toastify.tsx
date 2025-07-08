'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReactToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* All toasts portal here */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        pauseOnFocusLoss
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}
