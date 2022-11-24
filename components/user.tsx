import axios from 'axios';
import React, { ChangeEvent, useState } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { docsState, user } from '../types'
import proxy from '../utils/proxy';
import { useDispatch, useSelector } from 'react-redux';
import { docsActions } from '../store';
import toast from 'react-hot-toast';

const User = ({user}: {user: user}) => {
  const [level, setLevel] = useState(user.admin);
  const dispatch = useDispatch();
  const { auth } = useSelector(({ docs }: {docs: docsState}) => docs);

  const changeLevel = (e: any) => setLevel(e.target.value)

  const setAdminLevel = async (e: any) => {
    toast.loading('Updating...')
    e.preventDefault();
    const url = `${proxy}/admin`
    await axios.put(url, { 
      user: user._id, level: level
    }, { headers: {'Authorization': `Bearer ${auth.token}`}}).then(({data}: {data: user}) => {
      toast.dismiss();
      toast.success('Updated')
      dispatch(docsActions.setUser(data))
    })
    .catch((error: any) => {
      toast.dismiss();
      toast.error('An error occured!')
    })
  }

  return (
    <div className='bg-white/5 border-2 px-8 py-4 border-slate-700 w-max h-max max-w-full rounded-md'>
      <div className='mb-4'>
        <span className='font-semibold text-slate-500 pr-2'>Name:</span>
        <span className='text-xs'>{user.firstName + ' ' + user.lastName}</span>
      </div>
      <div className="flex gap-x-4">
        <div className='mb-4'>
            <span className='font-semibold text-slate-500 pr-2'>Email:</span>
            <span className='text-xs'>{user.email}</span>
        </div>
        <div className='mb-4'>
            <span className='font-semibold text-slate-500 pr-2'>Phone:</span>
            <span className='text-xs'>{user.phone}</span>
        </div>
      </div>
      <div className='mb-4'>
        <span className='font-semibold text-slate-500 pr-2'>Address:</span>
        <span className='text-xs'>{user.address}</span>
      </div>
      <div className="flex gap-x-4">
        <div className='mb-4'>
            <span className='font-semibold text-slate-500 pr-2'>Gender:</span>
            <span className='text-xs'>{user.gender}</span>
        </div>
        <div className='mb-4'>
            <span className='font-semibold text-slate-500 pr-2'>Subscription:</span>
            <span className='text-xs'>{user.subscription.status}</span>
        </div>
      </div>
      <div className="flex gap-x-4">
        <div className='mb-4'>
            <span className='font-semibold text-slate-500 pr-2'>Last Login:</span>
            <span className='text-xs'>{user.lastLogin.toString()}</span>
        </div>
        <div className='mb-4'>
            <span className='font-semibold text-slate-500 pr-2'>Admin:</span>
            <form onSubmit={setAdminLevel} className='text-xs inline-flex align-middle'>
                <input type="number" min={0} max={5} value={level} onChange={changeLevel} className='w-9 h-6 pl-1 pr-0 bg-transparent'/>
                <button className='p-1 rounded-none text-base bg-white/20'><AiOutlineArrowRight /></button>
            </form>
        </div>
      </div>
      <div className='mb-4'>
        <span className='font-semibold text-slate-500 pr-2'>Registered:</span>
        <span className='text-xs'>{user.dateTime.toString()} ({user.loginType.toUpperCase()})</span>
      </div>
      <div className='flex pt-2'>
        <button className='px-4 py-2 w-full bg-white/5'>Suspend</button>
      </div>
    </div>
  )
}

export default User