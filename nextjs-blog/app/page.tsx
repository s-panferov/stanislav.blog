import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import FormattedDate from '@/components/FormattedDate';
import Tag from '@/components/Tag';


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
                  {post.tags && post.tags.length > 0 && (
                    <div
                      
                    >
                      {post.tags.map((tag) => (
                        <Tag key={tag} tag={tag} />
                      ))}
                    </div>
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
