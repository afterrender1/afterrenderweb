import ContactForm from '@/components/Contact'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ServicesCards from '@/components/ServiceCards'
import SocialHero from '@/components/SocialHero'
import Testimonials from '@/components/Testimonials'
import React from 'react'

const page = () => {
  return (
<>

<Navbar/>
<SocialHero/>
<ServicesCards/>
<Testimonials/>
<ContactForm/>
<Footer/>

</>
  )
}

export default page