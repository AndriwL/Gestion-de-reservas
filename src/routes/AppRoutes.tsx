import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { ProtectedRoute } from './ProtectedRoute'

import ClientesPage from '../pages/clientes/ClientesPage'
import CotizacionesPage from '../pages/cotizaciones/CotizacionesPage'
import ReservasPage from '../pages/reservas/ReservasPage'
import ServiciosPage from '../pages/servicios/ServiciosPage'
import ConductoresPage from '../pages/conductores/ConductoresPage'
import VehiculosPage from '../pages/vehiculos/VehiculosPage'
import RutasPage from '../pages/rutas/RutasPage'
import PagosPage from '../pages/pagos/PagosPage'
import ComprobantesPage from '../pages/comprobantes/ComprobantesPage'
import IncidenciasPage from '../pages/incidencias/IncidenciasPage'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/clientes" element={<ClientesPage />} />
                    <Route path="/dashboard/cotizaciones" element={<CotizacionesPage />} />
                    <Route path="/dashboard/reservas" element={<ReservasPage />} />
                    <Route path="/dashboard/servicios" element={<ServiciosPage />} />
                    <Route path="/dashboard/conductores" element={<ConductoresPage />} />
                    <Route path="/dashboard/vehiculos" element={<VehiculosPage />} />
                    <Route path="/dashboard/rutas" element={<RutasPage />} />
                    <Route path="/dashboard/pagos" element={<PagosPage />} />
                    <Route path="/dashboard/comprobantes" element={<ComprobantesPage />} />
                    <Route path="/dashboard/incidencias" element={<IncidenciasPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
