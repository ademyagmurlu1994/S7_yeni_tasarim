import React, { useState, useEffect } from "react";
import DocumentScroller from "/components/pop-up/DocumentScroller";
import Link from "next/link";

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
      <section>
        <footer className="">
          <div className="container">
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
              <div className="footer-column">
                <div className="widget widget_links">
                  <h3>Hakkımızda</h3>
                  <ul>
                    <li>
                      <a href="/footer/sigorta7-nedir">Sigorta 7 nedir?</a>
                    </li>
                    <li>
                      <a href="#">İletişim</a>
                    </li>
                  </ul>
                </div>
                {/* widget_links */}
              </div>
              <div className="footer-column">
                <div className="widget widget_links">
                  <h3>Bilgi Merkezi</h3>
                  <ul>
                    <li>
                      <DocumentScroller
                        id="kvkkDocument"
                        isShow={state.isShowKVKK}
                        documentURL="/static/documents/footer/KVKK.pdf"
                        title="KVKK Aydınlatma Metni"
                      ></DocumentScroller>
                      <a
                        onClick={() => {
                          $("#kvkkDocument").modal("show");
                        }}
                      >
                        KVKK Aydınlatma Metni
                      </a>
                    </li>
                    <li>
                      <a href="#">Gizlilik Çerez Politikası </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-column">
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
              <div className="footer-column">
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
              <div className="footer-column">
                <div className="widget widget_links">
                  <h3>Destek</h3>
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
        <div className="w-100 footer-bottom-section-wrapper">
          <div className="container footer-bottom-section">
            <div className="footer-bottom-left-side h-100">
              <span>
                <i className="fas fa-phone-alt color-main"></i> 0 850 212 12 12
              </span>
              <span className="ml-5">
                <i className="fas fa-envelope color-main"></i> TEKLİF ALIN
              </span>
            </div>

            <div className="footer-bottom-right-side">
              <ul className="social-platforms">
                <li>
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                </li>

                <li>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* footer widget */}
      </section>
    </>
  );
};

export default Footer;
