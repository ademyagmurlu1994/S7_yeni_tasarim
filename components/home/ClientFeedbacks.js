import { useState } from "react";
/*import "../assets/scss/_sections.scss";
import "../assets/scss/_blog.scss";*/
import Marquee from "react-fast-marquee";
import Slider from "react-slick";

import {
  client1,
  client2,
  client3,
  client4,
  client5,
  client6,
  client7,
  client8,
  ClientFeedbackIcon,
} from "/resources/images";

const ClientFeedbacks = () => {
  const [blogList] = useState([
    {
      title: "We design platform for all global customers",
      intro:
        "Zor zamanımda, sıkıntılı süreçte yaşadığım tüm olumsuzları 1 saatte çözen Sigorta7 ailesine sonsuz teşekkürlerimi sunuyorum.",
      date: "Sep 2018",
      author: {
        name: "Hasan DORUK",
        image: client1,
      },
      rating: 4,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "Merhaba,19.06.2021 tarihinde yaşamış olduğum trafik kazası sonrasında hızlı ve yapıcı çözümleri ile sürecin her anında bana destek olan, sürekli irtibat halinde olduğumuz, başta Filiz Hanım olmak üzere tüm sigorta7 personeline kıymetli destekleri ve gayretleri için çok teşekkür ederim.",
      date: "Sep 2018",
      author: {
        name: "Dilara YILMAZ",
        image: client2,
      },
      rating: 5,
    },
    {
      author: {
        name: "Batuhan YENİGÜL",
        image: client3,
      },
      title: "We design platform for all global customers",
      intro:
        "2 yıldır kasko ve trafik poliçelerimi sigorta7 aracılığıyla alıyorum. En uygun fiyatı almakla birlikte hasar anında 7/24 telefon ve mail ile dönüş yapan, süreci adım adım takip eden ve sizi sürekli bilgilendiren güler yüzlü yetkililer ile çalışmak gerçekten insana kendini özel hissettiriyor.",
      date: "Sep 2019",
      rating: 4,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "Kaza yaptığımda suç bende olmasa da o karışık ortama rağmen ilk endişem karşı arabada bir yaralanmanın olup olmadığıydı. Olmadığını gördüğümde de çok sevdiğim arabamın durumuna baktım ve ilk aklıma gelen şey sigortam ne durumdaydı? Kaskomu internetten Sigorta7'den almıştım. Ne kadar fonksiyonel olacak, çalışmıyorsa ne yaparım gibi endişelerim vardı. ",
      date: "Sep 2019",
      author: {
        name: "Tarık YÜKSELEN",
        image: client8,
      },
      rating: 5,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "İyi ki Sigorta7’ten yaptırmışım kaskomu. Sigorta7 personeli çok ilgili ve işlerini profesyonelce yapıyorlar. 18.11.2017 tarihinde kaza yaptım. Aracımın ağır hasarlı olduğunu öğrendiğim andan itibaren arkadaşlarım keşke kaskonu internet yerine belirli bir acenteden yaptırsaydın diye serzenişte bulundular.",
      date: "Sep 2018",
      author: {
        name: "Dilara YILMAZ",
        image: client2,
      },
      rating: 5,
    },
    {
      author: {
        name: "Batuhan YENİGÜL",
        image: client3,
      },
      title: "We design platform for all global customers",
      intro:
        "İnternetten kasko poliçesi alıp almamak konusunda şüphelerim vardı. Daha önce zorunlu trafik sigortası yaptırdığım Sigorta7' den çok güzel fiyat teklifleri almıştım ve bunu değerlendirmek istedim. Poliçemi yaptırdıktan 7 ay sonra aracımla bir trafik kazası yaptım. Kaza yaptığım andan sonuca varana kadar Sigortam.net gerçekten her konuda yardımcı oldu. Bu süreçte sürekli yanımda hissettim.",
      date: "Sep 2019",
      rating: 4,
    },
    {
      title: "We design platform for all global customers",
      intro:
        "Zor zamanımda, sıkıntılı süreçte yaşadığım tüm olumsuzları 1 saatte çözen Sigorta7 ailesine sonsuz teşekkürlerimi sunuyorum.",
      date: "Sep 2018",
      author: {
        name: "Hasan DORUK",
        image: client1,
      },
      rating: 4,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "Merhaba,19.06.2021 tarihinde yaşamış olduğum trafik kazası sonrasında hızlı ve yapıcı çözümleri ile sürecin her anında bana destek olan, sürekli irtibat halinde olduğumuz, başta Filiz Hanım olmak üzere tüm sigorta7 personeline kıymetli destekleri ve gayretleri için çok teşekkür ederim.",
      date: "Sep 2018",
      author: {
        name: "Dilara YILMAZ",
        image: client2,
      },
      rating: 5,
    },
    {
      author: {
        name: "Batuhan YENİGÜL",
        image: client3,
      },
      title: "We design platform for all global customers",
      intro:
        "2 yıldır kasko ve trafik poliçelerimi sigorta7 aracılığıyla alıyorum. En uygun fiyatı almakla birlikte hasar anında 7/24 telefon ve mail ile dönüş yapan, süreci adım adım takip eden ve sizi sürekli bilgilendiren güler yüzlü yetkililer ile çalışmak gerçekten insana kendini özel hissettiriyor.",
      date: "Sep 2019",
      rating: 4,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "Kaza yaptığımda suç bende olmasa da o karışık ortama rağmen ilk endişem karşı arabada bir yaralanmanın olup olmadığıydı. Olmadığını gördüğümde de çok sevdiğim arabamın durumuna baktım ve ilk aklıma gelen şey sigortam ne durumdaydı? Kaskomu internetten Sigorta7'den almıştım. Ne kadar fonksiyonel olacak, çalışmıyorsa ne yaparım gibi endişelerim vardı. ",
      date: "Sep 2019",
      author: {
        name: "Tarık YÜKSELEN",
        image: client8,
      },
      rating: 5,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "İyi ki Sigorta7’ten yaptırmışım kaskomu. Sigorta7 personeli çok ilgili ve işlerini profesyonelce yapıyorlar. 18.11.2017 tarihinde kaza yaptım. Aracımın ağır hasarlı olduğunu öğrendiğim andan itibaren arkadaşlarım keşke kaskonu internet yerine belirli bir acenteden yaptırsaydın diye serzenişte bulundular.",
      date: "Sep 2018",
      author: {
        name: "Dilara YILMAZ",
        image: client2,
      },
      rating: 5,
    },
    {
      author: {
        name: "Batuhan YENİGÜL",
        image: client3,
      },
      title: "We design platform for all global customers",
      intro:
        "İnternetten kasko poliçesi alıp almamak konusunda şüphelerim vardı. Daha önce zorunlu trafik sigortası yaptırdığım Sigorta7' den çok güzel fiyat teklifleri almıştım ve bunu değerlendirmek istedim. Poliçemi yaptırdıktan 7 ay sonra aracımla bir trafik kazası yaptım. Kaza yaptığım andan sonuca varana kadar Sigortam.net gerçekten her konuda yardımcı oldu. Bu süreçte sürekli yanımda hissettim.",
      date: "Sep 2019",
      rating: 4,
    },
    {
      title: "We design platform for all global customers",
      intro:
        "Zor zamanımda, sıkıntılı süreçte yaşadığım tüm olumsuzları 1 saatte çözen Sigorta7 ailesine sonsuz teşekkürlerimi sunuyorum.",
      date: "Sep 2018",
      author: {
        name: "Hasan DORUK",
        image: client1,
      },
      rating: 4,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "Merhaba,19.06.2021 tarihinde yaşamış olduğum trafik kazası sonrasında hızlı ve yapıcı çözümleri ile sürecin her anında bana destek olan, sürekli irtibat halinde olduğumuz, başta Filiz Hanım olmak üzere tüm sigorta7 personeline kıymetli destekleri ve gayretleri için çok teşekkür ederim.",
      date: "Sep 2018",
      author: {
        name: "Dilara YILMAZ",
        image: client2,
      },
      rating: 5,
    },
    {
      author: {
        name: "Batuhan YENİGÜL",
        image: client3,
      },
      title: "We design platform for all global customers",
      intro:
        "2 yıldır kasko ve trafik poliçelerimi sigorta7 aracılığıyla alıyorum. En uygun fiyatı almakla birlikte hasar anında 7/24 telefon ve mail ile dönüş yapan, süreci adım adım takip eden ve sizi sürekli bilgilendiren güler yüzlü yetkililer ile çalışmak gerçekten insana kendini özel hissettiriyor.",
      date: "Sep 2019",
      rating: 4,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "Kaza yaptığımda suç bende olmasa da o karışık ortama rağmen ilk endişem karşı arabada bir yaralanmanın olup olmadığıydı. Olmadığını gördüğümde de çok sevdiğim arabamın durumuna baktım ve ilk aklıma gelen şey sigortam ne durumdaydı? Kaskomu internetten Sigorta7'den almıştım. Ne kadar fonksiyonel olacak, çalışmıyorsa ne yaparım gibi endişelerim vardı. ",
      date: "Sep 2019",
      author: {
        name: "Tarık YÜKSELEN",
        image: client8,
      },
      rating: 5,
    },
    {
      title: "Far far away,behind the word mountains, far from",
      intro:
        "İyi ki Sigorta7’ten yaptırmışım kaskomu. Sigorta7 personeli çok ilgili ve işlerini profesyonelce yapıyorlar. 18.11.2017 tarihinde kaza yaptım. Aracımın ağır hasarlı olduğunu öğrendiğim andan itibaren arkadaşlarım keşke kaskonu internet yerine belirli bir acenteden yaptırsaydın diye serzenişte bulundular.",
      date: "Sep 2018",
      author: {
        name: "Dilara YILMAZ",
        image: client2,
      },
      rating: 5,
    },
    {
      author: {
        name: "Batuhan YENİGÜL",
        image: client3,
      },
      title: "We design platform for all global customers",
      intro:
        "İnternetten kasko poliçesi alıp almamak konusunda şüphelerim vardı. Daha önce zorunlu trafik sigortası yaptırdığım Sigorta7' den çok güzel fiyat teklifleri almıştım ve bunu değerlendirmek istedim. Poliçemi yaptırdıktan 7 ay sonra aracımla bir trafik kazası yaptım. Kaza yaptığım andan sonuca varana kadar Sigortam.net gerçekten her konuda yardımcı oldu. Bu süreçte sürekli yanımda hissettim.",
      date: "Sep 2019",
      rating: 4,
    },
  ]);

  var settings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 700,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <section className="client-feedback-section home-page-section">
        <div className="container container-large">
          <h2 className="section-title">Müşteri Memnuniyeti</h2>
          <div className="w-100">
            <div className="client-feedbacks-wrapper">
              <Slider {...settings}>
                {blogList.map((feedback, index) => (
                  <div className="fw-carousel-review" key={index}>
                    <div className="feedback-card ml-2 mr-2">
                      <div className="feedback-author">
                        <div className="author-wrapper">
                          <img src={feedback.author.image} alt="" />
                          <h4 className="feedback-author-name">{feedback.author.name}</h4>
                        </div>
                      </div>

                      <div className="feedback-text">
                        {feedback.intro.length < 130
                          ? feedback.intro
                          : feedback.intro.substring(0, 130) + "..."}{" "}
                      </div>
                      <div className="feedback-rating">
                        <div className="small-ratings" style={{ width: "100%", display: "" }}>
                          {Array.from(Array(feedback.rating), (e, i) => {
                            return <i className="fa fa-star" key={i}></i>;
                          })}
                          {Array.from(Array(5 - feedback.rating), (e, i) => {
                            return <i className="far fa-star" key={i}></i>;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClientFeedbacks;
