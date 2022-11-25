import React, { useState } from 'react'
import Sidebar from '../../components/sidebar'
import { useRouter } from 'next/router'
import Footer from '../../components/footer';
import Request from '../../components/Request';
import capitalize from '../../utils/capitalize';
import { useSelector } from 'react-redux';
import { docsState, request } from '../../types';
import ListBorder from '../../components/ListBorder';
import { AiOutlineClose } from 'react-icons/ai';

const Requests = () => {

  const router = useRouter();
  const folder = router.query.folder;
  const [sidebar, setSidebar] = useState(false)
  const {loading, docs} = useSelector(({ docs }: {docs: docsState}) => docs);
  const compDocs = docs.requests.filter((request: request) => request.parentId == folder && request.likes.length == 0)
  return (
    <div className='w-screen h-full flex relative'>
      <span onClick={() => setSidebar(true)} className='absolute z-10 left-0 top-14 md:hidden bg-white border-t-2 border-slate-500 rotate-90 text-xs p-1 px-2 -mx-3 cursor-pointer text-slate-500'>MENU</span>
      <div className={`${!sidebar && '-translate-x-full'} transition-transform duration-500 absolute w-full top-0 left-0 bg-[#374151] z-10 -mx-2 md:translate-x-0 md:mx-0 md:bg-transparent md:relative md:flex md:w-64 h-full shrink-0`}>
        <button onClick={() => setSidebar(false)} className='p-2 mx-2 text-2xl md:hidden'><AiOutlineClose /></button>
        {
          folder == 'books' ? 
          <Sidebar close={() => setSidebar(false)} page={'Books'} params={[{title: 'Title', text: router.query.title}, {title: 'Author', text: router.query.author}, {title: '_Id', text: router.query._id}]} /> :
          folder == 'users' ?
          <Sidebar close={() => setSidebar(false)} page={'Users'} params={[{title: 'firstName', text: ''}, {title: 'lastName', text: ''}, {title: 'Email', text: ''}]} /> :
          folder =='articles' ?
          <Sidebar close={() => setSidebar(false)} page={'Articles'} params={[{title: 'Name', text: router.query.name}, {title: 'Role', text: router.query.role}, {title: '_Id', text: router.query._id}]} /> :
          <Sidebar close={() => setSidebar(false)} page={'Biographies'} params={[{title: 'Name', text: router.query.name}, {title: 'Role', text: router.query.role}, {title: '_Id', text: router.query._id}]} />

        }
      </div>
      <ListBorder list={compDocs} className='w-full h-full flex flex-col justify-center align-middle overflow-y-auto overflow-x-hidden'>
            {/* <Login /> */}
        <div className='w-full h-full flex flex-wrap gap-8 px-8 py-16 justify-center align-middle'>
          {
            compDocs.map((doc: request) => <Request key={doc._id.toString()} request={doc} />)
          }
        </div>
          <Footer />
      </ListBorder>
    </div>
  )
}

export default Requests