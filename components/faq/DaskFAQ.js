import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DaskFAQ = ({ topic }) => {
  const [state, setState] = useState({
    faqs: [
      {
        q: "DASK Hangi Hasarları Ne Kadar Karşılar?",
        a: "<p>DASK, depremin verdiği maddi zararlarda, oluşan hasarın %2’sine kadar olantutarı değil, üzerini karşılar. Yani ilgili konutun bedeli 100 bin TL olarak belirlenmişse konutta 2 bin liraya kadar olan hasarı sigortalı öder. Üzerindeki zararı ise DASK karşılar. <br /><br />DASK yaptırdığınızda binanın farklı bölümleri ayrı ayrı teminat altına alınır. Bu bölümleri aşağıda görebilirsiniz:<br /><br />● Temeller<br />● Ana duvarlar<br />● Bağımsız bölümleri ayıran ortak duvarlar<br />● Bahçe duvarları<br />● İstinat duvarları<br />● Tavan ve tabanlar<br />● Merdivenler<br />● Asansörler<br />● Sahanlıklar<br />● Koridorlar<● Çatılar<br />● Bacalar<br />● Yapının yukarıdakilerle benzer nitelikteki tamamlayıcı bölümleri<br /><br />Zorunlu Deprem Sigortası, sadece deprem sonucu meskenin gördüğü zararı karşılar. Evin içindeki eşyalar buna dâhil değildir. Eşyalarınızı korumak için<a href='/konut-sigortasi' target='_blank'> konut sigortası </a> yaptırabilirsiniz.</p>",
      },
      {
        q: "DASK Kimin Adına Yaptırılır?",
        a: "DASK Zorunlu Deprem Sigortası, ev sahibi ya da kiracı tarafından yapılabilse de her iki durumda da poliçe sadece ev sahibi adına düzenlenebilir.",
      },
      {
        q: "DASK Yaptırmak İçin Gerekli Belgeler Neler?",
        a: "<p> DASK yaptırmak için gerekli belgeler aşağıdaki gibidir: <br /> <br /> ● Sigorta sahibinin kimlik bilgileri <br /> ● Sigorta sahibinin iletişim bilgileri <br /> ● Sigortalanmak istenen yerin adresi <br /> ● Tapu bilgileri <br /> ● Sigortalanmak istenen binanın inşa yılı ve yapı tarzı <br /> ● Bina kat sayısı <br /> ● Binanın hasar durumu <br /> ● Meskenin brüt yüz ölçümü <br /> ● Binanın kullanım şekli <br /> <br /> Bu konuda detaylı bilgiye ' <a href='/dask-basvurusu-icin-gereken-belgeler' target='_blank'> DASK Başvurusu İçin Gereken Belgeler </a> ' yazımızdan ulaşabilirsiniz. </p>",
      },
      {
        q: "Zorunlu Deprem Sigortası Hangi Binalara Yaptırılmaz?",
        a: "<p> Zorunlu Deprem Sigortası; <br /> <br /> ● Kamu kurum ve kuruluşlarına ait, <br /> ● Köy yerleşim alanlarında yapılan, <br /> ● Tamamı ticari ve sınai amaçlar için kullanılan (İş hanı, iş merkezi, idari hizmet, eğitim merkezi vs.), <br /> ● İnşaatı henüz tamamlanmamış olan, <br /> ● Tapuya kayıtlı olmayan ve özel mülkiyete tâbi olmayan arazi ve arsaların (hazine arazileri vb.) üzerine inşa edilmiş, <br />● Mesken olarak kullanıma uygun olmayan, bakımsız, harap veya metruk binalara yapılmaz. </p>",
      },
      {
        q: "DASK Geçerlilik Süresi Ne Kadar?",
        a: "DASK Zorunlu Deprem Sigortası’nın geçerlilik süresi 1 yıldır. Sigorta sözleşmesinin her yıl poliçe süresi dolmadan yenilenmesi gerekir.",
      },
    ],
  });
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    //setExpanded(newExpanded ? panel : false);//
  };

  return (
    <>
      {/* Start DaskFAQ */}

      <section>
        <div className="row">
          <div className="col-12">
            <h3 className="mb-4">
              <b>{topic} HAKKINDA SIK SORULAN SORULAR</b>
            </h3>
            {state.faqs.map((item, index) => {
              return (
                <Accordion
                  key={index}
                  //expanded={expanded === "panel" + index}
                  //onChange={handleChange("panel" + index)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <div
                        className="text-muted mb-0"
                        dangerouslySetInnerHTML={{ __html: item.a }}
                      ></div>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        </div>
      </section>
      {/* End DaskFAQ */}
    </>
  );
};

export default DaskFAQ;
