interface UserAction {
  action: string
  timestamp: number
  userId?: string
  details?: Record<string, unknown>
}

class UserActionLogger {
  private actions: UserAction[] = []

  log(action: string, details?: Record<string, unknown>) {
    const entry: UserAction = {
      action,
      timestamp: Date.now(),
      details,
    }
    this.actions.push(entry)
    console.log('[UserAction]', entry)
  }

  getActions(): UserAction[] {
    return [...this.actions]
  }

  clear() {
    this.actions = []
  }
}

export const userActionLogger = new UserActionLogger()