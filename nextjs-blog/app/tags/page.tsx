import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { getAllTags, getPostsByTag } from '@/lib/blog';
import Tag from '@/components/Tag';

const styles = stylex.create({
  section: {
    width: '100%',
  },
  title: {
    margin: '0 0 2rem 0',
    color: 'var(--text-heading)',
    fontSize: '2em',
    fontWeight: 600,
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  tagItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  count: {
    color: 'var(--text-secondary)',
    fontSize: '0.9em',
  },
});

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <section {...stylex.props(styles.section)}>
      <h1 {...stylex.props(styles.title)}>All Tags</h1>
      <ul {...stylex.props(styles.tagList)}>
        {tags.map((tag) => {
          const postCount = getPostsByTag(tag).length;
          return (
            <li key={tag} {...stylex.props(styles.tagItem)}>
              <Tag tag={tag} />
              <span {...stylex.props(styles.count)}>({postCount})</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
