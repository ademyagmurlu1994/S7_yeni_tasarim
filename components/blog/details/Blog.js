import Image from "next/image";
import styles from "../style.module.scss"
import SocialMedia from "./SocialMedia";

function Blog() {
    return (
        <div className={styles.blogDetail}>
            <Image
                src="/static/img/blog1.jpg"
                height={500}
                width={1000}
                objectFit="cover"
            />
            <h2 className="h5 pt-4" style={{ color: "#3e464d" }}><strong>H2 Lorem ipsum dolor sit amet lorem ips, consectetur adipiscing elit,Lorem ipsum</strong></h2>
            <span className="h5 pt-3 d-block" style={{ color: "#3e464d", fontWeight: "400", lineHeight: "25px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
            </span>
            <span className="h5 pt-3 d-block" style={{ color: "#3e464d", fontWeight: "400", lineHeight: "25px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
            </span>

            <ul className={styles.list}>
                <li style={{ color: "#3e464d" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt </li>
                <li style={{ color: "#3e464d" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt </li>
                <li style={{ color: "#3e464d" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt </li>
                <li style={{ color: "#3e464d" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt </li>
                <li style={{ color: "#3e464d" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt </li>
            </ul>

            <div className="">
                <h3 className="h5" style={{ color: "#3e464d" }}>
                    <i>‘’Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis lorem ipsum dolor sit amet.‘’</i>
                </h3>
            </div>
            <div className="mt-5">
                <div className="row mb-5">
                    <div className="col-md-6">
                        <Image
                            src="/static/img/blog1.jpg"
                            height={500}
                            width={1000}
                            objectFit="cover"
                        />
                    </div>
                    <div className="col-md-6" style={{ color: "#3e464d", fontSize: "18px" }}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis lorem ipsum dolor sit amet.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis lorem ipsum dolor sit amet.</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Image
                            src="/static/img/blog1.jpg"
                            height={500}
                            width={1000}
                            objectFit="cover"
                        />
                    </div>
                    <div className="col-md-6" style={{ color: "#3e464d", fontSize: "18px" }}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis lorem ipsum dolor sit amet.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis lorem ipsum dolor sit amet.</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 d-flex flex-column align-items-center">
                <p style={{ color: "#3e464d", fontWeight: "500", fontSize: "20px" }}>Bu makaleyi paylaş:</p>
                <SocialMedia/>
            </div>
        </div>
    );
}

export default Blog;