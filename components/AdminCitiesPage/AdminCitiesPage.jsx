"use client"
import React, { useState } from 'react'

const initialCities = [
  { id: 1, name: 'Nagpur',   slug: '/clinic/nagpur',   visible: true },
  { id: 2, name: 'Pune',     slug: '/clinic/pune',     visible: true },
  { id: 3, name: 'Kolhapur', slug: '/clinic/kolhapur', visible: true },
  { id: 4, name: 'Nashik',   slug: '/clinic/nashik',   visible: true },
]

export default function AdminCitiesPage() {
  const [cities, setCities]         = useState(initialCities)
  const [modalOpen, setModalOpen]   = useState(false)
  const [form, setForm]             = useState({ name: '' })
  const [toast, setToast]           = useState(null)
  const [search, setSearch]         = useState('')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleAdd = () => {
    if (!form.name.trim()) { showToast('City name required', 'error'); return }
    const slug = '/clinic/' + form.name.trim().toLowerCase().replace(/\s+/g, '-')
    setCities(p => [...p, { id: Date.now(), name: form.name.trim(), slug, visible: true }])
    showToast('City added')
    setForm({ name: '' })
    setModalOpen(false)
  }

  const toggleVisible = (id) => {
    setCities(p => p.map(c => c.id === id ? { ...c, visible: !c.visible } : c))
  }

  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={s.page}>

      {/* Top bar */}
      <div style={s.topBar}>
        <span style={s.pageTitle}>Cities</span>
        <button style={s.addBtn} onClick={() => setModalOpen(true)}>+ Add City</button>
      </div>

      {/* Stats chips */}
      <div style={s.statsRow}>
        <div style={s.statChip}>
          <span style={{ fontWeight: 700 }}>{cities.length}</span>&nbsp;Total
        </div>
        <div style={{ ...s.statChip, borderColor: '#22c55e', color: '#16a34a' }}>
          <span style={{ fontWeight: 700 }}>{cities.filter(c => c.visible).length}</span>&nbsp;Visible
        </div>
        <div style={{ ...s.statChip, borderColor: '#f87171', color: '#dc2626' }}>
          <span style={{ fontWeight: 700 }}>{cities.filter(c => !c.visible).length}</span>&nbsp;Hidden
        </div>
      </div>

      {/* Search */}
      <div style={s.searchRow}>
        <span style={{ fontSize: 14, color: '#94a3b8' }}>🔍</span>
        <input
          style={s.searchInput}
          placeholder="Search city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['#', 'City Name', 'Slug', 'Status', 'Action'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={s.empty}>No cities found</td></tr>
            )}
            {filtered.map((city, i) => (
              <tr key={city.id} style={{ ...s.tr, opacity: city.visible ? 1 : 0.5 }}>
                <td style={{ ...s.td, color: '#94a3b8', width: 40 }}>{i + 1}</td>
                <td style={{ ...s.td, fontWeight: 600, color: '#0f172a' }}>{city.name}</td>
                <td style={s.td}>
                  <span style={s.slugTag}>{city.slug}</span>
                </td>
                <td style={s.td}>
                  {city.visible
                    ? <span style={{ ...s.badge, background: '#dcfce7', color: '#16a34a' }}>Visible</span>
                    : <span style={{ ...s.badge, background: '#f1f5f9', color: '#94a3b8' }}>Hidden</span>}
                </td>
                <td style={s.td}>
                  <button
                    style={{
                      ...s.toggleBtn,
                      background: city.visible ? '#fef9c3' : '#f0fdf4',
                      color: city.visible ? '#92400e' : '#15803d',
                      borderColor: city.visible ? '#fde68a' : '#bbf7d0',
                    }}
                    onClick={() => toggleVisible(city.id)}
                  >
                    {city.visible ? ' Hide' : '👁️ Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add City Modal */}
      {modalOpen && (
        <div style={s.overlay} onClick={() => setModalOpen(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHead}>
              <span style={s.modalTitle}>Add City</span>
              <button style={s.closeBtn} onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <label style={s.label}>City Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                style={s.input}
                placeholder="e.g. Mumbai"
                value={form.name}
                autoFocus
                onChange={e => setForm({ name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              {form.name && (
                <div style={s.slugPreview}>
                  Slug: <span style={{ color: '#2563eb' }}>/clinic/{form.name.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>
              )}
              <div style={s.modalFoot}>
                <button style={s.cancelBtn} onClick={() => setModalOpen(false)}>Cancel</button>
                <button style={s.saveBtn} onClick={handleAdd}>Add City</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          ...s.toast,
          background: toast.type === 'error' ? '#ef4444' : '#22c55e',
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

const s = {
  page: {
    background: '#f8fafc',
    minHeight: '100vh',
    padding: '28px 32px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#334155',
    boxSizing: 'border-box',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0f172a',
  },
  addBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  statsRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 18,
  },
  statChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    padding: '5px 14px',
    fontSize: 13,
    color: '#64748b',
    background: '#fff',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '9px 14px',
    marginBottom: 16,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: 13,
    color: '#334155',
    flex: 1,
    background: 'transparent',
    fontFamily: 'inherit',
  },
  tableWrap: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 18px',
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 18px',
    fontSize: 13,
    color: '#475569',
    verticalAlign: 'middle',
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#94a3b8',
    fontSize: 13,
  },
  slugTag: {
    background: '#f1f5f9',
    borderRadius: 5,
    padding: '2px 8px',
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#2563eb',
  },
  badge: {
    display: 'inline-block',
    borderRadius: 20,
    padding: '3px 10px',
    fontSize: 12,
    fontWeight: 600,
  },
  toggleBtn: {
    border: '1px solid',
    borderRadius: 7,
    padding: '5px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    background: 'none',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  modalHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
  },
  modalTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: '#0f172a',
  },
  closeBtn: {
    background: '#f1f5f9',
    border: 'none',
    borderRadius: 6,
    width: 28,
    height: 28,
    cursor: 'pointer',
    fontSize: 13,
    color: '#64748b',
    fontFamily: 'inherit',
  },
  modalBody: {
    padding: '20px',
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 13,
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  slugPreview: {
    marginTop: 8,
    fontSize: 12,
    color: '#94a3b8',
    background: '#f8fafc',
    borderRadius: 6,
    padding: '6px 10px',
  },
  modalFoot: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    background: '#f1f5f9',
    border: 'none',
    borderRadius: 8,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  saveBtn: {
    background: '#2563eb',
    border: 'none',
    borderRadius: 8,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  toast: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    zIndex: 9999,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  },
}