import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ConflictError as ConflictErrorType } from '../types'
import type { Todo } from '../types'

interface ConflictState {
  hasConflict: boolean
  currentVersion: number
  todo: Todo | null
}

interface OptimisticLockContextType {
  conflict: ConflictState | null
  handleConflict: (error: ConflictErrorType, todo: Todo, retryFn: () => Promise<void>) => void
  dismissConflict: () => void
}

const OptimisticLockContext = createContext<OptimisticLockContextType | null>(null)

export function OptimisticLockProvider({ children }: { children: ReactNode }) {
  const [conflict, setConflict] = useState<ConflictState | null>(null)

  const handleConflict = useCallback((
    _error: ConflictErrorType,
    todo: Todo,
    _retryFn: () => Promise<void>
  ) => {
    setConflict({
      hasConflict: true,
      currentVersion: _error.current_version,
      todo,
    })
  }, [])

  const dismissConflict = useCallback(() => {
    setConflict(null)
  }, [])

  return (
    <OptimisticLockContext.Provider value={{ conflict, handleConflict, dismissConflict }}>
      {children}
    </OptimisticLockContext.Provider>
  )
}

export function useOptimisticLock() {
  const context = useContext(OptimisticLockContext)
  if (!context) {
    throw new Error('useOptimisticLock must be used within an OptimisticLockProvider')
  }
  return context
}