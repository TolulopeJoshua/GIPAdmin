
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineSave, AiOutlineDelete, AiOutlineUpload, AiOutlineEdit } from 'react-icons/ai'
import {MdOutlineDone} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { docsActions } from '../store';
import { biography, docsState } from '../types'
import proxy from '../utils/proxy';

const Biography = ({biography}: {biography: biography}) => {
    const [changed, setChanged] = useState(false);
    const [compBiography, setCompBiography] = useState(biography);
    const [textMode, setTextMode] = useState(false);
    const [imageMode, setImageMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const dispatch = useDispatch();
    const { auth } = useSelector(({ docs }: {docs: docsState}) => docs);

    const onChange = (e: any) => {
        setCompBiography(init => {
            return {...init, [e.target.name]: e.target.value}
        })
    }
    const onSave = (e: any) => {
        e.preventDefault();
        toast.loading('Saving...')
        const url = proxy + '/doc';
        axios.put(url, compBiography, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            toast.dismiss()
            toast.success(' Saved ')
            dispatch(docsActions.setBiography(response.data));
            setCompBiography(response.data);
          })
          .catch(function (error) {
            toast.dismiss();
            toast.error('An error occured.')
          })
    }
    const onApprove = (e: any) => {
        e.preventDefault();    
        toast.loading('Updating...')
        const url = proxy + '/doc';
        axios.put(url, {...compBiography, isApproved: !compBiography.isApproved}, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            toast.dismiss();
            toast.success(' Updated ')
            dispatch(docsActions.setBiography(response.data));
            setCompBiography(response.data);
          })
          .catch(function (error) {
            toast.dismiss();
            toast.error('An error occured.')
          })
    }
    const onSelectImage = (e: any) => {
      setImageMode(true);
      setImageFile(e.target.files[0]);
    }
    const uploadImage = () => {
      if (imageFile != null) {
        toast.loading('Uploading...')
        let formData = new FormData();
        formData.append('image', imageFile);
        const url = proxy + `/docImage/${biography._id}`;
        axios.put(url, formData, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            toast.dismiss();
            toast.success(' Uploaded ')
            dispatch(docsActions.setBiography(response.data));
            setCompBiography(response.data);
            setImageMode(false);
            document.getElementById(`${compBiography._id}_imageFile`) && (document.getElementById(`${compBiography._id}_imageFile`).value = null);
          })
          .catch(function (error) {
            toast.dismiss();
            toast.error('An error occured.')
          })
      }
    }
    const saveText = () => {
      toast.loading('Updating...')
      const url = proxy + `/text/${biography._id}`;
      axios.put(url, {
        text: document.getElementById(`${biography._id}_text`)?.innerHTML
      }, { headers: {'Authorization': `Bearer ${auth.token}`}})
        .then(function (response) {
          toast.dismiss();
          toast.success(' Updated ')
          dispatch(docsActions.setBiography(response.data));
          setCompBiography(response.data);
          setTextMode(false);
        })
        .catch(function (error) {
          toast.dismiss();
          toast.error('An error occured.')
        })
    }
    useEffect(() => {
        setChanged(JSON.stringify(biography) != JSON.stringify(compBiography))
    }, [compBiography])
    useEffect(() => {
        const url = proxy + `/text/${biography._id}`;
        axios.get(url, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) { 
            document.getElementById(`${biography._id}_text`) && (document.getElementById(`${biography._id}_text`).innerHTML = response.data);
          })
          .catch(function (error) {
            document.getElementById(`${biography._id}_text`) && (document.getElementById(`${biography._id}_text`).innerHTML = 'Error loading text!');
          })
    }, [])
     
  return (
    <div className='bg-white/5 w-[700px] border-y-4 border-slate-700 max-w-full rounded-md flex relative overflow-clip'>
    <form className='w-4/12 px-1 h-full flex flex-col'>
            <div className='relative'>
                <img className='block p-0 m-0 rounded-md' src={biography.image.key == 'none' ? 'none.png' : `https://godinprintsdocuments.s3.amazonaws.com/${biography.image.key}`} alt="bio_pic" />
                <label htmlFor={`${compBiography._id}_imageFile`} className='btn absolute bottom-0 right-0 p-1 bg-slate-500 hover:bg-slate-400 hover:text-white'><AiOutlineUpload /></label>
                <input onChange={onSelectImage} className={`absolute bottom-0 right-0 px-2 py-1 w-full bg-slate-400 text-slate-700 text-xs font-semibold outline-none border-0 file:hidden ${!imageMode && 'hidden'}`} type={'file'} id={`${compBiography._id}_imageFile`}/>
                <label onClick={uploadImage} className={`btn absolute bottom-0 right-0 p-1 bg-slate-500 hover:bg-slate-400 hover:text-white ${!imageMode && 'hidden'}`}><AiOutlineUpload /></label>
            </div>
            <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Name</label>
            <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBiography.name} onChange={onChange} name="name" id="" rows={1}></textarea>
            <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-2'>
                    <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Gender</label>
                    <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBiography.gender} onChange={onChange} name="gender" id="" rows={1}></textarea>
                </div>
                <div className='col-span-3'>
                    <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Role</label>
                    <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBiography.role} onChange={onChange} name="role" id="" rows={1}></textarea>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <div>
                    <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Birth</label>
                    <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBiography.birthYear} onChange={onChange} name="birthYear" id="" rows={1}></textarea>
                </div>
                <div>
                    <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Death</label>
                    <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBiography.deathYear} onChange={onChange} name="deathYear" id="" rows={1}></textarea>
                </div>
            </div>
            <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Source</label>
            <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBiography.source} onChange={onChange} name="source" id="" rows={1}></textarea>
            <div className='flex pt-2 mt-auto'>
                <button onClick={onApprove} type='button' className='text-xs p-2 mr-auto'>{compBiography.isApproved ? 'DISAPPROVE' : 'APPROVE'}</button>
                <button disabled={!changed} onClick={onSave} className='p-2 disabled:text-slate-500 disabled:bg-transparent'><AiOutlineSave /></button>
                {/* <button type='button' className='p-2'><AiOutlineDelete /></button> */}
            </div>
        </form>
        <div contentEditable={textMode} id={`${biography._id}_text`} className={'w-8/12 p-1 pb-8 h-full overflow-y-auto absolute right-0 top-0 scrollbar text-sm text-justify whitespace-pre-line ' + (textMode && 'bg-slate-200 text-black')}>
            Loading text...
        </div>
        <button onClick={() => setTextMode(true)} className='absolute right-2 bottom-0 p-2 bg-slate-500 hover:bg-slate-400 hover:text-white'><AiOutlineEdit /></button>
        <button onClick={saveText} className={`absolute right-2 bottom-0 p-2 bg-slate-500 hover:bg-slate-400 hover:text-white ${!textMode && 'hidden'}`}><MdOutlineDone /></button>
    </div>
  )  
} 
 
export default Biography   