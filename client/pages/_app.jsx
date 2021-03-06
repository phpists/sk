import React from 'react'
import App from "next/app";
import { ApolloProvider } from "@apollo/react-hooks";
import withApollo from "lib/withApollo";
import {MainLayout} from 'layouts'
import "styles/style.scss";
import { appWithTranslation } from 'lib/i18n';
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import { NextSeo } from 'next-seo';
import {YMInitializer} from "react-yandex-metrika";
import Cookies from 'js-cookie';
import Error from './_error';

const LangTags = () => {
  const {asPath} = useRouter();
  const {i18n} = useTranslation();

  const tags = i18n.options.allLanguages.map(lang => {
    let path = asPath;

    for (let i in i18n.options.otherLanguages) {
      path = path.replace(`${i18n.options.otherLanguages[i]}/`, '/');
    }

    if (lang === 'de' && path === '/') {
      path = '';
    }

    return {
      hrefLang: lang,
      href: `${process.env.APP_URL}${lang === 'de' ? '' : `/${lang}`}${path}`
    };
  });

  return (
    <NextSeo
      languageAlternates={tags}
    />
  );
};

const Analytics = () => {
  if (typeof document === 'undefined' || process.env.ANALYTICS_SCRIPTS !== 'true') {
    return null;
  }

  return (
    <YMInitializer
      accounts={[62055295]}
      options={{
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      }}
    />
  );
};

const RefHandler = () => {
  const {query} = useRouter();

  if (typeof window === 'undefined') {
    return null;
  }

  if (!query.ref_code) {
    return null;
  }

  Cookies.set('ref_code', query.ref_code, { expires: 30 });

  return null;
};

class MyApp extends App {
  static displayName = "MyApp";

  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);

    if (appContext.ctx && appContext.ctx.req && appContext.ctx.req.originalUrl) {
      const manySlashes = appContext.ctx.req.originalUrl.includes('//');
      const fakeUrlParams = appContext.ctx.req.originalUrl.includes('[canton]')
        || appContext.ctx.req.originalUrl.includes('[city]')
        || appContext.ctx.req.originalUrl.includes('[id]')
        || appContext.ctx.req.originalUrl.includes('[eid]')
        || appContext.ctx.req.originalUrl.includes('[cid]');

      if (manySlashes || fakeUrlParams) {
        appContext.ctx.res.statusCode = 404;

        return { ...appProps, pageNotFound: true }
      }
    }

    return { ...appProps }
  }

  render() {
    const { Component, pageProps, apolloClient, pageNotFound } = this.props;

    if (pageNotFound) {
      return <Error statusCode={404}/>
    }

    const getLayout =
        Component.getLayout || (page => <MainLayout {...pageProps} children={page} />)

      return (
        <ApolloProvider client={apolloClient}>
          <LangTags/>
          <RefHandler/>

          {getLayout(<Component {...pageProps} />, pageProps)}

          <Analytics/>
        </ApolloProvider>
      )
  }
}

export default withApollo(appWithTranslation(MyApp));
