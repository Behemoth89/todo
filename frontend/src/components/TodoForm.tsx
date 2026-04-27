import { useState } from 'react'
import type { Todo, User, Settings } from '../types'
import './TodoForm.css'

interface Props {
  users: User[]
  settings: Settings
  onSubmit: (todo: Partial<Todo>) => void
  onClose: () => void
}

export default function TodoForm({ users, settings, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priorityId, setPriorityId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description: description || undefined,
      priority_id: priorityId || undefined,
      location_id: locationId || undefined,
      due_date: dueDate || undefined,
      notes: notes || undefined,
      assignee_ids: assigneeIds,
    })
  }

  const toggleAssignee = (id: string) => {
    setAssigneeIds(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Todo</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={200}
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={5000}
              rows={3}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={priorityId} onChange={e => setPriorityId(e.target.value)}>
                <option value="">None</option>
                {settings.priorities.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <select value={locationId} onChange={e => setLocationId(e.target.value)}>
                <option value="">None</option>
                {settings.locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label>Assigned To</label>
            <div className="assignee-checkboxes">
              {users.map(u => (
                <label key={u.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={assigneeIds.includes(u.id)}
                    onChange={() => toggleAssignee(u.id)}
                  />
                  {u.name}
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}