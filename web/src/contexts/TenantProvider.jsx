'use client';
import React, { createContext, useContext, useMemo } from 'react';

const TenantContext = createContext(null);

export function useTenant() {
  return useContext(TenantContext);
}

export function TenantProvider({ tenant, children }) {
  const memo = useMemo(() => tenant, [tenant?.id, tenant?.slug]);

  return (
    <TenantContext.Provider value={memo}>{children}</TenantContext.Provider>
  );
}
