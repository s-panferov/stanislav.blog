// Utility to add basePath to URLs
// In production, Next.js adds basePath to Link hrefs automatically,
// but we need to manually add it for img src and other assets

const basePath = process.env.NODE_ENV === 'production' ? '/nextjs-blog' : '';

export function withBasePath(path: string): string {
  // Don't add basePath if it's already there or if it's an external URL
  if (path.startsWith('http') || path.startsWith(basePath)) {
    return path;
  }
  return `${basePath}${path}`;
}

export default basePath;
