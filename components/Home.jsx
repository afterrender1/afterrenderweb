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
        {/* defer-render: skip layout/paint of off-screen sections on first load */}
        <div className="defer-render"><Testimonials /></div>
        <div className="defer-render"><Services /></div>
        <div className="defer-render"><ShortVideoClientTestimonials /></div>
        <div className="defer-render"><FAQ /></div>
        <div className="defer-render"><WorkWithUs /></div>
      </main>
      <div className="defer-render"><Footer /></div>
    </>
  )
}

export default Home
