import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Testimonials from './Testimonials'
import Services from './Services'
import ShortVideoClientTestimonials from './ShortVideoClientTestimonials'
import FAQ from './FAQ'
import WorkWithUs from './WorkWithUs'
import Footer from './Footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Testimonials />
        <Services />
        <ShortVideoClientTestimonials />
        <FAQ />
        <WorkWithUs />
      </main>
      <Footer />
    </>
  )
}

export default Home


