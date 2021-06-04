import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Layout = ({ children, title = 'NeoCMS' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/login">
          <a>Login</a>
        </Link>
        |{' '}
        <Link href="/register">
          <a>Register</a>
        </Link>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>&copy; 2021 BeSquared</span>
    </footer>
  </div>
);

export default Layout;
