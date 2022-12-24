import Head from "next/head"

export const Canonical = ({ url }: { url: string }) => {
    return (<>
        <link rel='canonical' href={url} />
        <meta property="og:url" content={url} />
        <meta property="twitter:url" content={url} />
    </>)
}

export const SEO = ({ title, description, image, children }: { title?: string, description?: string, image?: string, children?: any }) => {
    return <Head>
        {!title ? <></> : <>
            <meta name="title" content={title} />
            <meta property="og:title" content={title} />
            <meta property="twitter:title" content={title} />
        </>}

        {!description ? <></> : <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta property="twitter:description" content={description} />
        </>}

        {!image ? <></> : <>
            <meta property="og:image" content={image} />
            <meta property="twitter:image" content={image} />
        </>}

        {children}
    </Head>
}