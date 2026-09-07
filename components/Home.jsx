import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Testimonials from './Testimonials'
import FAQ from './FAQ'
import ContactForm from './Contact'
import Footer from './Footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Testimonials />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}

export default Home


