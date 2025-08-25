import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Header from '../components/header';
import { Analytics } from '@vercel/analytics/react';
import '../styles/fonts.css'
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-35M9SZ4NRZ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-35M9SZ4NRZ');
        `}
      </Script>

      <Header />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
