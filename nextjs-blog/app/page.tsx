import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import FormattedDate from '@/components/FormattedDate';


export default function Home() {
  const posts = getAllPosts();

  return (
    <section >
      <ul >
        {posts.map((post) => (
          <li key={post.id} >
            <Link href={`/blog/${post.id}`} >
              <div >
                <div>
                  <h4 >
                    {post.title}
                  </h4>
                  <p >
                    <FormattedDate date={post.pubDate} />
                  </p>
                  {post.description && (
                    <p style={{ color: 'var(--color-gray-700)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                      {post.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
