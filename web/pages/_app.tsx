/**
 * See: https://nextjs.org/docs/advanced-features/custom-app
 */

import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../styles/global.css';

const NeoCMSApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default NeoCMSApp;
