import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TopicSharp } from "@mui/icons-material";

const ComplementaryFAQ = ({ topic }) => {
  const [state, setState] = useState({
    faqs: [
      {
        q: "Tamamlayıcı Sağlık Sigortası (TSS) Nedir?",
        a: "Tamamlayıcı Sağlık Sigortası (Destekleyici Sağlık Sigortası), sağlık güvencesi olan bireylerin Sosyal Güvenlik Kurumu (SGK) ile anlaşmalı özel sağlık kuruluşlarında sadece katılım payı ödeyerek tedavi olmalarını sağlayan özel sağlık sigortasıdır. ",
      },
      {
        q: "Tamamlayıcı Sağlık Sigortası Neleri Kapsar?",
        a: "Tamamlayıcı sağlık sigortası poliçe limitleri dâhilinde ; yatarak tedavi (ameliyat, günübirlik tedaviler), suni uzuv, tıbbi malzeme, evde bakım ve ambulans masraflarını karşılar. Sınırlı olmak (poliçe üzerinde belirtilir) koşuluyla ayakta tedavi ve belirli şartlar ile bekleme süresi bulunması kaydıyla doğum teminatları da poliçeye eklenebilir.",
      },
      {
        q: "TSS Ayakta Tedavi Teminatı Nedir?",
        a: "Ayakta tedavi teminatı, doktor muayene, radyoloji, tahlil, fizik tedavi gibi yatış gerektirmeyecek teminatları, poliçe limit ve şartları dâhilinde kapsayan teminattır. ",
      },
      {
        q: "TSS Yatarak Tedavi Teminatı Nedir?",
        a: "Yatarak tedavi teminatı, sigortalının acil müdaheleler ve cerrahi yatışlar dâhil tüm yatarak tedavi gerektiren risklerini, poliçe limit ve şartları dâhilinde güvence altına alan bir teminattır.",
      },
      {
        q: "Tamamlayıcı Sağlık Sigortası Tüm Hastanelerde Geçerli mi?",
        a: "Tamamlayıcı Sağlık Sigortası, Sigorta Şirketinin sözleşmeli olduğu hastane ya da doktorun SGK ile anlaşması olduğu tüm hastanelerde geçerlidir. Anlaşmalı hastaneleri listesini sigorta şirketinizden talep edebilirsiniz",
      },
      {
        q: "Tamamlayıcı Sağlık Sigortası Yurt Dışında Geçerli mi?",
        a: "Hayır, tamamlayıcı sağlık sigortası yurt dışında geçerli değildir. Yurt dışında sağlık sigortası için seyahat sigortası satın almalısınız.",
      },
      {
        q: "Tamamlayıcı Sağlık ve Özel Sağlık Sigortası Arasındaki Farklar Nelerdir?",
        a: "<ul style='margin-left:20px'><li>TSS sadece SGK’nın anlaşmalı olduğu hastanelerde geçerlidir, Özel Sağlık Sigortasıise poliçenizi satın alırken seçtiğiniz hastane gruplarında geçerlidir.</li><li>TSS poliçesi satın almak için SGK’lı olmak gerekirken Özel Sağlık Sigortasını herkesyaptırabilir.</li><li>TSS’de 15 TL katılım ücreti ödemek gerekirken Özel Sağlık Sigortasının katılım payı(oranı) poliçe satın alımı esnasında sigortalı tarafından isteğine bağlı olarak belirlenir.</li></ul>",
      },
      {
        q: "Doğum ve Hamilelik Giderleri Tamamlayıcı Sağlık Sigortası Kapsamında mı?",
        a: "Doğum teminatı, Tamamlayıcı Sağlık Sigortası poliçesine belirli şart ve limitlerle ekletilebilir. Sigorta Şirketi poliçeye belirli bir süre bekleme şartı da koyabilir. ",
      },
      {
        q: "TSS Geçmişten Gelen Hastalıkların Tedavi Masraflarını Öder mi?",
        a: "Hayır ödemez, poliçe başlangıcından önce olan her türlü sağlık gideri sağlık gideri teminat kapsamı dışındadır.",
      },
      {
        q: "Emekliler Tamamlayıcı Sağlık Sigortasından Yararlanabilir mi?",
        a: "SGK’lı olan (Çalışan ya da emekli olarak ayırmaksızın) sigorta şirketinin belirlediği yaş sınırının altında kalan herkes Tamamlayıcı Sağlık Sigortasından faydalanabilir.",
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

      <section className="">
        <div className="row">
          <div className="col-12 mui-accordion-faq">
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

export default ComplementaryFAQ;
