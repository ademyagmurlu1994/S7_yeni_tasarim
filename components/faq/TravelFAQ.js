import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TravelFAQ = ({ topic }) => {
  const [state, setState] = useState({
    faqs: [
      {
        q: "Seyahat Sağlık Sigortası Nedir?",
        a: "<div><div class='w-100'>Yurt içi ve yurt dışı seyahatlerinizde başınıza gelebilecek hastalık, ani kaza ve yaralanma gibi risklere karşı teminat sağlayan bir sigortadır. </div><div class='w-100 mt-3'>Yurt dışı seyahat sigortası, Avrupa ülkelerine vize başvuru evrakları arasında yer aldığından “Vize Sigortası” olarak da adlandırılır.</div></div>",
      },
      {
        q: "Seyahat Sağlık Sigortası Neleri Kapsar?",
        a: "<div class='w-100'>Seyahat Sağlık Sigortası’nın teminat kapsamı  aşağıdakilerle sınırlı olmamak üzere  şu şekildedir ;</div><ul class='ml-4'><li>Ölüm,</li> <li>Sürekli sakatlık,</li><li>Ferdi kaza,</li><li>Kapkaç,</li><li>Bagaj kaybı ve zarar görmesi, çalınması,</li><li>Bagajın bulunması durumunda sigortalıya ulaştırılması,</li><li>Vefat eden sigortalının ülkesine nakli,</li><li>Tıbbi bilgi ve danışmanlık,</li><li>Yaralanma, hastalık veya taburculuk durumunda sigortalının nakli veya geri dönüşü,</li><li>Yaralanma veya ani hastalık nedeniyle konaklama süresinin uzatılması,</li><li>Yaralanma ve ani hastalık nedeniyle yurt dışında tıbbi tedavi,</li><li>Sigortalıya yapılacak tedavi nedeniyle aile üyelerinden birinin seyahati</li><li>Sigortalıya yapılacak tedavi nedeniyle aile üyelerinden birinin konaklaması</li><li>Hukuki bilgilendirme</li></ul>",
      },
      {
        q: "Seyahat Sağlık Sigortası Kaç Günlük Olmalı?",
        a: "Düzenlenecek olan poliçe seyahat edilecek süreyi (gidiş tarihinden dönüş tarihine kadar olan süre) kapsamalıdır. Düzenlenecek olan seyahat sağlık sigortaları, en fazla birbirini izleyen 90 gün süren seyahatler için geçerlidir.",
      },
      {
        q: "Seyahat Sigortası Teminat Limiti Ne Kadar?",
        a: "Özel bir limit talep edilmediği sürece standart seyahat sağlık sigortalarının limiti  30.000 EUR’dur.",
      },
      {
        q: "Seyahat Esnasında Herhangi Bir Kaza Durumunda Ne Yapmalıyım?",
        a: "Seyahat esnasında herhangi bir kazanın meydana gelmesi durumunda poliçeyi düzenleyen sigorta şirketinin poliçesinin üzerinde yazan asistans firmanın numarası aranarak kaza bildiriminde bulunulmalıdır.",
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

export default TravelFAQ;
