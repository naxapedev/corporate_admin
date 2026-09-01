import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Field from '../components/Field.jsx'
import { useAuthStore } from '../stores/authStore.js'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { user, login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    clearError()
    return clearError
  }, [clearError])
  if (user) return <Navigate to="/dashboard" replace />

  const submit = async (event) => {
    event.preventDefault()
    try {
      await login(form)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch {
      // The store exposes the request error next to the form.
    }
  }

  return <main className="auth-layout">
    <section className="welcome-panel">
      <div className="brand-mark" aria-hidden="true">A</div>
      <p className="eyebrow">Operations workspace</p>
      <h1>One place to manage your team.</h1>
      <p className="welcome-copy">Secure access for administrators and managers, backed by Universal Authentication.</p>
      <div className="trust-card"><span className="status-dot" aria-hidden="true" /><div><strong>Protected access</strong><small>Identity verified through UAI</small></div></div>
    </section>
    <section className="auth-panel">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Admin &amp; manager portal</p>
        <h2>Welcome back</h2>
        <p className="muted">Sign in with your portal account.</p>
        <Field label="Email address" type="email" name="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Field label="Password" type="password" name="password" autoComplete="current-password" minLength="8" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        {error && <div className="alert error" role="alert">{error}</div>}
        <button className="primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </section>
  </main>
}
