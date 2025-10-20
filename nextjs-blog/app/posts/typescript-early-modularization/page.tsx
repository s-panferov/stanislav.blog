import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';
import FormattedDate from '@/components/FormattedDate';
import Tag from '@/components/Tag';
import styles from '../post.module.css';

export default function TypeScriptEarlyModularization() {
  const post = {
    title: 'Why Early Modularization Matters in TypeScript Projects',
    description: 'How proper package-based modularization sets you up for success with build systems like Bazel and why you should avoid path aliases',
    pubDate: new Date('2025-09-08'),
    heroImage: withBasePath('/assets/blog-placeholder-3.jpg'),
    tags: ['typescript', 'architecture', 'bazel', 'build-systems', 'best-practices']
  };

  return (
    <article className={styles.article}>
      <div className={styles.heroImage}>
        <Image
          src={post.heroImage}
          alt={post.title}
          width={1020}
          height={510}
          priority
        />
      </div>
      <div className={styles.prose}>
        <div className={styles.date}>
          <FormattedDate date={post.pubDate} />
        </div>
        <h1>{post.title}</h1>
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
        <hr />

        <p>When starting a TypeScript project, it's tempting to keep everything simple with a single <code>src/</code> folder and path aliases for imports. However, investing in proper modularization from day one pays massive dividends as your codebase grows. Let me explain why package-based modularization is crucial and how it naturally leads to adopting powerful build systems like Bazel.</p>

        <h2>The Hidden Cost of Monolithic Structure</h2>

        <p>Most TypeScript projects start like this:</p>

        <pre><code>{`src/
  components/
  services/
  utils/
  models/
  index.ts
tsconfig.json
package.json`}</code></pre>

        <p>With path aliases in <code>tsconfig.json</code>:</p>

        <pre><code>{`{
  "compilerOptions": {
    "paths": {
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}`}</code></pre>

        <p>This feels clean initially, but it creates several problems that compound over time.</p>

        <h2>Why Path Aliases Are a Trap</h2>

        <p>Path aliases (<code>@components</code>, <code>@utils</code>) seem convenient but they're actually technical debt in disguise:</p>

        <h3>1. They Hide Real Dependencies</h3>

        <p>When you write <code>import {`{ Button }`} from '@components/Button'</code>, it looks clean, but you've obscured the actual module structure. This makes it harder to:</p>
        <ul>
          <li>Understand the real dependency graph</li>
          <li>Extract modules into separate packages</li>
          <li>Migrate to a different build system</li>
        </ul>

        <h3>2. They Break Standard Tooling</h3>

        <p>Many tools don't understand TypeScript path aliases without additional configuration:</p>
        <ul>
          <li>Jest needs <code>moduleNameMapper</code></li>
          <li>Webpack needs <code>resolve.alias</code></li>
          <li>ESLint needs <code>eslint-import-resolver-typescript</code></li>
          <li>Each new tool requires alias configuration</li>
        </ul>

        <h3>3. They Prevent True Isolation</h3>

        <p>With aliases, any file can import from anywhere. There's no enforced boundary between modules. Your "utils" can depend on "components" and vice versa, creating circular dependencies that are hard to detect.</p>

        <h2>The Power of Package-Based Architecture</h2>

        <p>Instead of path aliases, structure your project as multiple packages from the start:</p>

        <pre><code>{`packages/
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
      main.ts`}</code></pre>

        <p>Each package has its own <code>package.json</code>:</p>

        <pre><code>{`// packages/ui/package.json
{
  "name": "@myapp/ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@myapp/core": "workspace:*"
  }
}`}</code></pre>

        <h2>Benefits of Early Modularization</h2>

        <h3>1. Clear Dependency Boundaries</h3>

        <p>Each package explicitly declares its dependencies. If <code>@myapp/ui</code> needs something from <code>@myapp/core</code>, it must be listed in <code>package.json</code>. This creates a clear, enforceable contract between modules.</p>

        <h3>2. Controlled Public APIs with Package Exports</h3>

        <p>Modern package.json supports the <code>"exports"</code> field, giving you fine-grained control over your package's public API:</p>

        <pre><code>{`// packages/core/package.json
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
}`}</code></pre>

        <p>With this structure:</p>
        <pre><code>{`packages/core/
  src/
    index.ts          // Exported via "."
    config.ts         // Exported via "./config"
    internal/
      helpers.ts      // NOT accessible to consumers
      utils.ts        // NOT accessible to consumers`}</code></pre>

        <p>This means:</p>
        <ul>
          <li>Consumers can only import what you explicitly expose</li>
          <li>Internal implementation details remain truly private</li>
          <li>Refactoring internals won't break consumers</li>
          <li>TypeScript respects these boundaries with <code>moduleResolution: "bundler"</code> or <code>"node16"</code></li>
        </ul>

        <h3>3. Independent Development and Testing</h3>

        <p>Each package can be:</p>
        <ul>
          <li>Built independently</li>
          <li>Tested in isolation</li>
          <li>Published separately (if needed)</li>
          <li>Versioned independently</li>
        </ul>

        <h3>4. Natural Build Parallelization</h3>

        <p>With proper package boundaries, build tools can parallelize compilation. If <code>utils</code> doesn't depend on <code>ui</code>, they can build simultaneously.</p>

        <h3>5. Progressive Migration Friendly</h3>

        <p>When you need to migrate to a different framework, update dependencies, or refactor, you can do it package by package rather than all at once.</p>

        <h2>How This Enables Bazel Adoption</h2>

        <p>Bazel excels at building modular codebases. When your project is already organized into packages, adopting Bazel becomes natural:</p>

        <h3>1. Packages Map to Bazel Targets</h3>

        <p>Each package becomes a Bazel target:</p>

        <pre><code>{`# packages/core/BUILD.bazel
ts_library(
    name = "core",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        # explicit dependencies
    ],
)`}</code></pre>

        <h3>2. Dependency Graph is Already Defined</h3>

        <p>Your <code>package.json</code> dependencies translate directly to Bazel <code>deps</code>. No need to reverse-engineer the dependency graph from a tangled codebase.</p>

        <h3>3. Incremental Builds Work Immediately</h3>

        <p>Bazel's incremental build cache works best with clear module boundaries. When packages are properly isolated, Bazel can cache and skip rebuilding unchanged modules.</p>

        <h3>4. Remote Caching Becomes Effective</h3>

        <p>With proper modularization, Bazel's remote cache hit rate improves dramatically. Team members only rebuild what actually changed, not the entire monolith.</p>

        <h2>Practical Migration Strategy</h2>

        <p>If you're starting fresh:</p>

        <ol>
          <li><strong>Use a monorepo tool</strong> like pnpm workspaces, yarn workspaces, or nx</li>
          <li><strong>Create packages early</strong> - even if they're small initially</li>
          <li><strong>Use workspace protocols</strong> for internal dependencies: <code>"@myapp/core": "workspace:*"</code></li>
          <li><strong>Enforce boundaries</strong> with ESLint rules or tools like <code>dependency-cruiser</code></li>
        </ol>

        <p>If you have an existing codebase:</p>

        <ol>
          <li><strong>Start with leaf modules</strong> - utilities and models that don't depend on much</li>
          <li><strong>Extract incrementally</strong> - one module at a time</li>
          <li><strong>Fix imports as you go</strong> - replace aliases with proper package imports</li>
          <li><strong>Add tests for each extracted package</strong> to ensure nothing breaks</li>
        </ol>

        <h2>Real-World Impact</h2>

        <p>Teams that adopt package-based modularization typically see:</p>

        <p><strong>Before</strong>:</p>
        <ul>
          <li>Single monolithic TypeScript project</li>
          <li>15-20 minute full builds</li>
          <li>3-5 minute incremental builds</li>
          <li>Frequent "it works on my machine" issues</li>
          <li>Circular dependencies everywhere</li>
          <li>No clear API boundaries</li>
        </ul>

        <p><strong>After</strong>:</p>
        <ul>
          <li>Multiple packages with clear boundaries</li>
          <li>3-5 minute full builds</li>
          <li>Sub-second incremental builds for isolated changes</li>
          <li>Consistent builds across all environments</li>
          <li>Enforced dependency direction</li>
          <li>Well-defined public APIs via package exports</li>
        </ul>

        <h2>Common Objections Addressed</h2>

        <p><strong>"But packages add complexity!"</strong></p>

        <p>Initial complexity, yes. But it's <em>essential</em> complexity that prevents the <em>accidental</em> complexity of a tangled monolith.</p>

        <p><strong>"Path aliases are more convenient!"</strong></p>

        <p>Short-term convenience, long-term pain. Proper package imports are explicit, standard, and tool-friendly.</p>

        <p><strong>"We're too small for this!"</strong></p>

        <p>The best time to modularize is when you're small. It's much harder to untangle a large codebase than to keep it modular from the start.</p>

        <h2>Conclusion</h2>

        <p>Early modularization with packages instead of path aliases is an investment that pays compound interest. It makes your codebase:</p>
        <ul>
          <li>More maintainable</li>
          <li>Easier to test</li>
          <li>Faster to build</li>
          <li>Ready for advanced build systems</li>
        </ul>

        <p>Start with packages, avoid aliases, and when you need the power of Bazel or similar build systems, you'll be ready. Your future self (and team) will thank you.</p>
      </div>
    </article>
  );
}
