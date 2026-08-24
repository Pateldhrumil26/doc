import React from 'react';
import { LoginForm } from '../components/auth/LoginForm.js';

export const LoginPage: React.FC = () => {
  return (
    <div className="auth-page-wrapper">
      <LoginForm />
    </div>
  );
};
