import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { Button } from '../common/Button.js';
import { LogIn, Lock, Mail } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      success('Welcome back to DocPad!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <div className="auth-brand-badge">📄 DocPad Studio</div>
        <h2>Sign in to your account</h2>
        <p>Access your letter pads, legal documents, and custom templates</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <div className="input-with-icon">
            <Mail size={18} className="field-icon" />
            <input
              id="login-email"
              type="email"
              className="form-input icon-input"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <div className="input-with-icon">
            <Lock size={18} className="field-icon" />
            <input
              id="login-password"
              type="password"
              className="form-input icon-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={<LogIn size={18} />}
          style={{ width: '100%', marginTop: '8px' }}
        >
          Sign In
        </Button>
      </form>

      <div className="auth-card-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};
