export interface BlogPost {
  id: string;
  title: string;
  description: string;
  pubDate: Date;
  heroImage?: string;
  tags?: string[];
}

export const posts: BlogPost[] = [
  {
    id: 'runy-dev-architecture',
    title: 'runy.dev: A modern process management',
    description: 'Deep dive into the architecture of Runy - a developer console that simplifies process management with a Rust core, TypeScript SDK, and beautiful web interface',
    pubDate: new Date('2025-09-14'),
    heroImage: '/assets/blog-placeholder-4.jpg',
    tags: ['rust', 'typescript', 'architecture', 'developer-tools', 'process-management'],
  },
  {
    id: 'typescript-early-modularization',
    title: 'Why Early Modularization Matters in TypeScript Projects',
    description: 'How proper package-based modularization sets you up for success with build systems like Bazel and why you should avoid path aliases',
    pubDate: new Date('2025-09-08'),
    heroImage: '/assets/blog-placeholder-3.jpg',
    tags: ['typescript', 'architecture', 'bazel', 'build-systems', 'best-practices'],
  },
  {
    id: 'bazel-rust-proto-compilation',
    title: 'Setting up Protocol Buffer compilation with Bazel and Rust',
    description: 'How to build a custom proto compilation pipeline when the official rules_rust documentation no longer works with modern tonic versions',
    pubDate: new Date('2025-09-01'),
    heroImage: '/assets/bazel-tonic.png',
    tags: ['bazel', 'rust', 'protobuf', 'build-systems', 'grpc', 'tonic'],
  },
];

export function getAllPosts(): BlogPost[] {
  return posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export function getPostById(id: string): BlogPost | undefined {
  return posts.find(post => post.id === id);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => {
    post.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return posts
    .filter(post => post.tags?.includes(tag))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
