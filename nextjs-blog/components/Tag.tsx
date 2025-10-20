import Link from 'next/link';
import { getTagColor } from '@/lib/tagColors';

interface TagProps {
  tag: string;
  active?: boolean;
}


export default function Tag({ tag, active = false }: TagProps) {
  const color = getTagColor(tag);

  return (
    <Link
      href={`/tags/${tag}`}
      
      style={{
        color: color.bg,
      }}
    >
      #{tag}
    </Link>
  );
}
