import Sidebar from '../../components/sidebar';
import Book from '../../components/book';
import Footer from '../../components/footer';
import { useSelector } from 'react-redux';
import { book, docsState } from '../../types';
import { useRef, useState, useEffect } from 'react';
import { AiOutlineStepBackward, AiOutlineStepForward, AiOutlineFastForward, AiOutlineFastBackward } from 'react-icons/ai';
import { useRouter } from 'next/router';
import ListBorder from '../../components/ListBorder';

const layout = ({ children }: {
    children: React.ReactNode;
  }) => {
    const [startIndex, setStartIndex] = useState(0);
    const {loading, docs} = useSelector(({ docs }: {docs: docsState}) => docs);
    const topRef = useRef(null)
    const router = useRouter();

    const compDocs = docs.books.filter((book: book) => {
      for (const key in router.query) {
        if ((router.query[key] != '') && book[key].toString().toLowerCase().indexOf(router.query[key]?.toString().toLowerCase()) >= 0) {
          return true;
        }
      }
      return false;
    })
    const books: Array<book> = compDocs.slice(startIndex, startIndex + 10);

    const prev = () => {
      startIndex > 10 ?
      setStartIndex(initial => initial - 10) :
      setStartIndex(0)
    }
    let next = () => {
      compDocs.length > 10 ? 
      startIndex < compDocs.length - 20 ?
      setStartIndex(startIndex + 10) :
      setStartIndex(compDocs.length - 10) :
      setStartIndex(0);
      topRef.current?.scrollIntoView();
    }

    useEffect(() => {
      setStartIndex(0);
      topRef.current?.scrollIntoView();
    }, [router.query])

  return (
    <div className='w-screen h-full flex'>
        <div className='hidden md:flex w-64 h-full shrink-0'>
          <Sidebar page={'Books'} params={[{title: 'Title', text: router.query.title}, {title: 'Author', text: router.query.author}, {title: '_Id', text: router.query._id}]} />
        </div>
        <ListBorder list={books} className='w-full h-full flex justify-center align-middle overflow-y-auto overflow-x-hidden'>
            <div className='flex flex-col h-max w-full '>
              {/* <Login /> */}
              <div ref={topRef} className='p-3 bg-slate-900/70 rounded-sm text-sm'>Showing {startIndex + 1} to {compDocs.length > 10 ? startIndex + 10 : compDocs.length} of {compDocs.length} items</div>
              <div className='px-2 py-8 flex justify-center'>
                <button onClick={() => setStartIndex(0)} className='mr-8 p-4 text-4xl'><AiOutlineFastBackward /></button>
                <button onClick={prev} className='mr-8 p-4 text-4xl'><AiOutlineStepBackward /></button>
                <button onClick={next} className='mr-8 p-4 text-4xl'><AiOutlineStepForward /></button>
                <button onClick={() => setStartIndex(compDocs.length > 10 ? compDocs.length - 10 : 0)} className='p-4 text-4xl'><AiOutlineFastForward /></button>
              </div>
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-16 px-4 w-full'>
                {
                  books.map(book => {
                    return <Book key={book._id.toString()} book={book} />
                  })
                }
              </div>
              <div className='px-2 py-8 flex justify-center'>
                <button onClick={prev} className='mr-8 p-4 text-4xl'><AiOutlineStepBackward /></button>
                <button onClick={next} className='p-4 text-4xl'><AiOutlineStepForward /></button>
              </div>
              <Footer /> 
            </div>
        </ListBorder>
    </div>
  )
}

export default layout