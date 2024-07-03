import { NextUIProvider } from "@nextui-org/react";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import "../public/styles/globals.css";
import "../public/styles/style.css";
import { Slide, ToastContainer } from "react-toastify";

import { NeoVisProvider } from "@/src/components/projectPage/visualization/neovisGraph/NeoVisContext";
import { ProjectPropsProvider } from "@/src/contexts/ProjectContext";
import { PropsProvider } from "@/src/contexts/PropsContext";
import { QueryPropsProvider } from "@/src/contexts/QueryContext";

/**
 * MyApp Component
 *
 * @description
 * This component is the main application wrapper for the Next.js application. It includes various context providers
 * and UI providers to ensure that the application state and UI framework are properly configured.
 *
 * @param {AppProps} appProps - The properties passed to the Next.js application component.
 * @returns {JSX.Element} - The main application wrapper with context and UI providers.
 */
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
      <NeoVisProvider>
        <NextUIProvider>
          <PropsProvider>
            <QueryPropsProvider>
              <ProjectPropsProvider>
                <Component {...pageProps} />
                <ToastContainer transition={Slide} />
              </ProjectPropsProvider>
            </QueryPropsProvider>
          </PropsProvider>
        </NextUIProvider>
      </NeoVisProvider>
    </>
  );
};

export default MyApp;
