"use client";

import { useAuthStore, User } from "@/store/auth";

interface RoleGateProps {
  allowed: Array<User["orgRole"]>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Enterprise Role-Based UI Guard
 * Only renders children if the active user possesses an allowed organization role.
 * Example: <RoleGate allowed={['ORG_ADMIN', 'SUPER_ADMIN']}>...</RoleGate>
 */
export function RoleGate({
  allowed,
  children,
  fallback = null,
}: RoleGateProps) {
  const { user } = useAuthStore();

  if (!user || !user.orgRole) {
    return <>{fallback}</>;
  }

  if (allowed.includes(user.orgRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
