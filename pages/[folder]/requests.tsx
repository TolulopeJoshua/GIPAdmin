import React from 'react'
import Sidebar from '../../components/sidebar'
import { useRouter } from 'next/router'
import Footer from '../../components/footer';
import Request from '../../components/Request';
import capitalize from '../../utils/capitalize';
import { useSelector } from 'react-redux';
import { docsState, request } from '../../types';
import ListBorder from '../../components/ListBorder';

const Requests = () => {

  const router = useRouter();
  const folder = router.query.folder;
  const {loading, docs} = useSelector(({ docs }: {docs: docsState}) => docs);
  const compDocs = docs.requests.filter((request: request) => request.parentId == folder && request.likes.length == 0)
  return (
    <div className='w-screen h-full flex'>
      {/* Sidebar */}
      <div className='hidden md:flex w-64 h-full shrink-0'>
        {
          folder == 'books' ? 
          <Sidebar page={'Books'} params={[{title: 'Title', text: router.query.title}, {title: 'Author', text: router.query.author}, {title: '_Id', text: router.query._id}]} /> :
          folder == 'users' ?
          <Sidebar page={'Users'} params={[{title: 'firstName', text: ''}, {title: 'lastName', text: ''}, {title: 'Email', text: ''}]} /> :
          <Sidebar page={capitalize(folder?.toString())} params={[{title: 'Name', text: router.query.name}, {title: 'Role', text: router.query.role}, {title: '_Id', text: router.query._id}]} />
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