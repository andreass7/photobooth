import { Fragment } from "react";
import PageHead from "../common";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const LayoutApp = (props) => {
  return (
    <div>
      <Fragment>
        <PageHead title={props.title} />
        <section className={`min-h-screen bg-white ${inter.className}`}>
          {props.children}
        </section>
      </Fragment>
    </div>
  );
};
export default LayoutApp;
