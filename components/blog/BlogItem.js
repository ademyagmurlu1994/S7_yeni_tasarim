import Image from "next/image";
import Button from "./details/Button";
import styles from "./style.module.scss"
import Link from "next/link";

function BlogItem() {
    return (
        <div className="col-md-4">
            <div className={styles.blogItem}>
                <Link href="/blog/blog-details">
                    <a>
                        <Image
                            src="/static/img/blog1.jpg"
                            height={270}
                            width={400}
                            objectFit="cover"
                        />
                    </a>
                </Link>

                <div className="px-2 mt-2">
                    <div className="my-3">
                        <Button>Sağlık</Button>
                    </div>
                    <div className={styles.blogItemTitle}>
                        <Link href="/blog/blog-details">
                            <a style={{color: "#3e464d"}}>
                                <p>Lorem ipsum dolor sit amet lorem ips, consectetur adipiscing elit,</p>
                            </a>
                        </Link>
                    </div>
                    <div className={styles.blogDescription}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna...
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogItem;