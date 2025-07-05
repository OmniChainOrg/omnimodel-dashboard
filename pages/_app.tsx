// pages/_app.tsx
import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/globals.css'; // Ensure Tailwind CSS is loaded

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
