import axios from 'axios';
import React, { useState } from 'react'
import proxy from '../utils/proxy';
import { docsActions } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { docsState } from '../types';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const login = (e: any) => {
    toast.loading('Logging in...')
    e.preventDefault();
    const url = proxy + '/login';
    axios.post(url, { username, password }).then(function(response) {
      const timeout = setTimeout(() => {
        dispatch(docsActions.resetStore({}))
      }, 24 * 59 * 60 * 1000);
      dispatch(docsActions.setAuth({...response.data, timeout}));
      toast.dismiss()
      router.push('/');
    }).catch(function(error) {
      toast.dismiss()
      toast.error('Could not log in!')
    })
  }

  return (
    <div className='flex justify-center w-full'>
    <form onSubmit={login} className='flex flex-col w-96 justify-center align-middle pb-8'>
        <p className='text-5xl text-center'>Login</p>
        <div className='group first-letter:flex flex-col text-slate-500 pb-8'>
            <label className='group-hover:text-white group-focus-within:text-white' htmlFor="email">Email</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className='peer text-white w-full bg-transparent border-2 group-hover:border-white invalid:border-red-300' type="email" name='email' /> 
        </div>
        <div className='group first-letter:flex flex-col text-slate-500 pb-8'>
            <label className='group-hover:text-white group-focus-within:text-white' htmlFor="password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className='peer text-white w-full bg-transparent border-2 group-hover:border-white invalid:border-red-300' minLength={8} type="password" name='password' /> 
        </div>
        <button className='border-2 border-slate-300 p-1 my-8 hover:bg-white/10 hover:text-white' type='submit'>Sign In</button>
    </form>
    </div>
  ) 
}

export default Login 