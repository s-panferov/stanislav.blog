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
    title: 'TypeScript Early Modularization',
    description: 'How early modularization in TypeScript projects can improve code quality and maintainability',
    pubDate: new Date('2025-09-10'),
    heroImage: '/assets/blog-placeholder-3.jpg',
    tags: ['typescript', 'architecture', 'best-practices'],
  },
  {
    id: 'bazel-rust-proto-compilation',
    title: 'Bazel Rust Proto Compilation',
    description: 'Setting up Protocol Buffers compilation for Rust projects using Bazel',
    pubDate: new Date('2025-09-05'),
    heroImage: '/assets/blog-placeholder-2.jpg',
    tags: ['rust', 'bazel', 'protobuf', 'build-systems'],
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
