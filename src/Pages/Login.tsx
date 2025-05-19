import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError(t('auth.requiredField'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1>{t('auth.login')}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email')}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.password')}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : t('auth.login')}
          </button>
        </form>
        
        <div className="auth-links">
          <p>{t('auth.noAccount')} <Link to="/register">{t('auth.register')}</Link></p>
        </div>
        
        <div className="demo-accounts">
          <h3>Demo Accounts</h3>
          <div className="demo-account">
            <h4>Regular User</h4>
            <p><strong>Email:</strong> user@example.com</p>
            <p><strong>Password:</strong> user123</p>
          </div>
          <div className="demo-account">
            <h4>Admin User</h4>
            <p><strong>Email:</strong> admin@example.com</p>
            <p><strong>Password:</strong> admin123</p>
            <p className="admin-note">(Has access to Admin Panel)</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login; 