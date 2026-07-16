import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Login } from '@/pages/public/Login'
import { Inicio } from '@/pages/dashboard/Inicio'
import { Calendario } from '@/pages/dashboard/Calendario'
import { Clientes } from '@/pages/dashboard/Clientes'
import { Vehiculos } from '@/pages/dashboard/Vehiculos'
import { Conductores } from '@/pages/dashboard/Conductores'
import { Cotizaciones } from '@/pages/dashboard/Cotizaciones'
import { Servicios } from '@/pages/dashboard/Servicios'
import { Pagos } from '@/pages/dashboard/Pagos'
import { Historial } from '@/pages/dashboard/Historial'
import { Perfil } from '@/pages/dashboard/Perfil'

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: 'calendario', element: <Calendario /> },
      { path: 'clientes', element: <Clientes /> },
      { path: 'vehiculos', element: <Vehiculos /> },
      { path: 'conductores', element: <Conductores /> },
      { path: 'cotizaciones', element: <Cotizaciones /> },
      { path: 'servicios', element: <Servicios /> },
      { path: 'pagos', element: <Pagos /> },
      { path: 'historial', element: <Historial /> },
      { path: 'perfil', element: <Perfil /> },
    ],
  },
])