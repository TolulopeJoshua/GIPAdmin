import Head from 'next/head';
import Navbar from './navbar';

export default function RootLayout({ children }: {
    children: React.ReactNode;
  }) {
    return (
        <main className='prose prose-invert h-screen flex flex-col'>
          <Navbar />
          <div className='w-screen h-full flex overflow-hidden'>
            {children}
          </div>
        </main>
    );
  }