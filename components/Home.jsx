import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Testimonials from './Testimonials'
import CaseStudies from './CaseStudies'
import Portfolio from './Portfolio'
import HowItWorks from './HowItWorks'
import OurOffers from './OurOffres'
import FAQ from './FAQ'
import Footer from './Footer'
import ContactForm from './Contact'
import VideoTestimonials from './VideoTestimonials'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Testimonials />
      <CaseStudies />
      <Portfolio />
      <HowItWorks />
      <OurOffers />
      <FAQ />
      <VideoTestimonials />
      <ContactForm />
      <Footer />
    </>
  )
}

export default Home


