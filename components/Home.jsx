import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import FAQ from './FAQ'
import ContactForm from './Contact'
import Footer from './Footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}

export default Home


