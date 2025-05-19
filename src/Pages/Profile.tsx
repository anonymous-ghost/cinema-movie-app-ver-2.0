import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is just a mock implementation
    // In a real app, you would call an API to update the user profile
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // This is just a mock implementation
    // In a real app, you would call an API to update the password
    setMessage('Password updated successfully!');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!currentUser) {
    return null; // Will redirect to login via useEffect
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <h1>{t('profile.myProfile')}</h1>
        
        {message && <div className="success-message">{message}</div>}
        
        <div className="profile-section">
          <h2>{t('profile.personalInfo')}</h2>
          <div className="profile-info">
            <p><strong>{t('auth.name')}:</strong> {currentUser.name}</p>
            <p><strong>{t('auth.email')}:</strong> {currentUser.email}</p>
            <p><strong>Account Type:</strong> {currentUser.role === 'admin' ? 'Administrator' : 'User'}</p>
          </div>
        </div>
        
        <div className="profile-section">
          <h2>{t('profile.editProfile')}</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="name">{t('auth.name')}</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.name')}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">{t('auth.email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.email')}
                disabled
              />
              <small>Email cannot be changed</small>
            </div>
            
            <button type="submit" className="profile-button">
              {t('profile.save')}
            </button>
          </form>
        </div>
        
        <div className="profile-section">
          <h2>{t('profile.updatePassword')}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label htmlFor="password">{t('profile.newPassword')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('profile.newPassword')}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">{t('profile.confirmNewPassword')}</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('profile.confirmNewPassword')}
              />
            </div>
            
            <button type="submit" className="profile-button">
              {t('profile.updatePassword')}
            </button>
          </form>
        </div>
        
        <div className="profile-actions">
          <button onClick={() => navigate('/bookings')} className="secondary-button">
            {t('booking.myBookings')}
          </button>
          <button onClick={handleLogout} className="logout-button">
            {t('common.signOut')}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Profile; 