import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux';
import { docsState } from '../types';

const ListBorder = ({list, className, children}: {list: Array<object>, className: string, children: ReactNode}) => {
    const { loading, error } = useSelector(({ docs }: {docs: docsState}) => docs);

  return (
    list.length ? 
    <div className={className}>{children}</div> :
    <div className='border-2 border-dashed rounded-md w-full max-w-screen-sm h-4/6 flex justify-center items-center mx-[auto] my-[auto]'>
        {
            loading ? <span>Loading items. Please wait...</span> :
            error ? <span>Error loading items. Kindly refresh.</span> :
            <span>There are no items to display.</span>
        }
    </div>
  )
}

export default ListBorder