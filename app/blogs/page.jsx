import Blogs from '@/components/Blogs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import React from 'react'
import { getBlogList } from '@/app/lib/blogs'
import { SITE_URL, KEYWORDS, pageMetadata, jsonLdGraph, webPageJsonLd, breadcrumbJsonLd } from '@/app/lib/seo'

// Rebuilt at most once an hour; creating, editing or deleting a post refreshes it right away
export const revalidate = 3600

const TITLE = "Video Editing & Content Marketing Blog"
const DESCRIPTION =
    "Ideas, guides and case studies on video editing, design and marketing from the AfterRender team: short-form content, YouTube growth, motion graphics and more."

export const metadata = pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/blogs",
    keywords: [
        "video editing blog",
        "video editing tips",
        "content marketing blog",
        "short form video tips",
        "YouTube growth tips",
        ...KEYWORDS.core.slice(0, 6),
    ],
})

const page = async () => {
    // Loaded on the server so every post link is in the HTML (null = DB unreachable: list loads in the browser)
    const blogs = await getBlogList()

    return (
        <>
            <JsonLd
                data={jsonLdGraph(
                    webPageJsonLd({ path: "/blogs", name: TITLE, description: DESCRIPTION, type: "CollectionPage" }),
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Blog", path: "/blogs" },
                    ]),
                    blogs?.length
                        ? {
                              "@type": "Blog",
                              "@id": `${SITE_URL}/blogs#blog`,
                              name: "The Journal by AfterRender",
                              url: `${SITE_URL}/blogs`,
                              publisher: { "@id": `${SITE_URL}/#organization` },
                              blogPost: blogs.slice(0, 50).map((post) => ({
                                  "@type": "BlogPosting",
                                  headline: post.title,
                                  url: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
                                  datePublished: post.createdAt || undefined,
                                  dateModified: post.updatedAt || post.createdAt || undefined,
                                  image: post.image || undefined,
                              })),
                          }
                        : null
                )}
            />
            <Navbar />
            <Blogs initialBlogs={blogs} />
            <Footer />
        </>
    )
}

export default page
