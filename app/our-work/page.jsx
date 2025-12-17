import Navbar from '@/components/Navbar'
import React from 'react'
import Footer from '@/components/Footer'
import { Montserrat } from 'next/font/google'
import OurWork from '@/components/OurWork'
const montserrat = Montserrat({subsets:['latin'],weight:['400','700']})

const page = () => {
  return (
    <>
    <Navbar/>
    <OurWork/>

    {/* <Footer/> */}
    </>
  )
}

export default page