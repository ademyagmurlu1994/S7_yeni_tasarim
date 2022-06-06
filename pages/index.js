import Nav from "../components/Nav";
//import HomeFold from "../components/HomeFold";
import TopFoldFoldServices from "/components/home/TopFoldServices";
import TopFoldBanner from "/components/home/TopFoldBanner";
import ClientFeedbacks from "/components/home/ClientFeedbacks";
import Communication from "/components/home/Communication";

export default function Home() {
  return (
    <div>
      <TopFoldFoldServices />
      <TopFoldBanner />
      <ClientFeedbacks />
      <Communication />
    </div>
  );
}
