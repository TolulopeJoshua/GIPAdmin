import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import Input from './UI/Input'

function Sidebar({page, params}: any) {

  const [compParams, setCompParams] = useState(params);
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let form = document.forms[0];
    let formData = new FormData(form);
    let search = new URLSearchParams(formData);
    let queryString = search.toString();
    router.push(router.pathname + '?' + queryString)
  }
  const onClear = () => {
    setCompParams(params.map((param: any) => {
      return {...param, text: ''}
    }))
  }
  return (
    <div  className='scrollbar h-full overflow-y-scroll w-full py-8 px-4 flex flex-col'>
      <Link href={'/' + page.toLowerCase() + '?isApproved=true'} className={'btn w-full px-4 py-2 font-semibold text-left transition ' + (router.query.isApproved == 'true' && 'bg-white/20')}>All { page }</Link>
      <form onSubmit={handleSubmit} action="">
        {
          compParams.map((param: any) => {
            return <Input key={param.title} label={param.title} text={param.text} />
          })
        }
        <div className='flex justify-between'>
          <button className='w-max px-4 py-2 font-semibold transition'>Search</button>
          <button onClick={onClear} type='reset' className='w-max px-4 py-2 font-semibold transition'>Clear</button>
        </div>
      </form>
      <Link href={'/' + page.toLowerCase() + '?isApproved=false'} className={'btn w-full px-4 py-2 my-8 font-semibold text-left transition ' + (router.query.isApproved == 'false' && 'bg-white/20')}>Awaiting Approval</Link >
      <Link href={'/' + page.toLowerCase() + '/requests'} className={'btn w-full px-4 py-2 mb-8 font-semibold text-left transition ' + (router.pathname.endsWith('requests') && 'bg-white/20')}>{ page } Requests</Link >
    </div>
  )
}

export default Sidebar