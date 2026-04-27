import type { ShoppingItem } from '../types'
import './ShoppingItemList.css'

interface Props {
  items: ShoppingItem[]
  onToggle: (item: ShoppingItem) => void
}

export default function ShoppingItemList({ items, onToggle }: Props) {
  if (items.length === 0) {
    return <div className="empty">No shopping items</div>
  }

  return (
    <div className="shopping-item-list">
      {items.map(item => (
        <div key={item.id} className={`item ${item.is_bought ? 'bought' : ''}`}>
          <label>
            <input
              type="checkbox"
              checked={item.is_bought}
              onChange={() => onToggle(item)}
            />
            <span className="description">{item.description}</span>
            {item.amount && <span className="amount">{item.amount}</span>}
            {item.price !== undefined && <span className="price">${item.price.toFixed(2)}</span>}
          </label>
        </div>
      ))}
    </div>
  )
}