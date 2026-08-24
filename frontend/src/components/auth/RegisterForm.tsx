import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { Button } from '../common/Button.js';
import { UserPlus, Lock, Mail, User, Building, MapPin, Phone, Globe, FileText } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    companyGst: '',
  });

  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      error('Please complete name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      success('Account created successfully! Welcome to DocPad.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed.';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card auth-card-wide">
      <div className="auth-card-header">
        <div className="auth-brand-badge">📄 DocPad Studio</div>
        <h2>Create your account</h2>
        <p>Start designing professional corporate letterheads and documents</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                id="reg-name"
                name="name"
                type="text"
                className="form-input icon-input"
                placeholder="Sarah Connor"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Work Email *</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input icon-input"
                placeholder="sarah@enterprise.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password (min 6 characters) *</label>
          <div className="input-with-icon">
            <Lock size={18} className="field-icon" />
            <input
              id="reg-password"
              name="password"
              type="password"
              className="form-input icon-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="company-info-toggle">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowCompanyDetails(!showCompanyDetails)}
          >
            <Building size={16} />
            {showCompanyDetails ? 'Hide letterhead branding info' : '+ Add company branding info (Optional)'}
          </button>
        </div>

        {showCompanyDetails && (
          <div className="company-details-section">
            <div className="form-row">
              <div className="form-group">
                <label>Company / Organization Name</label>
                <div className="input-with-icon">
                  <Building size={16} className="field-icon" />
                  <input
                    name="companyName"
                    type="text"
                    className="form-input icon-input"
                    placeholder="Acme Corp"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>GST / Tax Registration ID</label>
                <div className="input-with-icon">
                  <FileText size={16} className="field-icon" />
                  <input
                    name="companyGst"
                    type="text"
                    className="form-input icon-input"
                    placeholder="GSTIN29ABCDE1234F"
                    value={formData.companyGst}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Official Address</label>
              <div className="input-with-icon">
                <MapPin size={16} className="field-icon" />
                <input
                  name="companyAddress"
                  type="text"
                  className="form-input icon-input"
                  placeholder="100 Innovation Blvd, Floor 4, NY 10001"
                  value={formData.companyAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="field-icon" />
                  <input
                    name="companyPhone"
                    type="text"
                    className="form-input icon-input"
                    placeholder="+1 (555) 019-2834"
                    value={formData.companyPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Website</label>
                <div className="input-with-icon">
                  <Globe size={16} className="field-icon" />
                  <input
                    name="companyWebsite"
                    type="text"
                    className="form-input icon-input"
                    placeholder="www.company.com"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={<UserPlus size={18} />}
          style={{ width: '100%', marginTop: '12px' }}
        >
          Create Account
        </Button>
      </form>

      <div className="auth-card-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
