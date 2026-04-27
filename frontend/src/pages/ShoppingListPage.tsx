import { useState, useEffect } from 'react'
import { shoppingListApi, settingsApi } from '../services/api'
import type { ShoppingItem, Settings } from '../types'
import ShoppingListFilters from '../components/ShoppingListFilters'
import './ShoppingListPage.css'

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [listData, settingsData] = await Promise.all([
        shoppingListApi.list(filters),
        settingsApi.get(),
      ])
      setItems(listData.items || [])
      setSettings(settingsData)
    } catch (err) {
      console.error('Failed to load shopping list:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkBought = async (item: ShoppingItem) => {
    try {
      await fetch(`/api/shopping-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ is_bought: !item.is_bought, version: 1 }),
      })
      loadData()
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }

  return (
    <div className="shopping-list-page">
      <header className="header">
        <h1>Shopping List</h1>
      </header>
      
      <ShoppingListFilters settings={settings} filters={filters} onFilterChange={setFilters} />
      
      <main className="content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : items.length === 0 ? (
          <div className="empty">No shopping items found</div>
        ) : (
          <div className="items-list">
            {items.map(item => (
              <div key={item.id} className={`item ${item.is_bought ? 'bought' : ''}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.is_bought}
                    onChange={() => handleMarkBought(item)}
                  />
                  <div className="item-content">
                    <span className="description">{item.description}</span>
                    {item.amount && <span className="amount">{item.amount}</span>}
                    {item.price && <span className="price">${item.price.toFixed(2)}</span>}
                    <span className="todo">{item.todo?.title}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}