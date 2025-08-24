import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Header from '../components/header';
import { Analytics } from '@vercel/analytics/react'; // ✅ Import
import '../styles/fonts.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Analytics /> {/* ✅ Add here */}
    </>
  );
}
