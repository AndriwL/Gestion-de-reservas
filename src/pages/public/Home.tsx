import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bus,
  Building2,
  Car,
  Compass,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react'

const servicios = [
  {
    icon: Compass,
    title: 'Transporte turístico',
    desc: 'Circuitos y excursiones con guías, unidades cómodas y rutas planificadas para grupos de todo tamaño.',
  },
  {
    icon: Building2,
    title: 'Transporte corporativo',
    desc: 'Movilidad puntual y confiable para empresas: personal, eventos y visitas a clientes.',
  },
  {
    icon: Car,
    title: 'Alquiler de vehículos',
    desc: 'Autos, vans y buses disponibles por día o por proyecto, con o sin conductor.',
  },
]

const vehiculos = [
  { modelo: 'Toyota Hiace', tipo: 'Van', capacidad: '15 pasajeros', img: 'https://images.unsplash.com/photo-1601929182099-b3e5e9a3a94f?q=80&w=800&auto=format&fit=crop' },
  { modelo: 'Mercedes Sprinter', tipo: 'Minibús', capacidad: '20 pasajeros', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop' },
  { modelo: 'Volvo 9800', tipo: 'Bus', capacidad: '45 pasajeros', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop' },
  { modelo: 'Toyota Corolla', tipo: 'Auto', capacidad: '4 pasajeros', img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800&auto=format&fit=crop' },
]

const valores = [
  { icon: ShieldCheck, label: 'Seguridad', desc: 'Unidades revisadas y conductores con licencia vigente.' },
  { icon: Users, label: 'Cercanía', desc: 'Atención personalizada antes, durante y después del viaje.' },
  { icon: Bus, label: 'Puntualidad', desc: 'Rutas planificadas para llegar siempre a tiempo.' },
]

export function Home() {
  return (
    <div>
      {/* Banner principal */}
      <section className="relative overflow-hidden bg-ink-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/40" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-36">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-teal-400">
            Transporte turístico y corporativo
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
            GAL Transportes
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-300">
            Movemos personas y equipos por todo el país con flota propia, conductores
            certificados y rutas hechas a la medida de tu viaje.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-teal-400"
            >
              Solicitar información <ArrowRight size={16} />
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Acceder al panel
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de Servicios */}
      <section id="servicios" className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Servicios</p>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-extrabold text-ink-950">
          Soluciones de movilidad para cada ocasión
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {servicios.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-slate-100 p-7 shadow-panel transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
                <s.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-ink-950">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Vehículos */}
      <section id="vehiculos" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Flota</p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-extrabold text-ink-950">
            Nuestros vehículos
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vehiculos.map((v) => (
              <div
                key={v.modelo}
                className="overflow-hidden rounded-2xl bg-white shadow-panel"
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url('${v.img}')` }}
                />
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-ink-950">{v.modelo}</h3>
                  <p className="mt-1 text-sm text-slate-500">{v.tipo} · {v.capacidad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Nosotros */}
      <section id="nosotros" className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Nosotros</p>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-extrabold text-ink-950">
          Más de una década conectando destinos
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div className="space-y-6 text-slate-600">
            <div>
              <h3 className="font-display text-lg font-bold text-ink-950">Historia</h3>
              <p className="mt-1 text-sm leading-relaxed">
                GAL nació como un pequeño servicio de traslados locales y hoy opera una flota
                propia que recorre rutas turísticas y corporativas en todo el país.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink-950">Misión</h3>
              <p className="mt-1 text-sm leading-relaxed">
                Brindar transporte seguro y puntual, cuidando cada detalle del viaje de nuestros
                pasajeros.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink-950">Visión</h3>
              <p className="mt-1 text-sm leading-relaxed">
                Ser la empresa de transporte turístico y corporativo de referencia en la región.
              </p>
            </div>
          </div>
          <div className="grid gap-5">
            {valores.map((v) => (
              <div key={v.label} className="flex items-start gap-4 rounded-2xl border border-slate-100 p-5 shadow-panel">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
                  <v.icon size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-ink-950">{v.label}</h4>
                  <p className="mt-1 text-sm text-slate-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Contacto */}
      <section id="contacto" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">
              Contacto
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-ink-950">
              Conversemos sobre tu próximo viaje
            </h2>
            <ul className="mt-8 space-y-4 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-teal-600" /> Jr. Los Álamos 245, Ayacucho, Perú
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-teal-600" /> +51 966 123 456
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-teal-600" /> contacto@galtransporte.pe
              </li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-panel">
            <iframe
              title="Ubicación GAL"
              className="h-72 w-full md:h-full"
              loading="lazy"
              src="https://www.google.com/maps?q=Ayacucho,Peru&output=embed"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
