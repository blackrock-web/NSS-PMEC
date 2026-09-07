import React from 'react';
import { SuperAdminControlCenter } from '../components/dashboard/SuperAdminControlCenter';

interface SuperAdminPageProps {
  onNavigate?: (path: string) => void;
}

export const SuperAdminPage: React.FC<SuperAdminPageProps> = ({ onNavigate }) => {
  return (
    <SuperAdminControlCenter
      onBackToPortal={() => {
        if (onNavigate) {
          onNavigate('/');
        } else {
          window.location.href = '/';
        }
      }}
    />
  );
};
