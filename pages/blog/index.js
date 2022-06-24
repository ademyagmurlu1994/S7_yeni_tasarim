import AllSee from "../../components/blog/AllSee";
import Blog from "../../components/blog/Blog";
import Header from "../../components/blog/Header";
import Slider from "../../components/blog/Slider";

function Index() {
    return (
        <div style={{ marginTop: "85px" }}>
            <Header/>
            <Slider/>
            <Blog/>
            <AllSee/>
        </div>
    );
}

export default Index;