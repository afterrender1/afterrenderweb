import Navbar from '@/components/Navbar'
import React from 'react'
import Footer from '@/components/Footer'
import OurWork from '@/components/OurWork'
import ContactForm from '@/components/Contact'

const page = () => {
  return (
    <>
      <Navbar />
      <OurWork />
      <ContactForm />
      <Footer />
    </>
  )
}

export default page