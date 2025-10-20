import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  section: {
    width: '720px',
    maxWidth: '100%',
    margin: 'auto',
  },
  title: {
    margin: '0 0 2rem 0',
    color: 'var(--text-heading)',
    fontSize: '2em',
    fontWeight: 600,
  },
  content: {
    fontSize: '1em',
    lineHeight: 1.7,
    color: 'var(--text-primary)',
  },
});

export default function AboutPage() {
  return (
    <section {...stylex.props(styles.section)}>
      <h1 {...stylex.props(styles.title)}>About</h1>
      <div {...stylex.props(styles.content)}>
        <p>
          Welcome to my blog! This is a technical blog focused on software
          engineering, with a particular emphasis on Rust, WebAssembly, TypeScript,
          and build systems.
        </p>
        <p>
          I write about my experiences building developer tools, exploring new
          technologies, and solving complex engineering challenges.
        </p>
      </div>
    </section>
  );
}
