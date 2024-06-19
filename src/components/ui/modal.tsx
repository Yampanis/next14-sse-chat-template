'use client';

import React from 'react';

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-4/5 max-w-md overflow-hidden rounded-lg bg-white shadow-lg">{children}</div>
    </div>
  );
}
