import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const ACCOUNTS = {
  lapping: { pass: '1234', role: 'lapping' },
  polish: { pass: '4321', role: 'polish' },
  rainie: { pass: '12344321', role: 'admin' }
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const account = ACCOUNTS[username];
    if (account && account.pass === password) {
      localStorage.setItem('user', JSON.stringify({ username, role: account.role }));
      navigate('/dashboard');
    } else {
      setError('帳號或密碼錯誤 (Invalid username or password)');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>研磨&拋光SECS測試專案進度</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>請登入以繼續</p>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="帳號 (Username)" 
              style={{ paddingLeft: '3rem' }}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              className="input-field" 
              placeholder="密碼 (Password)" 
              style={{ paddingLeft: '3rem' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
            登入系統 (Login)
          </button>
        </form>
      </div>
    </div>
  );
}
