import Header from "../../components/blog/details/Header";
import Blog from "../../components/blog//details/Blog"
import BlogItem from "../../components/blog/BlogItem"

function BlogDetail() {
    return (
        <div style={{ marginTop: "85px" }} className="container">
            <Header />
            <Blog />
            <div className="d-flex flex-column align-items-center mt-5 mb-5">
                <p style={{ color: "#3e464d", fontWeight: "500", fontSize: "25px" }}>Bunları da Beğenebilirsiniz</p>
                <div className="row mt-4" style={{color: "#3e464d"}}>
                    <BlogItem />
                    <BlogItem />
                    <BlogItem />
                </div>
                
            </div>
        </div>
    );
}

export default BlogDetail;