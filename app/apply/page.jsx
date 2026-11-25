import ApplyForm from '@/components/Applyform'
import Navbar from '@/components/Navbar'
import React from 'react'
import { pageMetadata } from '@/app/lib/seo'

export const metadata = pageMetadata({
    title: "Careers: Video Editor & Web Developer Jobs",
    description:
        "Build your career with AfterRender. We're hiring passionate video editors and web / WordPress developers to join our creative team. Apply online today.",
    path: "/apply",
    keywords: ["video editor jobs", "remote video editor jobs", "video editing careers", "web developer jobs", "WordPress developer jobs"],
})

const page = () => {
    return (
        <>
            <Navbar />
            <ApplyForm />
        </>
    )
}

export default page
