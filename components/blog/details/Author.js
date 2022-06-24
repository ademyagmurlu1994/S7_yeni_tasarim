import Image from "next/image";
import styles from "../style.module.scss"

function Author() {
    return (
        <div className=" mt-4 d-flex flex-row align-items-center justify-content-start">
            <div>
                <div className={styles.detailImage}></div>
                <Image
                src="/static/img/client4.jpg"
                width={60}
                height={60}
                />
            </div>
            <div className="pl-3">
                <div style={{color: "#3e464d", fontWeight: "600", fontSize: "20px", lineHeight: "35px"}}>Aslı Kolcu</div>
                <div className={styles.detailDate}>
                    <p className="mb-0">30 Mayıs 2022</p>
                    <p className={styles.detailDot}></p>
                    <p className="mb-0">4 dk. okunma</p>
                </div>
            </div>
        </div>
    );
}

export default Author;