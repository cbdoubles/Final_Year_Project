import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import "../public/styles/globals.css";
import "../public/styles/style.css";
import { PropsProvider } from "@/src/contexts/PropsContext";
import { ProjectPropsProvider } from "@/src/contexts/ProjectContext";
import { NextUIProvider } from "@nextui-org/react";
import { QueryPropsProvider } from "@/src/contexts/QueryContext";
import { Slide, ToastContainer } from "react-toastify";

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
    </>
  );
};

export default MyApp;

// import React from "react";
// import CustomQueryForm from "@/src/components/CustomQueryForm"; // Adjust the path based on your directory structure

// function MyApp({ Component, pageProps }) {
//   return (
//     <div>
//       <CustomQueryForm />
//       <Component {...pageProps} />
//     </div>
//   );
// }

// export default MyApp;
