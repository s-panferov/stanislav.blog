import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';


export default function Home() {
  const posts = getAllPosts();

  return (
    <section>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '2rem' }}>
            <Link href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  {post.title}
                </h4>
                {post.description && (
                  <p style={{ color: 'var(--color-gray-700)', margin: 0, lineHeight: '1.6' }}>
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
