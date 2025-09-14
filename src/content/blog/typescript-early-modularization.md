---
title: 'Why Early Modularization Matters in TypeScript Projects'
description: 'How proper package-based modularization sets you up for success with build systems like Bazel and why you should avoid path aliases'
pubDate: 'Sep 08 2025'
heroImage: '../../assets/blog-placeholder-3.jpg'
tags: ['typescript', 'architecture', 'bazel', 'build-systems', 'best-practices']
---

When starting a TypeScript project, it's tempting to keep everything simple with a single `src/` folder and path aliases for imports. However, investing in proper modularization from day one pays massive dividends as your codebase grows. Let me explain why package-based modularization is crucial and how it naturally leads to adopting powerful build systems like Bazel.

## The Hidden Cost of Monolithic Structure

Most TypeScript projects start like this:

```
src/
  components/
  services/
  utils/
  models/
  index.ts
tsconfig.json
package.json
```

With path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

This feels clean initially, but it creates several problems that compound over time.

## Why Path Aliases Are a Trap

Path aliases (`@components`, `@utils`) seem convenient but they're actually technical debt in disguise:

### 1. They Hide Real Dependencies

When you write `import { Button } from '@components/Button'`, it looks clean, but you've obscured the actual module structure. This makes it harder to:
- Understand the real dependency graph
- Extract modules into separate packages
- Migrate to a different build system

### 2. They Break Standard Tooling

Many tools don't understand TypeScript path aliases without additional configuration:
- Jest needs `moduleNameMapper`
- Webpack needs `resolve.alias`
- ESLint needs `eslint-import-resolver-typescript`
- Each new tool requires alias configuration

### 3. They Prevent True Isolation

With aliases, any file can import from anywhere. There's no enforced boundary between modules. Your "utils" can depend on "components" and vice versa, creating circular dependencies that are hard to detect.

## The Power of Package-Based Architecture

Instead of path aliases, structure your project as multiple packages from the start:

```
packages/
  core/
    package.json
    tsconfig.json
    src/
      index.ts
  ui/
    package.json
    tsconfig.json
    src/
      Button.tsx
      index.ts
  utils/
    package.json
    tsconfig.json
    src/
      index.ts
  app/
    package.json
    tsconfig.json
    src/
      main.ts
```

Each package has its own `package.json`:

```json
// packages/ui/package.json
{
  "name": "@myapp/ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@myapp/core": "workspace:*"
  }
}
```

## Benefits of Early Modularization

### 1. Clear Dependency Boundaries

Each package explicitly declares its dependencies. If `@myapp/ui` needs something from `@myapp/core`, it must be listed in `package.json`. This creates a clear, enforceable contract between modules.

### 2. Controlled Public APIs with Package Exports

Modern package.json supports the `"exports"` field, giving you fine-grained control over your package's public API:

```json
// packages/core/package.json
{
  "name": "@myapp/core",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./config": {
      "types": "./dist/config.d.ts",
      "default": "./dist/config.js"
    },
    "./internal/*": null  // Explicitly hide internal modules
  }
}
```

With this structure:
```
packages/core/
  src/
    index.ts          // Exported via "."
    config.ts         // Exported via "./config"
    internal/
      helpers.ts      // NOT accessible to consumers
      utils.ts        // NOT accessible to consumers
```

This means:
- Consumers can only import what you explicitly expose
- Internal implementation details remain truly private
- Refactoring internals won't break consumers
- TypeScript respects these boundaries with `moduleResolution: "bundler"` or `"node16"`

### 3. Independent Development and Testing

Each package can be:
- Built independently
- Tested in isolation
- Published separately (if needed)
- Versioned independently

### 4. Natural Build Parallelization

With proper package boundaries, build tools can parallelize compilation. If `utils` doesn't depend on `ui`, they can build simultaneously.

### 4. Progressive Migration Friendly

When you need to migrate to a different framework, update dependencies, or refactor, you can do it package by package rather than all at once.

## How This Enables Bazel Adoption

Bazel excels at building modular codebases. When your project is already organized into packages, adopting Bazel becomes natural:

### 1. Packages Map to Bazel Targets

Each package becomes a Bazel target:

```python
# packages/core/BUILD.bazel
ts_library(
    name = "core",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        # explicit dependencies
    ],
)
```

### 2. Dependency Graph is Already Defined

Your `package.json` dependencies translate directly to Bazel `deps`. No need to reverse-engineer the dependency graph from a tangled codebase.

### 3. Incremental Builds Work Immediately

Bazel's incremental build cache works best with clear module boundaries. When packages are properly isolated, Bazel can cache and skip rebuilding unchanged modules.

### 4. Remote Caching Becomes Effective

With proper modularization, Bazel's remote cache hit rate improves dramatically. Team members only rebuild what actually changed, not the entire monolith.

## Practical Migration Strategy

If you're starting fresh:

1. **Use a monorepo tool** like pnpm workspaces, yarn workspaces, or nx
2. **Create packages early** - even if they're small initially
3. **Use workspace protocols** for internal dependencies: `"@myapp/core": "workspace:*"`
4. **Enforce boundaries** with ESLint rules or tools like `dependency-cruiser`

If you have an existing codebase:

1. **Start with leaf modules** - utilities and models that don't depend on much
2. **Extract incrementally** - one module at a time
3. **Fix imports as you go** - replace aliases with proper package imports
4. **Add tests for each extracted package** to ensure nothing breaks

## Real-World Impact

Teams that adopt package-based modularization typically see:

**Before**: 
- Single monolithic TypeScript project
- 15-20 minute full builds
- 3-5 minute incremental builds
- Frequent "it works on my machine" issues
- Circular dependencies everywhere
- No clear API boundaries

**After**:
- Multiple packages with clear boundaries
- 3-5 minute full builds
- Sub-second incremental builds for isolated changes
- Consistent builds across all environments
- Enforced dependency direction
- Well-defined public APIs via package exports

## Common Objections Addressed

**"But packages add complexity!"**

Initial complexity, yes. But it's *essential* complexity that prevents the *accidental* complexity of a tangled monolith.

**"Path aliases are more convenient!"**

Short-term convenience, long-term pain. Proper package imports are explicit, standard, and tool-friendly.

**"We're too small for this!"**

The best time to modularize is when you're small. It's much harder to untangle a large codebase than to keep it modular from the start.

## Conclusion

Early modularization with packages instead of path aliases is an investment that pays compound interest. It makes your codebase:
- More maintainable
- Easier to test
- Faster to build
- Ready for advanced build systems

Start with packages, avoid aliases, and when you need the power of Bazel or similar build systems, you'll be ready. Your future self (and team) will thank you.