"use client";

import React, { useRef } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

interface Props {
  children: React.ReactNode;
}

const ReactQueryClientProvider = ({ children}: Props) => {
  const queryClientRef = useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryClientProvider;
