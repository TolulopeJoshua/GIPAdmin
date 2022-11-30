import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Footer from '../../components/footer'
import Sidebar from '../../components/sidebar'
import User from '../../components/user'
import { useDispatch, useSelector } from 'react-redux';
import { docsState, user } from '../../types';
import ListBorder from '../../components/ListBorder'
import { AiOutlineClose } from 'react-icons/ai'
import proxy from '../../utils/proxy'
import axios from 'axios'
import { docsActions } from '../../store'
import toast from 'react-hot-toast'

const index = () => {
  const [sidebar, setSidebar] = useState(false);
  const dispatch = useDispatch();
  const {auth, docs} = useSelector(({ docs }: {docs: docsState}) => docs);

  const router = useRouter();
  const compDocs = docs.users.filter((user: user) => {
    for (const key in router.query) {
      if ((router.query[key] != '') && user[key].toString().toLowerCase().indexOf(router.query[key]?.toString().toLowerCase()) >= 0) {
        return true;
      }
    }
    return false;
  })

  useEffect(() => {
    const url = proxy + '/all';
    axios.get(url, { headers: {'Authorization': `Bearer ${auth.token}`}}).then(function (response) {
      response.data.users && dispatch(docsActions.setDocs(response.data))
      dispatch(docsActions.setLoading(false))
    }).catch(function (error) {
      dispatch(docsActions.setError(true))
      dispatch(docsActions.setLoading(false))
      toast.error('Error refreshing data.')
    }); 
  }, [])

  return (
    <div className='w-screen h-full flex relative'>
    <span onClick={() => setSidebar(true)} className='absolute z-10 left-0 top-14 md:hidden bg-white border-t-2 border-slate-500 rotate-90 text-xs p-1 px-2 -mx-3 cursor-pointer text-slate-500'>MENU</span>
    <div className={`${!sidebar && '-translate-x-full'} transition-transform duration-500 absolute w-full top-0 left-0 bg-[#374151] z-10 md:translate-x-0 md:bg-transparent md:relative md:flex md:w-64 h-full shrink-0`}>
      <button onClick={() => setSidebar(false)} className='p-2 mx-2 text-2xl md:hidden'><AiOutlineClose /></button>
        <Sidebar close={() => setSidebar(false)} page={'Users'} params={[{title: 'firstName', text: ''}, {title: 'lastName', text: ''}, {title: 'Email', text: ''}]} />
      </div>
      <ListBorder list={auth.admin === 5 ? compDocs : []} className='w-full h-full overflow-y-auto flex flex-wrap pt-16 px-8 justify-center align-middle gap-16'>
        {
          compDocs.map((doc: user) => <User key={doc._id.toString()} user={doc} />)
        }
        <Footer />
      </ListBorder>
    </div>
  )
}

export default index