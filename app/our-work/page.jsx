import Navbar from '@/components/Navbar'
import React from 'react'
import Footer from '@/components/Footer'
import { Montserrat } from 'next/font/google'
const montserrat = Montserrat({subsets:['latin'],weight:['400','700']})

const page = () => {
  return (
    <>
    <Navbar/>

    {/* <Footer/> */}
    </>
  )
}

export default page