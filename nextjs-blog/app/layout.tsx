import type { Metadata } from 'next';
import * as stylex from '@stylexjs/stylex';
import { SITE_TITLE, SITE_DESCRIPTION } from '@/lib/consts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

const styles = stylex.create({
  body: {
    fontFamily: '"Roboto", sans-serif',
    margin: 0,
    padding: 0,
    textAlign: 'left',
    backgroundColor: 'var(--bg-primary)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    color: 'var(--text-primary)',
    fontSize: '16px',
    lineHeight: 1.7,
    fontWeight: 400,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  main: {
    width: '960px',
    maxWidth: 'calc(100% - 2em)',
    margin: 'auto',
    padding: '3em 1em',
    '@media (max-width: 900px)': {
      padding: '1em',
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body {...stylex.props(styles.body)}>
        <Header />
        <main {...stylex.props(styles.main)}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
