import React from 'react'
import { useRouter } from 'next/router'
import Footer from '../../components/footer'
import Sidebar from '../../components/sidebar'
import User from '../../components/user'
import { useSelector } from 'react-redux';
import { docsState, user } from '../../types';
import ListBorder from '../../components/ListBorder'

const index = () => {
  
  const {loading, docs} = useSelector(({ docs }: {docs: docsState}) => docs);

  const router = useRouter();
  const compDocs = docs.users.filter((user: user) => {
    for (const key in router.query) {
      if ((router.query[key] != '') && user[key].toString().toLowerCase().indexOf(router.query[key]?.toString().toLowerCase()) >= 0) {
        return true;
      }
    }
    return false;
  })

  return (
    <div className='w-screen h-full flex'>
      <div className='hidden md:flex w-64 h-full shrink-0'>
        <Sidebar page={'Users'} params={[{title: 'firstName', text: ''}, {title: 'lastName', text: ''}, {title: 'Email', text: ''}]} />
      </div>
      <ListBorder list={compDocs} className='w-full h-full overflow-y-auto flex flex-wrap pt-16 px-8 justify-center align-middle gap-16'>
        {
          compDocs.map((doc: user) => <User key={doc._id.toString()} user={doc} />)
        }
        <Footer />
      </ListBorder>
    </div>
  )
}

export default index