'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { SITE_TITLE } from '@/lib/consts';

const styles = stylex.create({
  header: {
    margin: 0,
    padding: '0 1em',
    backgroundColor: 'var(--bg-primary)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'background-color 0.3s ease',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    margin: 0,
    fontSize: '1em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.1rem',
  },
  headingLink: {
    textDecoration: 'none',
    color: 'var(--text-heading)',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  internalLinks: {
    display: 'flex',
    gap: '0.5rem',
  },
  navLink: {
    padding: '1em 0.5em',
    color: 'var(--text-heading)',
    borderBottom: '4px solid transparent',
    textDecoration: 'none',
  },
  activeLink: {
    borderBottomColor: 'var(--accent)',
  },
  socialLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-heading)',
  },
  srOnly: {
    border: 0,
    padding: 0,
    margin: 0,
    position: 'absolute',
    height: '1px',
    width: '1px',
    overflow: 'hidden',
    clip: 'rect(1px, 1px, 1px, 1px)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  hideMobile: {
    '@media (max-width: 900px)': {
      display: 'none',
    },
  },
});

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header {...stylex.props(styles.header)}>
      <nav {...stylex.props(styles.nav)}>
        <h2 {...stylex.props(styles.heading)}>
          <Image
            src="/assets/ava.jpg"
            alt="Stanislav Panferov"
            width={32}
            height={32}
            {...stylex.props(styles.avatar)}
          />
          <Link href="/" {...stylex.props(styles.headingLink)}>
            {SITE_TITLE}
          </Link>
        </h2>
        <div {...stylex.props(styles.internalLinks)}>
          <Link
            href="/"
            {...stylex.props(styles.navLink, isActive('/') && styles.activeLink)}
          >
            Blog
          </Link>
          <Link
            href="/tags"
            {...stylex.props(styles.navLink, isActive('/tags') && styles.activeLink)}
          >
            Tags
          </Link>
          <Link
            href="/about"
            {...stylex.props(styles.navLink, isActive('/about') && styles.activeLink)}
          >
            About
          </Link>
        </div>
        <div {...stylex.props(styles.socialLinks, styles.hideMobile)}>
          <a
            href="https://github.com/s-panferov"
            target="_blank"
            rel="noopener noreferrer"
            {...stylex.props(styles.socialLink)}
          >
            <span {...stylex.props(styles.srOnly)}>Visit Stanislav's GitHub profile</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" width="32" height="32">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
