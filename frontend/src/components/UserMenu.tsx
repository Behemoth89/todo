import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './UserMenu.css'

export default function UserMenu() {
  const { user, logout } = useAuth()

  return (
    <div className="user-menu">
      <Link to="/my-todos" className="nav-link">My Todos</Link>
      <Link to="/shopping" className="nav-link">Shopping</Link>
      <Link to="/settings" className="nav-link">Settings</Link>
      <div className="user-info">
        <span>{user?.name}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </div>
  )
}