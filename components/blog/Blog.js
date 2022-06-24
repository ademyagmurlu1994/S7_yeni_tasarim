import BlogItem from "./BlogItem";
import styles from "./style.module.scss"

function Blog() {
    return (
        <div className={styles.blogBody}>
            <div className="container">
                <span className={styles.blogTitle}>Popüler Blog İçerikleri</span>
                <div className="row">
                    <BlogItem />
                    <BlogItem />
                    <BlogItem />
                    <BlogItem />
                    <BlogItem />
                    <BlogItem />
                    <BlogItem />
                    <BlogItem />
                    <BlogItem />
                </div>
            </div>
        </div>
    );
}

export default Blog;