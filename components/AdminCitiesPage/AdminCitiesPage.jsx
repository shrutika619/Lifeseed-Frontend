"use client"
import React, { useState, useEffect } from 'react'
import { adminCityService } from '@/app/services/admin/adminCity.service'

export default function AdminCitiesPage() {
  const [cities, setCities]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [modalOpen, setModalOpen]   = useState(false)
  const [form, setForm]             = useState({ name: '' })
  const [toast, setToast]           = useState(null)
  const [search, setSearch]         = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [activeFilter, setActiveFilter] = useState('All') 

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  // 1. FETCH CITIES
  const fetchCities = async (signal) => {
    setLoading(true)
    try {
      const res = await adminCityService.getAllCities(signal)
      if (res.canceled) return
      
      if (res.success && res.data) {
        const mappedData = res.data.map(c => ({
          id: c._id,
          name: c.name,
          slug: `/clinic/${c.name.toLowerCase().replace(/\s+/g, '-')}`,
          visible: c.isActive
        }))
        setCities(mappedData)
      } else {
        showToast(res.message || "Failed to load cities", "error")
      }
    } catch (error) {
      if (!error?.canceled) showToast("Error connecting to server", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchCities(controller.signal)
    return () => controller.abort()
  }, [])

  // 2. ADD NEW CITY
  const handleAdd = async () => {
    if (!form.name.trim()) { showToast('City name required', 'error'); return }
    
    setIsSubmitting(true)
    try {
      const payload = { name: form.name.trim() }
      const res = await adminCityService.createCity(payload)
      
      if (res.success && res.data) {
        showToast('City added successfully')
        setForm({ name: '' })
        setModalOpen(false)
        fetchCities() 
      } else {
        showToast(res.message || "Failed to add city", "error")
      }
    } catch (error) {
      showToast(error.message || "Server Error", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. TOGGLE VISIBILITY (PUT)
  const toggleVisible = async (city) => {
    // Optimistic UI update
    setCities(p => p.map(c => c.id === city.id ? { ...c, visible: !c.visible } : c))
    
    try {
      // ✅ Included both "name" and "isActive" in the PUT payload
      const payload = { 
        name: city.name, 
        isActive: !city.visible 
      }
      
      const res = await adminCityService.updateCity(city.id, payload)
      
      if (res.success) {
        showToast(`City ${!city.visible ? 'set to visible' : 'is now hidden'}`)
      } else {
        // Revert on failure
        setCities(p => p.map(c => c.id === city.id ? { ...c, visible: city.visible } : c))
        showToast(res.message || "Update failed", "error")
      }
    } catch (error) {
      // Revert on error
      setCities(p => p.map(c => c.id === city.id ? { ...c, visible: city.visible } : c))
      showToast(error.message || "Server Error", "error")
    }
  }

  const filtered = cities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = 
      activeFilter === 'All' ? true : 
      activeFilter === 'Visible' ? c.visible : 
      !c.visible;

    return matchesSearch && matchesFilter;
  })

  return (
    <div style={s.page}>

      {/* Top bar */}
      <div style={s.topBar}>
        <span style={s.pageTitle}>Cities</span>
        <button style={s.addBtn} onClick={() => setModalOpen(true)}>+ Add City</button>
      </div>

      {/* Stats chips */}
      <div style={s.statsRow}>
        <button 
          onClick={() => setActiveFilter('All')}
          style={{ 
            ...s.statChip, 
            borderColor: activeFilter === 'All' ? '#2563eb' : '#e2e8f0',
            background: activeFilter === 'All' ? '#eff6ff' : '#fff',
            color: activeFilter === 'All' ? '#1d4ed8' : '#64748b'
          }}
        >
          <span style={{ fontWeight: 700 }}>{cities.length}</span>&nbsp;Total
        </button>
        
        <button 
          onClick={() => setActiveFilter('Visible')}
          style={{ 
            ...s.statChip, 
            borderColor: activeFilter === 'Visible' ? '#16a34a' : '#e2e8f0',
            background: activeFilter === 'Visible' ? '#f0fdf4' : '#fff',
            color: activeFilter === 'Visible' ? '#15803d' : '#16a34a'
          }}
        >
          <span style={{ fontWeight: 700 }}>{cities.filter(c => c.visible).length}</span>&nbsp;Visible
        </button>
        
        <button 
          onClick={() => setActiveFilter('Hidden')}
          style={{ 
            ...s.statChip, 
            borderColor: activeFilter === 'Hidden' ? '#dc2626' : '#e2e8f0',
            background: activeFilter === 'Hidden' ? '#fef2f2' : '#fff',
            color: activeFilter === 'Hidden' ? '#b91c1c' : '#dc2626'
          }}
        >
          <span style={{ fontWeight: 700 }}>{cities.filter(c => !c.visible).length}</span>&nbsp;Hidden
        </button>
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
            {loading ? (
              <tr><td colSpan={5} style={s.empty}>Loading cities...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={s.empty}>No cities found matching your criteria.</td></tr>
            ) : (
              filtered.map((city, i) => (
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
                      onClick={() => toggleVisible(city)}
                    >
                      {city.visible ? ' Hide' : '👁️ Show'}
                    </button>
                  </td>
                </tr>
              ))
            )}
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
                onKeyDown={e => e.key === 'Enter' && !isSubmitting && handleAdd()}
                disabled={isSubmitting}
              />
              {form.name && (
                <div style={s.slugPreview}>
                  Slug: <span style={{ color: '#2563eb' }}>/clinic/{form.name.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>
              )}
              <div style={s.modalFoot}>
                <button style={s.cancelBtn} onClick={() => setModalOpen(false)} disabled={isSubmitting}>Cancel</button>
                <button style={{...s.saveBtn, opacity: isSubmitting ? 0.7 : 1}} onClick={handleAdd} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Add City'}
                </button>
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
    padding: '6px 16px',
    fontSize: 13,
    color: '#64748b',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
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
    transition: 'opacity 0.2s ease'
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
    transition: 'all 0.2s'
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
    transition: 'opacity 0.2s'
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