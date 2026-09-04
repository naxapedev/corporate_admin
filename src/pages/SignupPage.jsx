import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Field from '../components/Field.jsx'
import { useAuthStore } from '../stores/authStore.js'

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [validationError, setValidationError] = useState('')
  const { user, signupAdmin, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    clearError()
    return clearError
  }, [clearError])

  if (user) return <Navigate to="/dashboard" replace />

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setValidationError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }
    try {
      await signupAdmin({ username: form.username, email: form.email, password: form.password })
      navigate('/dashboard', { replace: true })
    } catch {
      // The store exposes the server error next to the form.
    }
  }

  return <main className="auth-layout">
    <section className="welcome-panel">
      <div className="brand-mark" aria-hidden="true">A</div>
      <p className="eyebrow">Workspace setup</p>
      <h1>Create your first administrator.</h1>
      <p className="welcome-copy">Set up the account that will manage departments, managers, and the rest of your team.</p>
      <div className="trust-card"><span className="status-dot" aria-hidden="true" /><div><strong>First-time setup</strong><small>This page closes after an admin is created</small></div></div>
    </section>
    <section className="auth-panel">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Admin &amp; manager portal</p>
        <h2>Create admin account</h2>
        <p className="muted">You will be signed in when setup is complete.</p>
        <Field label="Full name" name="username" autoComplete="name" minLength="2" required value={form.username} onChange={update} />
        <Field label="Email address" type="email" name="email" autoComplete="email" required value={form.email} onChange={update} />
        <Field label="Password" type="password" name="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={update} />
        <Field label="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" minLength="8" required value={form.confirmPassword} onChange={update} />
        {(validationError || error) && <div className="alert error" role="alert">{validationError || error}</div>}
        <button className="primary" disabled={loading}>{loading ? 'Creating administrator…' : 'Create administrator'}</button>
      </form>
    </section>
  </main>
}
