import Image from "next/image";
import Button from "./Button";
import styles from "./style.module.scss"

function Slider() {
    return (
        <div className={`container mt-5 px-5 pb-5 ${styles.slideImage}`}>
            <div id="carouselExampleIndicators" className="carousel slide row" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row">
                            <div className="col-lg-6">
                                <Image
                                    src="/static/img/blog1.jpg"
                                    width={1000}
                                    height={500}
                                    objectFit="cover"
                                />
                            </div>
                            <div className="col-lg-6">
                                <div className="d-none d-lg-block">
                                    <Button active>Sağlık</Button>
                                </div>
                                <div>
                                    <h4 className={styles.slideTitle}>Aileniz İçin Tamamlayıcı Sağlık Sigortası Yaptırabilir misiniz?</h4>
                                </div>
                                <div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida...</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="carousel-item">
                        <div className="row">
                            <div className="col-lg-6">
                                <Image
                                    src="/static/img/blog1.jpg"
                                    width={1000}
                                    height={500}
                                    objectFit="cover"
                                />
                            </div>
                            <div className="col-lg-6">
                                <div className="d-none d-lg-block">
                                    <Button active>Sağlık</Button>
                                </div>
                                <div>
                                    <h4 className={styles.slideTitle}>Aileniz İçin Tamamlayıcı Sağlık Sigortası Yaptırabilir misiniz?</h4>
                                </div>
                                <div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <ol className={`carousel-indicators d-none d-lg-flex ${styles.rodBody}`}>
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className={styles.rodActive}></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1" className={styles.rod}></li>
                </ol>
            </div>


        </div>
    );
}

export default Slider;