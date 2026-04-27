import { useState, useEffect } from 'react'
import { todosApi, usersApi, settingsApi } from '../services/api'
import type { Todo, User, Settings } from '../types'
import TodoList from '../components/TodoList'
import TodoForm from '../components/TodoForm'
import TodoFilters from '../components/TodoFilters'
import UserMenu from '../components/UserMenu'
import './TodoPage.css'

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({
    sort_by: 'created_at',
    sort_order: 'desc',
    filter_status: 'active',
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [todosData, usersData, settingsData] = await Promise.all([
        todosApi.list(filters),
        usersApi.list(),
        settingsApi.get(),
      ])
      setTodos(todosData.todos || [])
      setUsers(usersData)
      setSettings(settingsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (todo: Partial<Todo>) => {
    try {
      await todosApi.create(todo)
      setShowForm(false)
      loadData()
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  return (
    <div className="todo-page">
      <header className="header">
        <h1>Family Chores</h1>
        <UserMenu />
      </header>
      
      <TodoFilters filters={filters} onFilterChange={setFilters} />
      
      <main className="content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <TodoList todos={todos} onRefresh={loadData} />
        )}
      </main>
      
      <button className="fab" onClick={() => setShowForm(true)} aria-label="Add todo">
        +
      </button>
      
      {showForm && settings && (
        <TodoForm
          users={users}
          settings={settings}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}