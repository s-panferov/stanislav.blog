import { notFound } from 'next/navigation';
import { getAllPosts, getPostById } from '@/lib/blog';
import FormattedDate from '@/components/FormattedDate';
import Tag from '@/components/Tag';


export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <article >
      <header >
        <h1 >{post.title}</h1>
        <p >
          <FormattedDate date={post.pubDate} />
        </p>
        {post.tags && post.tags.length > 0 && (
          <div >
            {post.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        )}
      </header>
      {post.heroImage && (
        <img
          src={post.heroImage}
          alt={post.title}
          
        />
      )}
      <p >{post.description}</p>
      <div >
        <p>
          This is a placeholder for the blog post content. In a real implementation,
          you would load and render the full content here.
        </p>
      </div>
    </article>
  );
}
