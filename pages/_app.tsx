<<<<<<< HEAD
// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Make sure this matches your folder structure

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
=======
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
>>>>>>> d47e51b (Add _app.tsx for Tailwind CSS support)
