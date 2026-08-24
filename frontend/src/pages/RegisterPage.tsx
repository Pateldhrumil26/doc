import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm.js';

export const RegisterPage: React.FC = () => {
  return (
    <div className="auth-page-wrapper">
      <RegisterForm />
    </div>
  );
};
