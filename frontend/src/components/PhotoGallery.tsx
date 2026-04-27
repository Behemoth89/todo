import type { Photo } from '../types'
import './PhotoGallery.css'

interface Props {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: Props) {
  if (photos.length === 0) {
    return <div className="empty">No photos</div>
  }

  return (
    <div className="photo-gallery">
      {photos.map(photo => (
        <div key={photo.id} className="photo">
          <img src={`/uploads/${photo.stored_filename}`} alt={photo.original_filename} />
          <span className="filename">{photo.original_filename}</span>
        </div>
      ))}
    </div>
  )
}