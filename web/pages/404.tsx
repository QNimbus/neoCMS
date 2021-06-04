import { useRouter } from 'next/router';
import Head from 'next/head';

import styles from '../styles/http/error.module.css';
import { useEffect, useState } from 'react';

export default function NeoCMS404() {
  const router = useRouter();
  const [error, setError] = useState({
    title: 'The page could not be found...',
    path: '',
  });

  useEffect(() => {
    setError({ title: 'Could not be found', path: router.asPath });
  }, []);

  return (
    <>
      <Head>
        <title>
          {error.path.length > 0 ? `Could not find ${error.path}` : error.title}
        </title>
        <meta name="robots" content="noindex"></meta>
      </Head>
      <div className={styles.error}>
        <div>
          <h1>404</h1>
          <div className={styles.inner}>
            <p>
              <strong>{error.path}</strong>
            </p>
            <h2>{error.title}</h2>
          </div>
        </div>
      </div>
    </>
  );
}
