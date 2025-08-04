import NavbarLayout from "../ui/Navbar/Navbar";

const { Fragment } = require("react");
const { default: PageHead } = require("../common");

const LayoutApp = (props) => {
  return (
    <div>
      <Fragment>
        <PageHead title={props.title} />
        <section className="min-h-screen bg-gradient-to-b from-green-200 to-white ">
          {props.children}
        </section>
      </Fragment>
    </div>
  );
};
export default LayoutApp;
