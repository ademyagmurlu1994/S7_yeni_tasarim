import Nav from "../components/Nav";
//import HomeFold from "../components/HomeFold";
import TopFoldFoldServices from "/components/home/TopFoldServices";
import TopFoldBanner from "/components/home/TopFoldBanner";
import Partners from "/components/home/Partners";
import ClientFeedbacks from "/components/home/ClientFeedbacks";
import SSS from "/components/home/SSS";
import Communication from "/components/home/Communication";

export default function Home() {
  return (
    <div>
      <TopFoldBanner />
      <TopFoldFoldServices />
      <Partners />
      <ClientFeedbacks />
      <SSS />
      <Communication />
    </div>
  );
}
