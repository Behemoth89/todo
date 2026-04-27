import { useState, useEffect } from 'react'
import { settingsApi } from '../services/api'
import type { Settings } from '../types'
import './SettingsPage.css'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [newLocation, setNewLocation] = useState('')
  const [newPriority, setNewPriority] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await settingsApi.get()
      setSettings(data)
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLocation = async () => {
    if (!newLocation.trim()) return
    try {
      await settingsApi.create({ category: 'location', name: newLocation.trim() })
      setNewLocation('')
      loadSettings()
    } catch (err) {
      console.error('Failed to add location:', err)
    }
  }

  const handleAddPriority = async () => {
    if (!newPriority.trim()) return
    try {
      await settingsApi.create({ category: 'priority', name: newPriority.trim() })
      setNewPriority('')
      loadSettings()
    } catch (err) {
      console.error('Failed to add priority:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this setting?')) return
    try {
      await settingsApi.delete(id)
      loadSettings()
    } catch (err) {
      console.error('Failed to delete setting:', err)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="settings-page">
      <header className="header">
        <h1>Settings</h1>
      </header>
      
      <main className="content">
        <section className="section">
          <h2>Locations</h2>
          <div className="items">
            {settings?.locations.map(loc => (
              <div key={loc.id} className="item">
                <span>{loc.name}</span>
                <button onClick={() => handleDelete(loc.id)} className="delete">×</button>
              </div>
            ))}
          </div>
          <div className="add-form">
            <input
              type="text"
              placeholder="New location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <button onClick={handleAddLocation}>Add</button>
          </div>
        </section>
        
        <section className="section">
          <h2>Priorities</h2>
          <div className="items">
            {settings?.priorities.map(pri => (
              <div key={pri.id} className="item">
                <span>{pri.name}</span>
                <button onClick={() => handleDelete(pri.id)} className="delete">×</button>
              </div>
            ))}
          </div>
          <div className="add-form">
            <input
              type="text"
              placeholder="New priority"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            />
            <button onClick={handleAddPriority}>Add</button>
          </div>
        </section>
      </main>
    </div>
  )
}