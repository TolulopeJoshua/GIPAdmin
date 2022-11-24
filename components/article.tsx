import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineSave, AiOutlineDelete, AiOutlineUpload, AiOutlineEdit } from 'react-icons/ai'
import {MdOutlineDone} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { docsActions } from '../store';
import { article, docsState } from '../types'
import proxy from '../utils/proxy';

const Article = ({article}: {article: article}) => {
    const [changed, setChanged] = useState(false);
    const [compArticle, setCompArticle] = useState(article);
    const [textMode, setTextMode] = useState(false);
    const [imageMode, setImageMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const dispatch = useDispatch();
    const { auth } = useSelector(({ docs }: {docs: docsState}) => docs);

    const onChange = (e: any) => {
        setCompArticle(init => {
            return {...init, [e.target.name]: e.target.value}
        })
    }
    const onSave = (e: any) => {
        e.preventDefault();
        toast.loading('Saving...')
        const url = proxy + '/doc';
        axios.put(url, compArticle, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            toast.dismiss()
            toast.success(' Saved ')
            dispatch(docsActions.setArticle(response.data));
            setCompArticle(response.data);
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
        axios.put(url, {...compArticle, isApproved: !compArticle.isApproved}, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            toast.dismiss();
            toast.success(' Updated ')
            dispatch(docsActions.setArticle(response.data));
            setCompArticle(response.data);
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
        const url = proxy + `/docImage/${article._id}`;
        axios.put(url, formData, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            toast.dismiss();
            toast.success(' Uploaded ')
            dispatch(docsActions.setArticle(response.data));
            setCompArticle(response.data);
            setImageMode(false);
            document.getElementById(`${compArticle._id}_imageFile`)?.value = null;
          })
          .catch(function (error) {
            toast.dismiss();
            toast.error('An error occured.')
          })
      }
    }
    const saveText = () => {
      toast.loading('Updating...')
      let formData = new FormData();
      const url = proxy + `/text/${article._id}`;
      axios.put(url, { text: document.getElementById(`${article._id}_text`)?.innerHTML }, 
      { headers: {'Authorization': `Bearer ${auth.token}`}}).then(function (response) {
          toast.dismiss();
          toast.success(' Updated ')
          dispatch(docsActions.setArticle(response.data));
          setCompArticle(response.data);
          setTextMode(false);
        }).catch(function (error) {
          toast.dismiss();
          toast.error('An error occured.')
        })
    }
    useEffect(() => {
        setChanged(JSON.stringify(article) !== JSON.stringify(compArticle))
    }, [compArticle])
    useEffect(() => {
      const url = proxy + `/text/${article._id}`;
      axios.get(url, { headers: {'Authorization': `Bearer ${auth.token}`}})
        .then(function (response) { 
          document.getElementById(`${article._id}_text`) && (document.getElementById(`${article._id}_text`).innerHTML = response.data);
        })
        .catch(function (error) {
          document.getElementById(`${article._id}_text`) && (document.getElementById(`${article._id}_text`).innerHTML = 'Error loading text!');
        })
    }, [])
     
  return (
    <div className='bg-white/5 w-[700px] border-y-4 border-slate-700 max-w-full rounded-md flex relative overflow-hidden'>
        <form className='w-4/12 px-1 h-full flex flex-col'>
            <div className='relative'>
                <img className='block p-0 m-0 rounded-md' src={article.image.key == 'none' ? 'none.png' : `https://godinprintsdocuments.s3.amazonaws.com/${article.image.key}`} alt="bio_pic" />
                <label htmlFor={`${compArticle._id}_imageFile`} className='btn absolute bottom-0 right-0 p-1 bg-slate-500 hover:bg-slate-400 hover:text-white'><AiOutlineUpload /></label>
                <input onChange={onSelectImage} className={`absolute bottom-0 right-0 px-2 py-1 w-full bg-slate-400 text-slate-700 text-xs font-semibold outline-none border-0 file:hidden ${!imageMode && 'hidden'}`} type={'file'} id={`${compArticle._id}_imageFile`}/>
                <label onClick={uploadImage} className={`btn absolute bottom-0 right-0 p-1 bg-slate-500 hover:bg-slate-400 hover:text-white ${!imageMode && 'hidden'}`}><AiOutlineUpload /></label>
            </div>
            <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Title</label>
            <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compArticle.name} onChange={onChange} name="name" id="" rows={2}></textarea>
            <div>
                <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Category</label>
                <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compArticle.role} onChange={onChange} name="role" id="" rows={1}></textarea>
            </div>
            <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Source</label>
            <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compArticle.source} onChange={onChange} name="source" id="" rows={1}></textarea>
            <div className='flex pt-2 mt-auto'>
                <button onClick={onApprove} type='button' className='text-xs p-2 mr-auto'>{article.isApproved ? 'DISAPPROVE' : 'APPROVE'}</button>
                <button disabled={!changed} onClick={onSave} className='p-2 disabled:text-slate-500 disabled:bg-transparent'><AiOutlineSave /></button>
                {/* <button type='button' className='p-2'><AiOutlineDelete /></button> */}
            </div>
        </form>
        <div contentEditable={textMode} id={`${article._id}_text`} className={'w-8/12 p-1 pb-8 h-full overflow-y-auto absolute right-0 top-0 scrollbar text-sm text-justify whitespace-pre-line ' + (textMode && 'bg-slate-200 text-black')}>
            Loading text...
        </div>
        <button onClick={() => setTextMode(true)} className='absolute right-2 bottom-0 p-2 bg-slate-500 hover:bg-slate-400 hover:text-white'><AiOutlineEdit /></button>
        <button onClick={saveText} className={`absolute right-2 bottom-0 p-2 bg-slate-500 hover:bg-slate-400 hover:text-white ${!textMode && 'hidden'}`}><MdOutlineDone /></button>
    </div>
  ) 
}
 
export default Article   