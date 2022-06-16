import "../styles/globals.scss";
import Head from "next/head";
import Header from "../component/header";
import SessionContext from "../contexte/session";
import { ProvideSearch } from "../contexte/search";

import App from "next/app";
import { parseCookies } from "nookies";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>My Immo</title>
        <meta
          name="description"
          content="Cherche et trouve l'appart de tes rêves sur My Immo !"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionContext.Provider value={pageProps.user}>
        <Header />
        <ProvideSearch>
          <Component {...pageProps} />
        </ProvideSearch>
      </SessionContext.Provider>
    </>
  );
}

export default MyApp;

// Info de la page actuel
MyApp.getInitialProps = async (appContext) => {
  // dire a tout le site si l'user est co ou pas
  const cookies = parseCookies(appContext.ctx);

  // APP de next
  const pageProps = await App.getInitialProps(appContext);

  if (cookies.authToken) {
    // user connecter sur tout le site
    return {
      pageProps: { ...pageProps.pageProps, user: true },
    };
  } else {
    // user pas connecter
    return pageProps;
  }
};
