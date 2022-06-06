import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const HasarAnindaNeYapilmali = () => {
  return (
    <>
      <section className="" style={{ marginTop: "120px" }}>
        <div className="container animate__animated animate__backInDown">
          <div className="row">
            <div className="col-12 col-lg-10">
              <div>
                <h2>
                  <b>Hasar Anında Ne Yapılmalı ?</b>
                </h2>
                <ul className="ml-4">
                  <li>
                    Aracınız ile bir kazaya karıştıysanız öncelikle kendinizin güven içinde
                    olduğunuzu emin olun, sonrasında aracınızı güvenli bir yere çekebilirsiniz.
                  </li>
                  <li>Kaza tespit tutanağını doldurun. (Online tutanak için tıklayın)</li>
                  <li>Kazaya ait resimler çekin.</li>
                  <li>Sigorta firmanızı arayarak hasar ihbarında bulunun.</li>
                  <li>
                    Aracınızı yetkili bir servise çekip, hasar dökümanlarını servise teslim edin.
                  </li>
                </ul>
              </div>
              <div>
                <h4>
                  <b>Hasar Durumunda Gereken Temel Belgeler</b>
                </h4>
                <ul className="ml-4">
                  <li>Kaza sonrasında hazırlanan kaza tespit tutanağı,</li>
                  <li>Tutanağın olmadığı durumlarda ayrıntılı beyan,</li>
                  <li>Kazaya karışan araçların ruhsat bilgileri,</li>
                  <li>
                    Kazaya karışan araçların sürücülerinin TC Kimlik numaralı ehliyetlerinin
                    fotokopisi ya da TC Kimlik Kartı bilgileri,
                  </li>
                  <li>Poliçenizin fotokopisi, </li>
                  <li>Alkol raporu,</li>
                  <li>Kazada mağdur aracın sahibine ait banka hesap numarası.</li>
                </ul>
              </div>
              <div className="clear-fix"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HasarAnindaNeYapilmali;
