import React from 'react'

export default function Landing() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='w-full bg-blue-400 flex justify-between items-center flex-row px-4 rounded-b-2xl'>
        <p className='text-4xl font-medium'>SitSit</p>
        <div className='flex flex-row gap-6 my-4 mx-6'>
            <p className='font-bold text-l px-2 py-1'>Log in</p>
            <p className='font-bold text-l bg-red-800 px-2 py-1'>Register</p>
        </div>
      </div>
      <div className=' min-h-screen flex flex-row justify-gap-10'>
        <div className='bg-amber-300 flex-1 text-8xl text-gradient-to-r from-yellow-400 to-red-500 font-bold align-center justify-center'>
            <p>SITSIT</p>
        </div>
        <div className='bg-red-200 flex-1'>
            <p>
                SitSit is a modern, streamlined sit-in management system designed to make tracking computer lab sessions effortless. 
                Log in, claim your seat, and get to work—we handle the rest.
            </p>
        </div>
      </div>
    </div>
  )
}
