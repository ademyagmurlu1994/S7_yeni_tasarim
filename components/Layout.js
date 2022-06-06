import Nav from "./Nav";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="content">
      <link rel="stylesheet" href="/../static/css/bootstrap.min.css" />
      <Nav />
      <div style={{ marginTop: "10px" }}>{children}</div>

      <Footer />
    </div>
  );
};

export default Layout;
