import { notFound } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { getAllPosts, getPostById } from '@/lib/blog';
import FormattedDate from '@/components/FormattedDate';
import Tag from '@/components/Tag';

const styles = stylex.create({
  article: {
    width: '720px',
    maxWidth: '100%',
    margin: 'auto',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    margin: 0,
    color: 'var(--text-heading)',
    fontSize: '2em',
    fontWeight: 600,
  },
  date: {
    margin: '0.5rem 0',
    color: 'var(--text-secondary)',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '1rem',
    gap: '10px',
  },
  heroImage: {
    width: '100%',
    borderRadius: '12px',
    marginBottom: '2rem',
  },
  description: {
    fontSize: '1.1em',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  content: {
    fontSize: '1em',
    lineHeight: 1.7,
    color: 'var(--text-primary)',
  },
});

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
    <article {...stylex.props(styles.article)}>
      <header {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.title)}>{post.title}</h1>
        <p {...stylex.props(styles.date)}>
          <FormattedDate date={post.pubDate} />
        </p>
        {post.tags && post.tags.length > 0 && (
          <div {...stylex.props(styles.tags)}>
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
          {...stylex.props(styles.heroImage)}
        />
      )}
      <p {...stylex.props(styles.description)}>{post.description}</p>
      <div {...stylex.props(styles.content)}>
        <p>
          This is a placeholder for the blog post content. In a real implementation,
          you would load and render the full content here.
        </p>
      </div>
    </article>
  );
}
