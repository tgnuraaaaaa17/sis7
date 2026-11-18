import { useState } from 'react';
import { Link } from 'react-router';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

/** Placeholder: the form is styled and validated, but nothing is sent anywhere yet. */
export default function LoginPage() {
  useDocumentTitle('Log in');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('Sign-in is not connected yet. Authentication will be added in a later version.');
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Log in</h1>
        <p className="auth__text">Sign in to keep your visited places in your own account.</p>

        {message ? (
          <p className="notice notice--success" role="status">
            {message}
          </p>
        ) : null}

        <label className="field">
          <span className="field__label">Email</span>
          <input
            className="field__input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <input
            className="field__input"
            type="password"
            autoComplete="current-password"
            placeholder="At least 8 characters"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn btn--primary auth__submit">
          Log in
        </button>

        <p className="auth__footer">
          <Link to="/">Back to the home page</Link>
        </p>
      </form>
    </div>
  );
}
