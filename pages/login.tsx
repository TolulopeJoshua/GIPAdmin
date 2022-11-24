import React from 'react'
import Footer from '../components/footer'
import Login from '../components/login'

const login = () => {
  return (
        <div className='w-full flex flex-col align-middle'>
            <Login />
            <Footer />
        </div>
  )
}

export default login