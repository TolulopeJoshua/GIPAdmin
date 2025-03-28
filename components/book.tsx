import { ChangeEvent, MouseEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { AiOutlineSave, AiOutlineDelete, AiOutlineUpload, AiOutlineDownload } from 'react-icons/ai'
import { book, docsState } from '../types'
import { useDispatch, useSelector } from 'react-redux';
import { docsActions } from '../store';
import toast from 'react-hot-toast';
import axios from 'axios';
import proxy from '../utils/proxy';

const Book = ({ book }: {book: book}) => {
    const size = book.document.size >= 1000000 ? Math.round(book.document.size / 10000) / 100 + ' MB' : Math.round(book.document.size / 1000) + ' KB';
    const [changed, setChanged] = useState(false);
    const [compBook, setCompBook] = useState(book);
    const [imageMode, setImageMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const dispatch = useDispatch();
    const { auth } = useSelector(({ docs }: {docs: docsState}) => docs);

    const onChange = (e: any) => {
        setCompBook((initBook: book) => {
          if (e.target.name == 'amazon') {
            return { ...initBook, affiliates: { amazon: e.target.value} };
          }
            return {...initBook, [e.target.name]: e.target.value}
        })
    }
    const onSave = (e: MouseEvent) => {
        e.preventDefault();
        toast.loading('Saving...')
        const url = proxy + '/book';
        axios.put(url, compBook, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            toast.dismiss()
            toast.success(' Saved ')
            dispatch(docsActions.setBook(response.data));
            setCompBook(response.data);
          })
          .catch(function (error) {
            toast.dismiss();
            toast.error('An error occured.')
          })
    }
    const onDelete = (e: any) => {
        e.preventDefault();
        if (confirm('Sure to delete?')) {
          toast.loading('Deleting...')
          const url = proxy + `/book/${compBook._id}`;
          axios.delete(url, { headers: {'Authorization': `Bearer ${auth.token}`}})
            .then(function (response) {
              dispatch(docsActions.deleteBook(response.data));
              toast.dismiss()
              toast.success(' Deleted ')
            })
            .catch(function (error) {
              toast.dismiss();
              toast.error('An error occured.')
            })
        }
    }
    const onApprove = (e: MouseEvent) => {
        e.preventDefault();    
        toast.loading('Updating...')
        const url = proxy + '/book';
        axios.put(url, {...compBook, isApproved: !compBook.isApproved}, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            console.log(response)
            toast.dismiss();
            toast.success(' Updated ')
            dispatch(docsActions.setBook(response.data));
            setCompBook(response.data);
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
        const url = proxy + `/bookImage/${book._id}`;
        axios.put(url, formData, { headers: {'Authorization': `Bearer ${auth.token}`}})
          .then(function (response) {
            toast.dismiss();
            toast.success(' Uploaded ')
            dispatch(docsActions.setBook(response.data));
            setCompBook(response.data);
            setImageMode(false);
            document.getElementById(`${compBook._id}_imageFile`)!.value = null;
          })
          .catch(function (error) {
            toast.dismiss();
            toast.error('An error occured.')
          })
      }
    }
    useEffect(() => {
        setChanged(JSON.stringify(book) !== JSON.stringify(compBook))
    })
     
  return (
    <div className='bg-white/5 w-[700px] border-y-4 border-slate-700 max-w-full rounded-md flex relative'>
        <form className='w-6/12 px-1 pt-2 h-full flex flex-col gap-2'>
            <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Title</label>
            <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBook.title} onChange={onChange} name="title" id="" rows={2}></textarea>
            <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Author</label>
            <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBook.author} onChange={onChange} name="author" id="" rows={1}></textarea>
            <div className='grid grid-cols-2 gap-2'>
                <div>
                    <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">File Type</label>
                    <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBook.filetype} onChange={onChange} name='filetype' id="" rows={1}></textarea>
                </div> 
                <div> 
                    <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Size</label>
                    <textarea readOnly className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={size} id="" rows={1}></textarea>
                </div>
            </div>
            <label className='text-xs text-slate-500 m-0 p-1' htmlFor="">Amazon Link</label>
            <textarea className='bg-transparent border-b-2 border-0 w-full px-1 text-xs scrollbar' value={compBook.affiliates.amazon} onChange={onChange} name="amazon" id="" rows={1}></textarea>
            <div className='flex mt-auto pt-2'>
                <button onClick={onApprove} type='button' className='text-xs p-2 mr-auto'>{book.isApproved ? 'DISAPPROVE' : 'APPROVE'}</button>
                <button disabled={!changed} onClick={onSave}><AiOutlineSave /></button>
                <a href={`https://godinprintsdocuments.s3.amazonaws.com/${book.document.key}`} className='btn p-2'><AiOutlineDownload /></a>
                <button disabled={auth.admin !== 5} onClick={onDelete} type='button'><AiOutlineDelete /></button>
            </div>
        </form>
        <div className='w-6/12 px-1 h-full overflow-y-auto right-0 top-0 scrollbar text-sm text-justify relative'>
            <img className='m-0 p-0' src={book.image.key == 'none' ? 'none.png' : `https://godinprintsdocuments.s3.amazonaws.com/${book.image.key}`} alt="book_img" />
            <label htmlFor={`${compBook._id}_imageFile`} className='btn absolute bottom-0 right-1 p-1 bg-slate-500 hover:bg-slate-400 hover:text-white'><AiOutlineUpload /></label>
            <input onChange={onSelectImage} className={`absolute bottom-0 right-0 px-2 py-1 w-full bg-slate-400 text-slate-700 text-xs font-semibold outline-none border-0 file:hidden ${!imageMode && 'hidden'}`} type={'file'} id={`${compBook._id}_imageFile`}/>
            <label onClick={uploadImage} className={`btn absolute bottom-0 right-1 p-1 bg-slate-500 hover:bg-slate-400 hover:text-white ${!imageMode && 'hidden'}`}><AiOutlineUpload /></label>
        </div>
    </div>
  )
}
 
export default Book