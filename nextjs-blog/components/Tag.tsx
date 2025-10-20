import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { getTagColor } from '@/lib/tagColors';

interface TagProps {
  tag: string;
  active?: boolean;
}

const styles = stylex.create({
  tag: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    fontFamily: '"Roboto Mono", monospace',
  },
  hover: {
    transform: {
      default: 'translateY(0)',
      ':hover': 'translateY(-1px)',
    },
    boxShadow: {
      default: 'none',
      ':hover': '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    filter: {
      default: 'brightness(1)',
      ':hover': 'brightness(1.1)',
    },
  },
  active: {
    filter: 'brightness(1.2)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
});

export default function Tag({ tag, active = false }: TagProps) {
  const color = getTagColor(tag);

  return (
    <Link
      href={`/tags/${tag}`}
      {...stylex.props(styles.tag, styles.hover, active && styles.active)}
      style={{
        color: color.bg,
      }}
    >
      #{tag}
    </Link>
  );
}
