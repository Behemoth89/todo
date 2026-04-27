import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import TodoPage from './pages/TodoPage'
import MyTodosPage from './pages/MyTodosPage'
import TodoDetailPage from './pages/TodoDetailPage'
import ShoppingListPage from './pages/ShoppingListPage'
import SettingsPage from './pages/SettingsPage'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Navigate to="/todos" replace /></ProtectedRoute>} />
            <Route path="/todos" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
            <Route path="/todos/:id" element={<ProtectedRoute><TodoDetailPage /></ProtectedRoute>} />
            <Route path="/my-todos" element={<ProtectedRoute><MyTodosPage /></ProtectedRoute>} />
            <Route path="/shopping" element={<ProtectedRoute><ShoppingListPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App