# Phase 1 UI Design Contract

**Phase:** 1 - Foundation
**Generated:** 2026-04-28
**Status:** Ready for planning

<domain>
## Phase Scope

Frontend for authentication, todo management, assignment, and settings. No existing design system — all foundations to be established.
</domain>

<visual>
## Visual Design

### Typography

- **Headings:** System font preferred, bold weights
  - H1: 28px / 1.2 line-height
  - H2: 22px / 1.3
  - H3: 18px / 1.4
- **Body:** 14px / 1.5
- **Small:** 12px / 1.4

### Color Palette

- **Primary:** #2563eb (Blue-600)
- **Primary Hover:** #1d4ed8 (Blue-700)
- **Secondary:** #64748b (Slate-500)
- **Background:** #ffffff
- **Surface:** #f8fafc (Slate-50)
- **Border:** #e2e8f0 (Slate-200)
- **Text Primary:** #0f172a (Slate-900)
- **Text Secondary:** #64748b (Slate-500)
- **Success:** #22c55e (Green-500)
- **Warning:** #f59e0b (Amber-500)
- **Error:** #ef4444 (Red-500)

### Spacing

- **Base unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48px
- **Container max-width:** 640px
- **Card padding:** 16px
- **Section gap:** 24px

### Effects

- **Border radius:** 6px (buttons), 8px (cards), 12px (modals)
- **Shadows:**
  - Card: 0 1px 3px rgba(0,0,0,0.1)
  - Hover: 0 4px 6px rgba(0,0,0,0.1)
  - Modal: 0 10px 25px rgba(0,0,0,0.15)

</visual>

<components>
## Component Specifications

### Forms

- **Input height:** 40px
- **Input padding:** 12px horizontal
- **Input border:** 1px solid #e2e8f0
- **Input focus:** 2px ring primary color
- **Label:** 14px, medium weight, #0f172a
- **Error text:** 12px, #ef4444
- **Button height:** 40px (primary), 36px (small)

### Todo Card

- **Min-height:** 80px
- **Priority indicator:** 4px left border with priority color
  - High: #ef4444
  - Medium: #f59e0b
  - Low: #22c55e
- **Assignee avatars:** 28px circles, stacked with -8px overlap

### Lists

- **Item height:** 48px minimum
- **Item padding:** 12px vertical
- **Hover state:** background #f8fafc
- **Selected state:** background #eff6ff, border-left 2px primary

### Navigation

- **Header height:** 56px
- **Nav item padding:** 12px 16px
- **Mobile breakpoint:** 640px

### Modals

- **Overlay:** rgba(0,0,0,0.5)
- **Max-width:** 480px
- **Padding:** 24px
- **Close button:** top-right, 32px touch target

</components>

<patterns>
## Interaction Patterns

### Authentication Flow

1. **Login page:** Email + password fields, remember me checkbox, sign in button
2. **Signup:** Name, email, password fields with confirmation
3. **Password reset:** Email input → confirmation message

### Todo List

- Empty state: centered message + CTA button
- List: sortable headers, filter dropdowns
- Item click: expand to detail view
- Quick actions: checkbox for complete, chevron for expand

### Todo Form

- Inline creation for quick add
- Full modal for edit with all fields
- Multi-select for assignees (pill style)
- Date picker for start/due dates

### Settings

- Tab-based navigation (Members, Locations, Priorities)
- List with inline edit
- Add new button at bottom of each list
- Delete via overflow menu

### Sorting/Filtering

- Sort: dropdown at list header
- Filter: dropdown with checkboxes for multi-select
- Clear all link when filters active

</patterns>

<copy>
## Copywriting Guidelines

### Button Labels

- Primary action: "Save", "Create", "Update"
- Secondary: "Cancel"
- Destructive: "Delete" (red)

### Messages

- Success: "Changes saved"
- Error: "Something went wrong. Please try again."
- Empty: "No items yet. Click to add one."

### Placeholders

- Input: Descriptive example
- Date: "Select date"
- Select: "Choose..."

</copy>

<states>
## Component States

### Buttons

- Default: Primary background
- Hover: Darker background
- Active: Even darker
- Disabled: 50% opacity, cursor not-allowed
- Loading: Spinner icon, disabled

### Inputs

- Default: Gray border
- Focus: Primary border + ring
- Error: Red border + message
- Disabled: Gray background

### Todo Items

- Default: White background
- Hover: Light gray
- Selected: Light blue tint
- Completed: Strikethrough title, muted colors

</states>

<responsive>
## Responsive Breakpoints

- **Mobile:** < 640px (single column, hamburger menu)
- **Tablet:** 640px - 1024px (sidebar collapsible)
- **Desktop:** > 1024px (full layout)

### Mobile Considerations

- Touch targets: minimum 44px
- Bottom navigation for primary actions
- Swipe gestures for common actions
- Pull-to-refresh on lists

</responsive>

<accessibility>
## Accessibility Requirements

- All interactive elements keyboard accessible
- Focus indicators visible
- Color contrast minimum 4.5:1
- Form labels associated with inputs
- Error messages linked to inputs
- ARIA labels where needed

</accessibility>

---

*UI Design Contract: Phase 1*
*Generated: 2026-04-28*