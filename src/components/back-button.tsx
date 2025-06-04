'use client'
import { ChevronLeftIcon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

function BackButton() {
  return (
    <Button variant={'ghost'} className='absolute top-4 z-[10000] flex items-center w-fit px-3 h-10  backdrop-blur-2xl'>
        <ChevronLeftIcon className='text-amber-50 size-10'/>
        <span className='text-lg text-amber-50'>Back</span>
    </Button>
  )
}

export default BackButton