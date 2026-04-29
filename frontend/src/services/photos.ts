import { request } from './api'

export interface Photo {
  id: string
  todoId: string
  filename: string
  url: string
  thumbnailUrl: string
  deletedAt?: string
  createdAt: string
}

export const photosApi = {
  list: (todoId?: string) =>
    request<Photo[]>(todoId ? `/todos/${todoId}/photos` : '/photos'),
  
  upload: (todoId: string, file: File) => {
    const formData = new FormData()
    formData.append('photo', file)
    return request<Photo>(`/todos/${todoId}/photos`, {
      method: 'POST',
      body: formData,
    })
  },
  
  delete: (id: string) =>
    request<void>(`/photos/${id}`, { method: 'DELETE' }),
}