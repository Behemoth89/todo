import type { Settings } from '../types'
import './ShoppingListFilters.css'

interface Props {
  settings: Settings | null
  filters: Record<string, unknown>
  onFilterChange: (filters: Record<string, unknown>) => void
}

export default function ShoppingListFilters({ settings, filters, onFilterChange }: Props) {
  const updateFilter = (key: string, value: unknown) => {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="shopping-list-filters">
      <select
        value={filters.filter_bought === true ? 'bought' : filters.filter_bought === false ? 'unbought' : ''}
        onChange={e => {
          const val = e.target.value
          updateFilter('filter_bought', val === 'bought' ? true : val === 'unbought' ? false : undefined)
        }}
      >
        <option value="">All Items</option>
        <option value="unbought">To Buy</option>
        <option value="bought">Bought</option>
      </select>
      
      <select
        value={filters.filter_location as string || ''}
        onChange={e => updateFilter('filter_location', e.target.value || undefined)}
      >
        <option value="">All Locations</option>
        {settings?.locations.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
    </div>
  )
}