import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Inbox } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { TextField, TextAreaField, SelectField } from '../ui/Field'
import { Badge } from '../ui/Badge'
import { FieldConfig } from './types'
import { useRelationOptions } from './useRelationOptions'

type Row = Record<string, any>

interface EntityCrudPageProps {
  title: string
  description: string
  tableName: string
  /** Nombre de la clave primaria de la tabla. */
  primaryKey?: string
  fields: FieldConfig[]
  selectQuery?: string
  orderBy?: { column: string; ascending?: boolean }
  searchPlaceholder?: string
  searchableFields?: string[]
  newLabel?: string
  extraRowActions?: (row: Row, refresh: () => void) => ReactNode
  onBeforeSave?: (values: Row, isEdit: boolean) => Row
}

export function EntityCrudPage({
  title,
  description,
  tableName,
  primaryKey = 'id',
  fields,
  selectQuery = '*',
  orderBy,
  searchPlaceholder = 'Buscar…',
  searchableFields,
  newLabel = 'Nuevo registro',
  extraRowActions,
  onBeforeSave,
}: EntityCrudPageProps) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Row | null>(null)
  const [formValues, setFormValues] = useState<Row>({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { optionsByField } = useRelationOptions(fields)

  const tableFields = fields.filter((f) => f.showInTable !== false)
  const formFields = fields.filter((f) => !f.readOnlyInForm)
  const effectiveSearchFields = searchableFields ?? fields.filter((f) => f.type === 'text').map((f) => f.name)

  async function loadRows() {
    setLoading(true)
    setLoadError(null)
    let query = supabase.from(tableName).select(selectQuery)
    if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false })
    const { data, error } = await query
    if (error) setLoadError(error.message)
    else setRows((data as Row[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void loadRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName])

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((row) =>
      effectiveSearchFields.some((f) => String(row[f] ?? '').toLowerCase().includes(q)),
    )
  }, [rows, search, effectiveSearchFields])

  function openCreate() {
    setEditing(null)
    setFormValues({})
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(row: Row) {
    setEditing(row)
    setFormValues({ ...row })
    setFormError(null)
    setModalOpen(true)
  }

  function updateField(name: string, value: unknown) {
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)

    const payload: Row = {}
    formFields.forEach((f) => {
      let value = formValues[f.name]
      if (f.type === 'number' && value !== undefined && value !== '') value = Number(value)
      if (value === '') value = null
      payload[f.name] = value ?? null
    })

    const finalPayload = onBeforeSave ? onBeforeSave(payload, Boolean(editing)) : payload

    const { error } = editing
      ? await supabase.from(tableName).update(finalPayload).eq(primaryKey, editing[primaryKey])
      : await supabase.from(tableName).insert(finalPayload)

    setSaving(false)

    if (error) {
      setFormError(error.message)
      return
    }
    setModalOpen(false)
    await loadRows()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from(tableName).delete().eq(primaryKey, deleteTarget[primaryKey])
    setDeleting(false)
    if (error) {
      setLoadError(error.message)
      setDeleteTarget(null)
      return
    }
    setDeleteTarget(null)
    await loadRows()
  }

  function renderCellValue(field: FieldConfig, row: Row) {
    const raw = row[field.name]
    if (field.formatTable) return field.formatTable(raw, row)
    if (field.badgeTone && raw != null) return <Badge label={String(raw)} tone={field.badgeTone(raw)} />
    if (field.type === 'relation' && field.relation) {
      const rel = field.relation
      const nested = row[rel.table.replace(/s$/, '')] // heurística simple para datos anidados de join
      if (nested) return rel.labelFields.map((lf) => nested[lf]).filter(Boolean).join(' ')
      const opt = optionsByField[field.name]?.find((o) => o.value === String(raw))
      return opt?.label ?? raw ?? '—'
    }
    if (raw === null || raw === undefined || raw === '') return '—'
    return String(raw)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">Administración</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-800">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> {newLabel}
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-cyan-100 bg-white px-3 py-2.5 shadow-sm sm:max-w-xs">
        <Search size={16} className="text-cyan-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-cyan-100/80 bg-white shadow-[0_12px_35px_rgba(8,145,178,0.10)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 text-xs font-bold uppercase tracking-wide text-cyan-800">
                {tableFields.map((f) => (
                  <th key={f.name} className="whitespace-nowrap px-4 py-3">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={tableFields.length + 1} className="px-4 py-10 text-center text-ink-300">
                    Cargando registros…
                  </td>
                </tr>
              )}
              {!loading && loadError && (
                <tr>
                  <td colSpan={tableFields.length + 1} className="px-4 py-10 text-center text-coral">
                    No se pudo cargar la información: {loadError}
                  </td>
                </tr>
              )}
              {!loading && !loadError && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={tableFields.length + 1} className="px-4 py-14">
                    <div className="flex flex-col items-center gap-2 text-ink-300">
                      <Inbox size={28} />
                      <p className="text-sm">
                        {search ? 'Ningún registro coincide con la búsqueda.' : 'Todavía no hay registros. Crea el primero.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                !loadError &&
                filteredRows.map((row) => (
                  <tr key={row[primaryKey]} className="border-b border-slate-100 last:border-0 transition-colors hover:bg-cyan-50/60">
                    {tableFields.map((f) => (
                      <td key={f.name} className="whitespace-nowrap px-4 py-3 text-ink-700">
                        {renderCellValue(f, row)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {extraRowActions?.(row, loadRows)}
                        <button
                          onClick={() => openEdit(row)}
                          aria-label={`Editar ${row[primaryKey]}`}
                          className="rounded-md p-1.5 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-800"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          aria-label={`Eliminar ${row[primaryKey]}`}
                          className="rounded-md p-1.5 text-ink-400 hover:bg-coral-light hover:text-coral"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar registro' : newLabel}
        subtitle={title}
        widthClass="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {formFields.map((f) => {
              const value = formValues[f.name] ?? ''
              const wideClass = f.wide ? 'sm:col-span-2' : ''

              if (f.type === 'textarea') {
                return (
                  <div key={f.name} className={wideClass}>
                    <TextAreaField
                      id={f.name}
                      label={f.label}
                      required={f.required}
                      hint={f.hint}
                      placeholder={f.placeholder}
                      value={value}
                      onChange={(e) => updateField(f.name, e.target.value)}
                    />
                  </div>
                )
              }

              if (f.type === 'select') {
                return (
                  <div key={f.name} className={wideClass}>
                    <SelectField
                      id={f.name}
                      label={f.label}
                      required={f.required}
                      options={f.options ?? []}
                      placeholder="Selecciona una opción"
                      value={value}
                      onChange={(e) => updateField(f.name, e.target.value)}
                    />
                  </div>
                )
              }

              if (f.type === 'relation') {
                return (
                  <div key={f.name} className={wideClass}>
                    <SelectField
                      id={f.name}
                      label={f.label}
                      required={f.required}
                      options={optionsByField[f.name] ?? []}
                      placeholder="Selecciona una opción"
                      value={value}
                      onChange={(e) => updateField(f.name, e.target.value)}
                    />
                  </div>
                )
              }

              return (
                <div key={f.name} className={wideClass}>
                  <TextField
                    id={f.name}
                    label={f.label}
                    type={f.type}
                    step={f.step}
                    required={f.required}
                    hint={f.hint}
                    placeholder={f.placeholder}
                    value={value}
                    onChange={(e) => updateField(f.name, e.target.value)}
                  />
                </div>
              )
            })}
          </div>

          {formError && (
            <p className="rounded-lg bg-coral-light px-3 py-2 text-sm text-coral">{formError}</p>
          )}

          <div className="mt-2 flex justify-end gap-2 border-t border-ink-50 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear registro'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="¿Eliminar este registro?"
        description="Esta acción no se puede deshacer. El registro se eliminará de forma permanente."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
