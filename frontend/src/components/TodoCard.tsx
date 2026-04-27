import { Link } from 'react-router-dom'
import type { Todo } from '../types'
import './TodoCard.css'

interface Props {
  todo: Todo
  onRefresh: () => void
}

export default function TodoCard({ todo, onRefresh }: Props) {
  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completion_date

  return (
    <Link to={`/todos/${todo.id}`} className="todo-card-link">
      <div className={`todo-card ${todo.completion_date ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
        <div className="card-header">
          <h3>{todo.title}</h3>
          <span className={`status ${todo.is_ready_to_execute ? 'ready' : 'blocked'}`}>
            {todo.is_ready_to_execute ? '✓' : '○'}
          </span>
        </div>
        
        <div className="card-meta">
          {todo.priority && <span className="priority">{todo.priority.name}</span>}
          {todo.location && <span className="location">{todo.location.name}</span>}
          {todo.due_date && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              {new Date(todo.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {todo.assignees.length > 0 && (
          <div className="card-assignees">
            {todo.assignees.slice(0, 3).map(a => (
              <span key={a.id} className="assignee">{a.name}</span>
            ))}
            {todo.assignees.length > 3 && <span className="more">+{todo.assignees.length - 3}</span>}
          </div>
        )}
      </div>
    </Link>
  )
}