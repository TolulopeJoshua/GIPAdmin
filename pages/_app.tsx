import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, useSelector } from 'react-redux';
import store from '../store/index';
import { Toaster } from 'react-hot-toast';
import RootLayout from '../components/layout'
import { docsState } from '../types';
import Link from 'next/link';

const FakeBar = () => {
  const { auth } = useSelector(({ docs }: {docs: docsState}) => docs);
  return (
      auth.name ? <></> :
      <div className='w-full flex justify-center p-2 bg-white text-pink-400/70 border-2 border-pink-400'>
          You are currently in preview mode.<Link className='font-bold' href='/login'>&nbsp;Login&nbsp;</Link>for live view!
      </div>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <FakeBar />
      <RootLayout>
        <Toaster position={'bottom-center'} />
        <Component {...pageProps} />
      </RootLayout>
    </Provider>
  )
}
