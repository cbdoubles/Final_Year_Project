import { AppProps } from "next/app"
import Head from "next/head"
import React from "react"

import "../public/styles/globals.css"
import "../public/styles/style.css"
import "../public/styles/querytext.css"

const MyApp = ({ Component, pageProps }: AppProps<{}>) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=5, viewport-fit=cover"
          name="viewport"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
