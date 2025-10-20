# Next.js Blog with StyleX

A modern blog implementation using Next.js 16 and StyleX for styling, replicating the structure of the Astro-based blog.

## Tech Stack

- **Next.js 16** (Canary) - React framework with App Router
- **React 19** - UI library
- **StyleX** - Type-safe, scoped CSS-in-JS library by Meta
- **TypeScript** - Type safety

## Project Structure

```
nextjs-blog/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Home page (blog listing)
│   ├── about/             # About page
│   ├── blog/[id]/         # Individual blog post pages
│   └── tags/              # Tags listing and filtered views
├── components/            # Reusable React components
│   ├── Header.tsx         # Site header with navigation
│   ├── Footer.tsx         # Site footer
│   ├── Tag.tsx            # Tag component with color hashing
│   └── FormattedDate.tsx  # Date formatting component
├── lib/                   # Utility functions and data
│   ├── blog.ts            # Blog post data and helpers
│   ├── consts.ts          # Site constants
│   ├── tagColors.ts       # Tag color generation utility
│   └── theme.stylex.ts    # Theme constants (CSS vars)
└── public/assets/         # Static assets (images, etc.)
```

## Features

- ✅ **Blog listing page** with sortable posts
- ✅ **Individual blog post pages** with tags and metadata
- ✅ **Tags system** with color-coded tags and filtering
- ✅ **Responsive design** with mobile-first approach
- ✅ **Type-safe styling** with StyleX
- ✅ **Dark mode ready** with CSS custom properties
- ✅ **SEO-friendly** with proper metadata

## Styling with StyleX

StyleX provides type-safe, scoped styles with zero runtime overhead. All styles are compiled at build time into atomic CSS classes.

### Theme System

The blog uses CSS custom properties for theming, defined in `app/globals.css`:

- Light/dark theme support via `[data-theme="dark"]` selector
- Consistent color palette across components
- Responsive typography and spacing

### Component Styling

Styles are co-located with components using `stylex.create()`:

```typescript
const styles = stylex.create({
  container: {
    padding: '1rem',
    backgroundColor: 'var(--bg-primary)',
  },
});
```

## Known Limitations

⚠️ **StyleX Build Issues with Next.js 16**

Currently, there are compatibility issues with StyleX and Next.js 16:

1. **Turbopack** (default in Next.js 16): StyleX plugin doesn't support Turbopack yet
2. **Webpack mode**: Build fails during page data collection phase with "stylex.create should never be called at runtime"

This appears to be a known issue with:
- StyleX Next.js plugin being deprecated (v0.9.3)
- Next.js 16 being in canary/beta
- Potential mismatch between StyleX Babel plugin and Next.js compilation

### Workarounds

Until these issues are resolved, consider:

1. **Use Next.js 15** instead of 16 (stable release)
2. **Use CSS Modules** or other styling solutions
3. **Wait for StyleX updates** that support Next.js 16/Turbopack
4. **Dev mode works** - the dev server runs fine, only builds fail

## Getting Started

### Development

```bash
pnpm install
pnpm dev
```

Thedev server should start at `http://localhost:3000` (or another port if 3000 is taken).

### Build

```bash
# Try webpack mode (may fail - see limitations above)
pnpm build --webpack

# Try turbopack mode (may fail - see limitations above)
pnpm build
```

### Production

```bash
pnpm start
```

## Blog Data

Blog posts are currently defined in `lib/blog.ts` as TypeScript objects. To add a new post:

1. Add a new entry to the `posts` array in `lib/blog.ts`
2. The post will automatically appear on the home page and tag pages
3. Add hero images to `public/assets/`

### Blog Post Interface

```typescript
interface BlogPost {
  id: string;              // URL-safe identifier
  title: string;           // Post title
  description: string;     // Short description/excerpt
  pubDate: Date;          // Publication date
  heroImage?: string;     // Path to hero image
  tags?: string[];        // Array of tag strings
}
```

## Migrating from MDX

This implementation uses React files instead of MDX. To add blog post content:

1. Create React components for each post in `app/blog/[id]/`
2. Or fetch markdown content dynamically and render with a markdown parser
3. Or use a CMS/database for content storage

## Comparison with Astro Version

### Similarities
- Same visual design and layout
- Identical tag color hashing algorithm
- Same responsive breakpoints and typography
- Blog listing, tags, and about pages

### Differences
- **Astro**: Static site generator with `.astro` components and MDX content
- **Next.js**: React-based with App Router and React Server Components
- **Astro**: Built-in content collections for MDX files
- **Next.js**: Manual data management (currently hardcoded, can be extended)
- **Astro**: Scoped styles in `.astro` files
- **Next.js**: StyleX for component-scoped styles

## Future Enhancements

- [ ] Fix StyleX build issues or migrate to CSS Modules
- [ ] Add MDX support for blog content
- [ ] Implement search functionality
- [ ] Add RSS feed generation
- [ ] Add theme toggle for dark mode
- [ ] Add view transitions/animations
- [ ] Integrate with a CMS
- [ ] Add reading time estimation
- [ ] Add code syntax highlighting
- [ ] Add related posts section

## License

MIT
