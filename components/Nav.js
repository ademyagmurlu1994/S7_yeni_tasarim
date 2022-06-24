import React, { Component, useEffect, useState } from "react";
import Link from "next/link";
//import { Link } from "react-router-dom";
import { logo } from "/resources/images";

const Nav = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top horizontal-nav" id="navbar">
        <div className="container">
          <Link href="/">
            <div className="navbar-brand navbar-brand-mobile">
              <img src={logo} alt="" />
            </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i className="ti-menu icon-align-right" />
            </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav horizontal-menu h-100">
              <div className="navbar-left-side h-100">
                <li className="nav-item">
                  <a href="#">
                    <span>
                      <i className="fas fa-phone-alt color-main"></i> 0 850 212 12 12
                    </span>
                  </a>
                </li>
                <div className="vertical-divider mr-4 ml-4"></div>
                <li className="nav-item">
                  <a href="#">
                    <span>
                      <i className="fas fa-envelope color-main"></i> Teklif Alın
                    </span>
                  </a>
                </li>
              </div>

              <li className="navbar-center-side">
                <Link href="/">
                  <div className="navbar-brand">
                    <img src={logo} alt="" />
                  </div>
                </Link>
              </li>
              <div className="navbar-right-side">
                <div className="auth-links">
                  <li className="nav-item">
                    <li className="scroll dropdown">
                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link href="/insurance/casco/" prefetch={false} className="dropdown-item">
                            Kasko Sigortası
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link href="/insurance/traffic" className="dropdown-item">
                            Zorunlu Trafik Sigortası
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </li>
                  <li className="nav-item scroll dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                      <span>Ürünler</span>
                    </a>
                    <div className="dropdown-menu-wrapper">
                      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <div className="row">
                          <div className="col-12 col-md-6 col-lg-6 mb-4">
                            <div className="similar-service-wrapper">
                              <h3>
                                <i className="fas fa-car"></i> Arabanız
                              </h3>
                              <Link href="/insurance/casco">
                                <a className="dropdown-item">Kasko</a>
                              </Link>
                              <Link href="/insurance/traffic">
                                <a className="dropdown-item"> Trafik</a>
                              </Link>
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-6 mb-4">
                            <div className="similar-service-wrapper">
                              <h3>
                                <i className="fas fa-heartbeat"></i> Sağlığınız
                              </h3>
                              <Link href="/insurance/health/complementary">
                                <a className="dropdown-item">Tamamlayıcı Sağlık</a>
                              </Link>
                              <Link href="/insurance/health/travel">
                                <a className="dropdown-item">Seyahat Sağlık</a>
                              </Link>
                              <Link href="/insurance/health/private">
                                <a className="dropdown-item">Özel Sağlık</a>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-md-6 col-lg-6 mb-4">
                            <div className="similar-service-wrapper">
                              <h3>
                                <i className="fas fa-home"></i> Eviniz
                              </h3>
                              <Link href="/insurance/dask">
                                <a className="dropdown-item">Dask</a>
                              </Link>
                              {/* <Link href="/insurance/traffic">
                                <a className="dropdown-item"> Trafik</a>
                              </Link> */}
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-6 mb-4">
                            <div className="similar-service-wrapper">
                              <h3>
                                <i className="fas fa-ellipsis-h"></i> Diğer Sigortalarınız
                              </h3>
                              <Link href="/insurance/pet">
                                <a className="dropdown-item">Evcil Hayvan</a>
                              </Link>
                              <Link href="/insurance/phone">
                                <a className="dropdown-item">Cep Telefonu</a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>

                  <div className="vertical-divider mr-lg-3 ml-lg-3  mr-md-1 ml-md-1 h-60"></div>
                  <li className="nav-item">
                    <Link href="/register">Üye Ol</Link>
                  </li>
                  <div className="vertical-divider mr-lg-3 ml-lg-3 mr-md-1 ml-md-1  h-60"></div>
                  <li className="nav-item">
                    <Link href="/login">Hesabım</Link>
                  </li>
                </div>

                {/* <li>
                  <ul className="social-platforms">
                    <li className="nav-item">
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="#">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </li>

                    <li className="nav-item">
                      <a href="#">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                  </ul>
                </li> */}
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
