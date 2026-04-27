import './TodoFilters.css'

interface Props {
  filters: Record<string, string | number | boolean>
  onFilterChange: (filters: Record<string, string | number | boolean>) => void
}

export default function TodoFilters({ filters, onFilterChange }: Props) {
  const updateFilter = (key: string, value: string | number | boolean) => {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="filters">
      <select
        value={filters.sort_by as string}
        onChange={e => updateFilter('sort_by', e.target.value)}
      >
        <option value="created_at">Created</option>
        <option value="due_date">Due Date</option>
        <option value="title">Title</option>
      </select>
      
      <select
        value={filters.sort_order as string}
        onChange={e => updateFilter('sort_order', e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      
      <select
        value={filters.filter_status as string}
        onChange={e => updateFilter('filter_status', e.target.value)}
      >
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="all">All</option>
      </select>
    </div>
  )
}