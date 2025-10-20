import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { getAllTags, getPostsByTag } from '@/lib/blog';
import FormattedDate from '@/components/FormattedDate';
import Tag from '@/components/Tag';

const styles = stylex.create({
  section: {
    width: '100%',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    margin: 0,
    color: 'var(--text-heading)',
    fontSize: '2em',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  listItem: {
    width: '100%',
  },
  link: {
    display: 'block',
    textDecoration: 'none',
    transition: '0.2s ease',
  },
  postTitle: {
    margin: 0,
    color: 'var(--text-heading)',
    lineHeight: 1,
    textAlign: 'left',
    transition: 'color 0.2s ease',
  },
  postTitleHover: {
    color: {
      default: 'var(--text-heading)',
      ':hover': 'var(--accent)',
    },
  },
  date: {
    margin: 0,
    color: 'var(--text-secondary)',
    textAlign: 'left',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '0.5rem',
    gap: '10px',
  },
});

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
    <section {...stylex.props(styles.section)}>
      <header {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.title)}>
          Posts tagged with <Tag tag={tag} active />
        </h1>
      </header>
      <ul {...stylex.props(styles.list)}>
        {posts.map((post) => (
          <li key={post.id} {...stylex.props(styles.listItem)}>
            <Link href={`/blog/${post.id}`} {...stylex.props(styles.link)}>
              <div>
                <h4 {...stylex.props(styles.postTitle, styles.postTitleHover)}>
                  {post.title}
                </h4>
                <p {...stylex.props(styles.date)}>
                  <FormattedDate date={post.pubDate} />
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div
                    {...stylex.props(styles.tags)}
                    onClick={(e) => e.stopPropagation()}
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
