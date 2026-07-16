import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-ink-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500 font-display font-extrabold text-ink-950">
              G
            </span>
            <span className="font-display font-extrabold text-white">GAL</span>
          </div>
          <p className="text-sm text-slate-400">
            Transporte turístico y corporativo con flota propia y conductores certificados.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-teal-400" /> Jr. Los Álamos 245, Ayacucho, Perú
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-teal-400" /> +51 966 123 456
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-teal-400" /> contacto@galtransporte.pe
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Enlaces
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="/servicios" className="hover:text-teal-400">Servicios</a></li>
            <li><a href="/vehiculos" className="hover:text-teal-400">Vehículos</a></li>
            <li><a href="/nosotros" className="hover:text-teal-400">Nosotros</a></li>
            <li><a href="/login" className="hover:text-teal-400">Iniciar sesión</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Síguenos
          </h4>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-lg bg-ink-800 hover:bg-teal-500 hover:text-ink-950"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-lg bg-ink-800 hover:bg-teal-500 hover:text-ink-950"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Transportes GAL. Todos los derechos reservados.
      </div>
    </footer>
  )
}
