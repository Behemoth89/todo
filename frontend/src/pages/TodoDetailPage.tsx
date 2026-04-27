import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { todosApi, shoppingItemsApi, photosApi, usersApi, settingsApi } from '../services/api'
import type { Todo, ShoppingItem, Photo, User, Settings, ConflictError } from '../types'
import ShoppingItemList from '../components/ShoppingItemList'
import PhotoGallery from '../components/PhotoGallery'
import './TodoDetailPage.css'

export default function TodoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [todo, setTodo] = useState<Todo | null>(null)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShoppingForm, setShowShoppingForm] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)

  useEffect(() => {
    if (id) loadData()
  }, [id])

  const loadData = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [todoData, itemsData, usersData, settingsData] = await Promise.all([
        todosApi.get(id),
        shoppingItemsApi.list(id),
        usersApi.list(),
        settingsApi.get(),
      ])
      setTodo(todoData)
      setShoppingItems(itemsData)
      setUsers(usersData)
      setSettings(settingsData)
    } catch (err) {
      setError('Failed to load todo')
    } finally {
      setLoading(false)
    }
  }

  const handleShoppingItemAdd = async (item: { description: string; amount?: string; price?: number }) => {
    if (!id) return
    try {
      await shoppingItemsApi.create(id, item)
      setShowShoppingForm(false)
      loadData()
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }

  const handleShoppingItemToggle = async (item: ShoppingItem) => {
    try {
      await shoppingItemsApi.update(item.id, { ...item, is_bought: !item.is_bought, version: 1 })
      loadData()
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }

  const handlePhotoUpload = async (file: File) => {
    if (!id || !todo) return
    try {
      await photosApi.upload(id, file, todo.version)
      setShowPhotoUpload(false)
      loadData()
    } catch (err) {
      console.error('Failed to upload photo:', err)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    if (confirm('Delete this todo?')) {
      await todosApi.delete(id)
      window.location.href = '/todos'
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!todo) return <div className="error">{error || 'Todo not found'}</div>

  return (
    <div className="todo-detail-page">
      <header className="header">
        <Link to="/todos" className="back-link">← Back</Link>
        <button onClick={handleDelete} className="delete-btn">Delete</button>
      </header>
      
      <div className="detail-content">
        <div className={`status-badge ${todo.is_ready_to_execute ? 'ready' : 'not-ready'}`}>
          {todo.is_ready_to_execute ? '✓ Ready to Execute' : 'Not Ready'}
        </div>
        
        <h1>{todo.title}</h1>
        {todo.description && <p className="description">{todo.description}</p>}
        
        <div className="meta">
          {todo.priority && <span className="badge priority">{todo.priority.name}</span>}
          {todo.location && <span className="badge location">{todo.location.name}</span>}
          {todo.due_date && <span className="badge due">Due: {new Date(todo.due_date).toLocaleDateString()}</span>}
        </div>
        
        <section className="section">
          <h2>Assigned To</h2>
          <div className="assignees">
            {todo.assignees.map(a => (
              <span key={a.id} className="assignee">{a.name}</span>
            ))}
            {todo.assignees.length === 0 && <span className="empty">Unassigned</span>}
          </div>
        </section>
        
        {todo.parent_todo && (
          <section className="section">
            <h2>Blocked By</h2>
            <Link to={`/todos/${todo.parent_todo.id}`} className="parent-link">
              {todo.parent_todo.title}
            </Link>
          </section>
        )}
        
        <section className="section">
          <div className="section-header">
            <h2>Shopping Items</h2>
            <button onClick={() => setShowShoppingForm(true)}>+ Add Item</button>
          </div>
          <ShoppingItemList
            items={shoppingItems}
            onToggle={handleShoppingItemToggle}
          />
          {showShoppingForm && (
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              handleShoppingItemAdd({
                description: (form.elements.namedItem('description') as HTMLInputElement).value,
                amount: (form.elements.namedItem('amount') as HTMLInputElement).value || undefined,
                price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value) || undefined,
              })
            }}>
              <input name="description" placeholder="Description" required />
              <input name="amount" placeholder="Amount (e.g., 2 lbs)" />
              <input name="price" type="number" step="0.01" placeholder="Price" />
              <button type="submit">Add</button>
            </form>
          )}
        </section>
        
        <section className="section">
          <div className="section-header">
            <h2>Photos</h2>
            <button onClick={() => setShowPhotoUpload(true)}>+ Upload Photo</button>
          </div>
          <PhotoGallery photos={photos} />
          {showPhotoUpload && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handlePhotoUpload(file)
              }}
            />
          )}
        </section>
        
        {todo.notes && (
          <section className="section">
            <h2>Notes</h2>
            <p>{todo.notes}</p>
          </section>
        )}
      </div>
    </div>
  )
}