import Link from 'next/link';
import { getTagColor } from '@/lib/tagColors';
import styles from './Tag.module.css';

interface TagProps {
  tag: string;
  active?: boolean;
}

export default function Tag({ tag, active = false }: TagProps) {
  const color = getTagColor(tag);

  return (
    <Link
      href={`/tags/${tag}`}
      className={`${styles.tag} ${active ? styles.active : ''}`}
      style={{
        color: color.bg,
      }}
    >
      #{tag}
    </Link>
  );
}
