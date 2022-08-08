import React, { useState, useEffect } from "react";
import DocumentScroller from "/components/pop-up/DocumentScroller";
import Link from "next/link";

import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import { logo } from "/resources/images";

const Footer = () => {
  const [state, setState] = useState({
    isMobile: false,
    isShowKVKK: false,
  });

  useEffect(() => {
    window.matchMedia("(min-width: 992px)").matches
      ? setState({ ...state, isMobile: false })
      : setState({ ...state, isMobile: true });
  }, []);

  return (
    <>
      {/* footer section start*/}
      <section id="footer">
        <footer>
          <div className="container container-large">
            <div className="row footer-mobile-top-section">
              <div className="col-6">
                <div className="footer-mobile-top-right-side">
                  <img src={logo} alt="" />
                </div>
              </div>
              <div className="col-6">
                <div className="footer-mobile-top-left-side h-100">
                  <span className="w-100">
                    <i className="fas fa-phone-alt color-main mr-2"></i> 0 850 212 12 12
                  </span>
                  <span className="w-100 mt-4">
                    <i className="fas fa-envelope color-main mr-2"></i> TEKLİF ALIN
                  </span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 col-md-3 col-five-1 footer-column first-column">
                <img className="first-column-item" src="/static/img/logo-light.svg" alt="" />
                <p>Size en uygun sigortayı ve en uygun teklifi bulun</p>
                <div className="communication-info first-column-item">
                  <div className="item-title">İletişim Hattı</div>
                  <span>
                    <PhoneInTalkIcon className="mr-1" /> <b>0 850 212 12 12</b>
                  </span>
                </div>
                <div className="follow-us first-column-item">
                  <div className="item-title">Bizi Takip Edin</div>
                  <ul className="social-platforms">
                    <li>
                      <a href="#">
                        <i class="fab fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* widget_links */}
              </div>
              <div className="col-sm-6 col-md-3 col-five-1 footer-column">
                <div className="widget widget_links">
                  <h3>Kurumsal</h3>
                  <ul>
                    <li>
                      <Link href="/blog">
                        <a>Blog</a>
                      </Link>
                    </li>
                    <li>
                      <a href="/static/documents/footer/KVKK.pdf" download={true}>
                        KVKK Aydınlatma Metni
                      </a>
                    </li>
                    <li>
                      <a href="#">Gizlilik Çerez Politikası </a>
                    </li>
                    <li>
                      <Link href="/footer/anlasmali-sirketler">
                        <a>Anlaşmalı Şirketler</a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-6 col-md-3 col-five-1 footer-column">
                <div className="widget widget_links">
                  <h3>Hızlı Erişim</h3>
                  <ul>
                    <li>
                      <a href="https://www.tsb.org.tr/tr/kasko-deger-listesi" target="_blank">
                        Kasko Değer Listesi
                      </a>
                    </li>
                    <li>
                      <a href="#">Sigorta Şirketleri</a>
                    </li>
                    <li>
                      <a href="#">Gizlilik Politikası</a>
                    </li>
                  </ul>
                </div>
                {/* widget_address */}
              </div>
              <div className="col-sm-6 col-md-3 col-five-1 footer-column">
                <div className="widget widget_links">
                  <h3>Ürünlerimiz</h3>
                  <ul>
                    <li>
                      <Link href="/insurance/casco">
                        <a>Kasko</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/insurance/traffic">
                        <a>Trafik Sigortası</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/insurance/dask">
                        <a>DASK</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/insurance/health/complementary">
                        <a>Tamamlayıcı Sağlık</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/insurance/health/private">
                        <a>Özel Sağlık</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/insurance/health/travel">
                        <a>Seyahat Sağlık</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/insurance/pet">
                        <a>Evcil Hayvan</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/insurance/phone">
                        <a>Mobil Cihaz - Cep Telefonu</a>
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* widget_address */}
              </div>
              <div className="col-sm-6 col-md-3 col-five-1 footer-column">
                <div className="widget widget_links">
                  <h3>Desteklerimiz</h3>
                  <ul>
                    <li>
                      <a href="#">Sıkça Sorulan Sorular</a>
                    </li>
                    <li>
                      <a href="/footer/hasar-aninda-ne-yapilmali">Hasar Anında Ne Yapmalı?</a>
                    </li>
                    <li>
                      <a
                        href="https://www.sbm.org.tr/upload/sbm/dokumanlar/kaza_tespit_tutanagi.pdf"
                        target="_blank"
                      >
                        Kaza Tespit Tutanağı
                      </a>
                    </li>
                    <li>
                      <a href="https://mkt.sbm.org.tr/" target="_blank">
                        Mobil Kaza Tutanağı
                      </a>
                    </li>
                  </ul>
                </div>
                {/* widget_address */}
              </div>
            </div>
          </div>

          {/* container */}
        </footer>
        <div className="container container-large footer-bottom-section">
          © sigorta7.com 2022 - Tüm Hakları Saklıdır.
        </div>

        {/* footer widget */}
      </section>
    </>
  );
};

export default Footer;
