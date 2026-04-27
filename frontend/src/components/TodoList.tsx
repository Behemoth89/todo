import type { Todo } from '../types'
import TodoCard from './TodoCard'

interface Props {
  todos: Todo[]
  onRefresh: () => void
}

export default function TodoList({ todos, onRefresh }: Props) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Click + to create one.</p>
      </div>
    )
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoCard key={todo.id} todo={todo} onRefresh={onRefresh} />
      ))}
    </div>
  )
}