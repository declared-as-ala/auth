import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000';

const initialSignup = {
  fullName: '',
  email: '',
  password: '',
};

const initialLogin = {
  email: '',
  password: '',
};

function App() {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [signupData, setSignupData] = useState(initialSignup);
  const [loginData, setLoginData] = useState(initialLogin);
  const [token, setToken] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setCurrentUser(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setToken(data.data.accessToken);
      setCurrentUser(data.data.user);
      setMessage('Signup successful!');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setCurrentUser(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.data.accessToken);
      setCurrentUser(data.data.user);
      setMessage('Login successful!');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      setCurrentUser(data.data.user);
      setMessage('Fetched current user successfully!');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setSignupData(initialSignup);
    setLoginData(initialLogin);
    setMessage('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#f9fafb',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#020617',
          borderRadius: '1rem',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(15,23,42,0.8)',
          border: '1px solid #1f2937',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Auth Demo
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
          Test signup, login and the protected <code>/api/auth/me</code> endpoint.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              clearState();
            }}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: mode === 'signup' ? '#22c55e' : '#4b5563',
              background: mode === 'signup' ? '#16a34a' : 'transparent',
              color: '#f9fafb',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Signup
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              clearState();
            }}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: mode === 'login' ? '#3b82f6' : '#4b5563',
              background: mode === 'login' ? '#2563eb' : 'transparent',
              color: '#f9fafb',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Login
          </button>
        </div>

        {mode === 'signup' ? (
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={signupData.fullName}
                onChange={handleChange(setSignupData)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563',
                  background: '#020617',
                  color: '#f9fafb',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>Email</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleChange(setSignupData)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563',
                  background: '#020617',
                  color: '#f9fafb',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>
                Password (min 8 chars)
              </label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleChange(setSignupData)}
                required
                minLength={8}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563',
                  background: '#020617',
                  color: '#f9fafb',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: '#22c55e',
                color: '#022c22',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange(setLoginData)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563',
                  background: '#020617',
                  color: '#f9fafb',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange(setLoginData)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563',
                  background: '#020617',
                  color: '#f9fafb',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: '#3b82f6',
                color: '#e5f2ff',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.25rem', borderTop: '1px solid #111827', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Access token (short preview)</span>
            <button
              type="button"
              onClick={handleGetMe}
              disabled={!token || loading}
              style={{
                padding: '0.35rem 0.7rem',
                borderRadius: '999px',
                border: '1px solid #4b5563',
                background: token ? '#111827' : '#020617',
                color: token ? '#e5e7eb' : '#6b7280',
                cursor: token ? 'pointer' : 'not-allowed',
                fontSize: '0.8rem',
              }}
            >
              Call /me
            </button>
          </div>
          <div
            style={{
              marginTop: '0.4rem',
              fontSize: '0.75rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: '#020617',
              border: '1px dashed #1f2937',
              wordBreak: 'break-all',
              maxHeight: '4rem',
              overflow: 'auto',
            }}
          >
            {token ? `${token.slice(0, 40)}...` : 'No token yet. Signup or login first.'}
          </div>
        </div>

        {currentUser && (
          <div
            style={{
              marginTop: '1rem',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              background: '#022c22',
              border: '1px solid #065f46',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Current user</div>
            <pre
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          </div>
        )}

        {message && (
          <div
            style={{
              marginTop: '0.75rem',
              fontSize: '0.8rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.75rem',
              background: message.toLowerCase().includes('success') ? '#022c22' : '#450a0a',
              border: message.toLowerCase().includes('success') ? '1px solid #16a34a' : '1px solid #b91c1c',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

