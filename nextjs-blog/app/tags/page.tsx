import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/blog';
import Tag from '@/components/Tag';


export default function TagsPage() {
  const tags = getAllTags();

  return (
    <section >
      <h1 >All Tags</h1>
      <ul >
        {tags.map((tag) => {
          const postCount = getPostsByTag(tag).length;
          return (
            <li key={tag} >
              <Tag tag={tag} />
              <span >({postCount})</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
