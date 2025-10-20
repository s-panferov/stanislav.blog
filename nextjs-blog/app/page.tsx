import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { getAllPosts } from '@/lib/blog';
import FormattedDate from '@/components/FormattedDate';
import Tag from '@/components/Tag';

const styles = stylex.create({
  section: {
    width: '100%',
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
  content: {
    display: 'flex',
    gap: '1rem',
  },
  title: {
    margin: 0,
    color: 'var(--text-heading)',
    lineHeight: 1,
    textAlign: 'left',
    transition: 'color 0.2s ease',
  },
  titleHover: {
    color: {
      default: 'var(--text-heading)',
      ':hover': 'var(--accent)',
    },
  },
  date: {
    margin: 0,
    color: 'var(--text-secondary)',
    textAlign: 'left',
    transition: 'color 0.2s ease',
  },
  dateHover: {
    color: {
      default: 'var(--text-secondary)',
      ':hover': 'var(--accent)',
    },
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '0.5rem',
    gap: '10px',
  },
  mobile: {
    '@media (max-width: 900px)': {
      gap: '0.5em',
    },
  },
});

export default function Home() {
  const posts = getAllPosts();

  return (
    <section {...stylex.props(styles.section)}>
      <ul {...stylex.props(styles.list, styles.mobile)}>
        {posts.map((post) => (
          <li key={post.id} {...stylex.props(styles.listItem)}>
            <Link href={`/blog/${post.id}`} {...stylex.props(styles.link)}>
              <div {...stylex.props(styles.content)}>
                <div>
                  <h4 {...stylex.props(styles.title, styles.titleHover)}>
                    {post.title}
                  </h4>
                  <p {...stylex.props(styles.date, styles.dateHover)}>
                    <FormattedDate date={post.pubDate} />
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div
                      {...stylex.props(styles.tags)}
                      onClick={(e) => e.stopPropagation()}
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
