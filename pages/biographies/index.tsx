import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { biography, docsState } from '../../types';
import { AiOutlineStepBackward, AiOutlineStepForward, AiOutlineFastBackward, AiOutlineFastForward } from 'react-icons/ai';
import Sidebar from '../../components/sidebar';
import Biography from '../../components/biography';
import Footer from '../../components/footer';
import { useRouter } from 'next/router';
import ListBorder from '../../components/ListBorder';

const layout = ({ children }: {
    children: React.ReactNode;
  }) => {
    const [startIndex, setStartIndex] = useState(0);
    const {loading, docs} = useSelector(({ docs }: {docs: docsState}) => docs);
    const topRef = useRef(null)
    const router = useRouter();

    const compDocs = docs.biographies.filter((bio: biography) => {
      for (const key in router.query) {
        if ((router.query[key] != '') && bio[key].toString().toLowerCase().indexOf(router.query[key]?.toString().toLowerCase()) >= 0) {
          return true;
        }
      }
      return false;
    })
    const biographies: Array<biography> = compDocs.slice(startIndex, startIndex + 10);

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
        {/* Sidebar */}
        <div className='hidden md:flex w-64 h-full shrink-0'>
          <Sidebar page={'Biographies'} params={[{title: 'Name', text: router.query.name}, {title: 'Role', text: router.query.role}, {title: '_Id', text: router.query._id}]} />
        </div>
        <ListBorder list={biographies} className='w-full h-full flex justify-center align-middle overflow-y-auto overflow-x-hidden'>
            <div className='flex flex-col h-max w-full '>
              <div ref={topRef} className='p-3 bg-slate-900/70 rounded-sm text-sm'>Showing {startIndex + 1} to {compDocs.length > 10 ? startIndex + 10 : compDocs.length} of {compDocs.length} items</div>
              <div className='px-2 py-8 flex justify-center'>
                <button onClick={() => setStartIndex(0)} className='mr-8 p-4 text-4xl'><AiOutlineFastBackward /></button>
                <button onClick={prev} className='mr-8 p-4 text-4xl'><AiOutlineStepBackward /></button>
                <button onClick={next} className='mr-8 p-4 text-4xl'><AiOutlineStepForward /></button>
                <button onClick={() => setStartIndex(compDocs.length > 10 ? compDocs.length - 10 : 0)} className='p-4 text-4xl'><AiOutlineFastForward /></button>
              </div>
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-16 px-4 w-full'>
                  {
                    biographies.map(biography => {
                      return <Biography key={biography._id.toString()} biography={biography} />
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