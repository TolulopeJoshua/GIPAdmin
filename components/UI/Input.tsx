'use client'

import { ChangeEvent, useState } from "react";

const Input = ({ label, text }: any) => {
    const [compText, setComptext] = useState(text);

    const handlechange = (e: ChangeEvent<HTMLInputElement>) => {
        setComptext(e.target.value)
    }

  return (
    <div className='group px-2 py-2 relative'>
        <input className='peer bg-transparent w-full border-0 border-b-2 hover:border p-2 pt-8' name={label.toLowerCase()} id={label.toLowerCase()} type="text" defaultValue={text} onChange={(e) => handlechange(e)} />
        <label className={'text-slate-500 text-sm absolute transition-all left-4 bottom-6 peer-hover:top-4 peer-focus:top-4' + (compText ? ' top-4' : '')} htmlFor={label.toLowerCase()}>{label}</label>
    </div>
  )
} 

export default Input    