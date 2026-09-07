import React from 'react';
import { UnifiedAuthModal } from './UnifiedAuthModal';

interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
  onNavigateToAdmin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginSuccess,
  onNavigateToAdmin,
}) => {
  return (
    <UnifiedAuthModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={() => {
        if (onSuccess) onSuccess();
        if (onLoginSuccess) onLoginSuccess();
      }}
      onNavigateToAdmin={onNavigateToAdmin}
    />
  );
};
