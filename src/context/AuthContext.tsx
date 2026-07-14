import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AdminProfile {
  id: string
  nombres: string
  apellidos: string
  correo: string
}

interface AuthContextValue {
  session: Session | null
  admin: AdminProfile | null
  loading: boolean
  error: string | null
  signIn: (usuario: string, password: string) => Promise<{ ok: boolean; message?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// El sistema está diseñado para una única cuenta administradora.
// El acceso se hace por correo + contraseña contra Supabase Auth; no existe
// pantalla de registro público en ninguna parte de la aplicación.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [admin, setAdmin] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) void loadAdminProfile(data.session.user.id)
      else setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) void loadAdminProfile(newSession.user.id)
      else {
        setAdmin(null)
        setLoading(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function loadAdminProfile(userId: string) {
    setLoading(true)
    const { data, error: profileError } = await supabase
      .from('administradores')
      .select('id, nombres, apellidos, correo')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      setError(profileError.message)
    } else if (data) {
      setAdmin(data)
    }
    setLoading(false)
  }

  async function signIn(usuario: string, password: string) {
    setError(null)
    // El campo "usuario" acepta el correo registrado del administrador único.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: usuario,
      password,
    })
    if (signInError) {
      const message = 'Usuario o contraseña incorrectos.'
      setError(message)
      return { ok: false, message }
    }
    return { ok: true }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setAdmin(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, admin, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
