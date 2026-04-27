import { useState, useEffect } from 'react'
import { todosApi } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import type { Todo } from '../types'
import TodoCard from '../components/TodoCard'
import './MyTodosPage.css'

export default function MyTodosPage() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const data = await todosApi.list({ filter_assignee: user.id, filter_status: 'active' })
      setTodos(data.todos || [])
    } catch (err) {
      console.error('Failed to load todos:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-todos-page">
      <header className="header">
        <Link to="/todos" className="back-link">← All Todos</Link>
        <h1>My Assigned Todos</h1>
      </header>
      
      <main className="content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="empty">No todos assigned to you</div>
        ) : (
          <div className="todo-grid">
            {todos.map(todo => (
              <TodoCard key={todo.id} todo={todo} onRefresh={loadTodos} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}