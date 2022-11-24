import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { docsActions } from '../store'
import { docsState, request } from '../types'
import { useRouter } from 'next/router'
import { MdOutlineRefresh } from 'react-icons/md'
import axios from 'axios'
import proxy from '../utils/proxy'
import toast from 'react-hot-toast'

const Request = ({request}: {request: request}) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { auth } = useSelector(({ docs }: {docs: docsState}) => docs);

  const refresh = () => {
    toast.loading('Refreshing...')
    const url = proxy + '/requests';
    axios.get(url, { headers: {'Authorization': `Bearer ${auth.token}`}}).then(function(response) {
      dispatch(docsActions.setRequests(response.data))
      toast.dismiss();
      toast.success(' Done! ')
    }).catch(function(error) {
      toast.dismiss();
      toast.error('An error occured!')
    })
  }

  return (
    <div className='bg-white/5 w-[400px] h-max border-2 px-8 py-4 border-slate-700 max-w-full rounded-md'>
      <div className='mb-4'>
        <span className='block font-bold'>Title</span>
        <span className='text-sm'>{request.text}</span>
      </div>
      <div className='mb-4'>
        <span className='block font-bold'>Ref?:</span>
        <em className='text-sm'>{request.info}</em>
      </div>
      <div>
        <span className='block font-bold'>Requester</span>
        <span className='text-sm'>{request.author.firstName + ' ' + request.author.lastName}</span>
      </div>
      <div className='flex justify-end pt-2 px-2'>
        <span onClick={refresh} className='btn p-2 text-2xl mr-2'><MdOutlineRefresh /></span>
        <a href={`https://godinprints.org/${router.query.folder}/new?requestId=${request._id}`} target='blank' className='btn px-4 py-2 bg-white/5'>Respond</a>
      </div>
    </div>
  )
}

export default Request