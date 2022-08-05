import ".//../static/css/bootstrap.min.css";
import ".//../static/css/themify-icons.css";
import ".//../static/css/materialdesignicons.min.css";
import ".//../static/css/menu.css";
import ".//../static/css/font-awe/css/all.css";
import ".//../static/css/animate.min.css";
import ".//../static/css/colors.css";
import ".//../static/css/timeline.css";
import ".//../static/css/style.css";
import ".//../static/css/custom.css";
import ".//../static/css/payment.css";
import ".//../static/css/stepper.css";
import ".//../static/css/custom-fields.css";
import ".//../static/scss/_blog.scss";
import ".//../static/scss/_button.scss";
import ".//../static/scss/_sections.scss";
import ".//../static/scss/_services.scss";
/**/
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//05082022
import "/static/scss/custom-new-design.scss";

import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import Layout from "../components/Layout";

import store from "../stores/index.js";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";

//Componentler
import AddBlockWarning from "/components/pop-up/AddBlockWarning";
import PagePreLoader from "/components/common/PagePreLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//fonksiyonlar
import { writeResponseError, getNewToken, getClientIpAdress } from "/functions/common";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const basePath = router.basePath;

  const [appState, setAppState] = useState({ clientIpAddress: "" });
  const [isShowAddBlockWarn, setIsShowAddBlockWarn] = useState(false);

  useEffect(async () => {
    //Sayfa yüklendiğinde api token'ı çağırıyoruz.
    //await getNewToken();
    if (isShowAddBlockWarn == false) {
      try {
        await getClientIpAdress().then((res) => {
          if (!res) {
            setIsShowAddBlockWarn(true);
          }
        });
      } catch (error) {
        setIsShowAddBlockWarn(true);
        //console.log("asdfasdfasdf: ", isShowAddBlockWarn);
      }
    }
  }, []);

  return (
    <Provider store={store}>
      {/* <AddBlockWarning isShow={isShowAddBlockWarn} /> */}
      {/* <ToastPopup /> */}
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        theme={"colored"}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <link rel="icon" type="image/x-icon" href="#" />
        <title>Sigorta7 {basePath}</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/*Static js dosyalarını bu kısımda projeye dahil ediyoruz*/}
      <script src="/static/js/jquery.min.js"></script>
      <script src="/static/js/bootstrap.bundle.min.js"></script>
      {/* <script src="//api.backendless.com/sdk/js/latest/backendless.js"></script> */}
      <script src="/static/js/imask.min.js"></script>
      <script src="/static/js/payment.js"></script>
      <script src="/static/js/custom-mask.js"></script>
      <script src="/static/js/custom.js"></script>
    </Provider>
  );
}

export default MyApp;
