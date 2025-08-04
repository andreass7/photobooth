import Head from "next/head";

const PageHead = (props) => {
  const { title = "Photo Self" } = props;
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/globe.svg" type="image/x-icon" />
    </Head>
  );
};

export default PageHead;
