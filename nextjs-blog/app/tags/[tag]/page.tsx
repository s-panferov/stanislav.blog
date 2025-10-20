import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTags, getPostsByTag } from '@/lib/blog';
import FormattedDate from '@/components/FormattedDate';
import Tag from '@/components/Tag';


export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag,
  }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <section >
      <header >
        <h1 >
          Posts tagged with <Tag tag={tag} active />
        </h1>
      </header>
      <ul >
        {posts.map((post) => (
          <li key={post.id} >
            <Link href={`/blog/${post.id}`} >
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
                    {post.tags.map((t) => (
                      <Tag key={t} tag={t} active={t === tag} />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
