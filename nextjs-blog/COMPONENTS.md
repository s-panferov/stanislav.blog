# Components Structure

All components now use **CSS Modules** for styling - no StyleX, no duplicate files.

## Component Files

### Header
- `Header.tsx` - Main header component with navigation ('use client')
- `Header.module.css` - Header styles

### Footer
- `Footer.tsx` - Footer component with social links
- `Footer.module.css` - Footer styles

### Tag
- `Tag.tsx` - Tag component with dynamic colors
- `Tag.module.css` - Tag styles

### FormattedDate
- `FormattedDate.tsx` - Simple date formatting component (no styles needed)

## Styling Approach

- **CSS Modules** for component-scoped styles
- **Global CSS** (`app/globals.css`) for base styles and CSS custom properties
- **CSS Custom Properties** for theming (light/dark mode ready)
- **No inline styles** except for dynamic tag colors

## CSS Custom Properties

All colors are defined in `app/globals.css`:
- `--bg-primary`, `--bg-secondary`
- `--text-primary`, `--text-secondary`, `--text-heading`
- `--accent`, `--accent-dark`
- `--border`, `--code-bg`
- `--gray`, `--gray-light`

Dark theme support via `[data-theme="dark"]` selector.
