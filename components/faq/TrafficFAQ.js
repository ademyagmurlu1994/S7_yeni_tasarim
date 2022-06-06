import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TrafficFAQ = ({ topic }) => {
  const [state, setState] = useState({
    faqs: [
      {
        q: "Trafik ile kasko sigortası arasında ne fark var?",
        a: "Üçüncü şahıslara verilecek zararlar için yaptırılan Trafik Sigortası zorunlu bir sigortadır. Kasko sigortası ise kendi aracınıza gelecek zararları karşılamak üzere isteğe bağlı olarak yaptırılan bir sigorta ürünüdür.",
      },
      {
        q: "Neden trafik sigortası yaptırmalıyım?",
        a: "Trafiğe trafik sigorta yaptırmadan çıkmanın cezası vardır, aracınız trafikten men edileceği gibi aynı zamanda sürücüye de ceza kesilir.",
      },
      {
        q: "Yeni araç aldığımda sahip olduğum trafik sigortası yeni aracım için de geçerli midir? ",
        a: "Yeni alınan araç için yeni poliçe yaptırılmalı, eski araca ait poliçe iptal edilmelidir.",
      },
      {
        q: "Trafik sigortam yurtdışında da geçerli mi?",
        a: "Trafik sigortası Türkiye sınırları içerisinde geçerli olacak şekilde düzenlenir, yurt dışında gidilecek ülke yeşil kart sistemine dahil bir ülke ise yola çıkmadan önce yeşil kart sigortası satın alınmalıdır. ",
      },
      {
        q: "Trafik sigortasını kısa süreli yaptırabilir miyim?",
        a: "Kısa süreli poliçeler sadece aracın geçici plakaya sahip olması ya da yabancı plakalı olması durumlarında düzenlenebilir.",
      },
      {
        q: "Trafik Sigortamı vadesinden sonra yenilersem indirimim kaybolur mu?",
        a: "Vadesinde yenilenmeyen trafik sigortasının hasarsızlık indirimi hakkı kaybolmaz ancak gecikilen her 30 gün için %5 zamlı prim uygulaması yapılır. ",
      },
      {
        q: "Trafik sigortasında araç satıldığında poliçe de el değiştirir mi?",
        a: "Aracını satan kişi mevcut trafik poliçesini iptal ettirmek zorundadır, trafik poliçesi el değiştirmez. Satıştan dolayı iptal edilen poliçenin kalan gün primi araç sahibine iade edilir.",
      },
      {
        q: "Yabancı plakalı araca trafik poliçesi nasıl yapılır?",
        a: "Kişi yabancı ve araç plakası da yabancı ise sigortalının pasaport numarası yeterlidir. Kişinin yabancı ancak araç Türk plakalı ise vergi numarası zorunludur.",
      },
    ],
  });
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    //setExpanded(newExpanded ? panel : false);
  };
  return (
    <>
      {/* Start CascoFAQ */}

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
      {/* End CascoFAQ */}
    </>
  );
};

export default TrafficFAQ;
