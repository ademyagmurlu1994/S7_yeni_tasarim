import { useEffect } from "react";
import { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "/components/form/Button";

//images

const SSS = () => {
  const [state, setState] = useState({
    faqs: [
      {
        q: "Kasko araç bedeli nasıl belirlenir?",
        a: "Araç rayiç değeri her ay Türkiye Sigorta ve Reasürans Şirketler Birliği tarafından yayınlanan Kasko Araç Değer Listesi baz alınarak belirlenmektedir.",
      },
      {
        q: "Kasko sigortası ne zaman devreye girer?",
        a: "<ul style='margin-left:20px'><li>Aracın karayollarında kullanılan motorlu veya ******** taşıtlarla çarpışmasında,</li><li>Hareket halindeyken sigortalının ya da aracı kullananın iradesi dışında arca sabit veya hareketli bir cismin çarpması veya aracın böyle bir cisme çarpması,devrilmesi, düşmesi, yuvarlanmasında,</li><li>Üçüncü kişilerin kötü niyetle yaptıkları hareketlerde,</li><li>Aracın yanmasında,</li><li>Aracın veya araç parçalarının çalınması veya çalınmaya teşebbüs edilmesi durumlarında kasko sigortası devreye girer.</li></ul><p>Bunların yanı sıra kaskonun teminat kapsamına sel ve su baskınları, deprem, terörist eylemler **** ek teminatlar da eklenebilir.</p>",
      },
      {
        q: "Kasko sigortasına araç aksesuarları dahil midir?",
        a: "Kasko sigortası poliçeleri aracın fabrika çıkışında hangi özelliklere sahipse onu teminat altına alır, araca sonradan ilave edilen aksesuarlar (elektronik cihaz, ek aparat vb.) poliçe düzenleme aşamasında sigortacıya bildirilerek teminat altına alınabilir.",
      },
      {
        q: "Aracın anahtarının evden çalınması durumunda kasko sigortası devreye girer mi? ",
        a: "Araç anahtarının gasp, hırsızlık veya zorlama sonucu çalınması durumlarında kasko sigortasının çalınma teminatı kapsamında değerlendirilir ancak araç anahtarı üzerinde iken aracın çalınması söz konusu olursa teminat dışıdır.",
      },
      {
        q: "Kasko poliçesindeki hasarsızlık indirim hakkı araç satılıp yenisi alındığında da devam eder mi?",
        a: "Yeni araç satın alındığında zeyilname ile yeni aracın poliçeye dahil edilmesi halinde hasarsızlık indirimi devam eder. İki araç arasında prim farkı var ise fark zeyilnamesi düzenlenir.",
      },
      {
        q: "Anlaşmalı ve anlaşmasız servislerin farkı nedir?",
        a: "<div class='w-100'>Anlaşmalı servisler sigorta şirketlerinin belirli sözleşme çerçevesinde cari olarak çalışmış olduğu servislerdir. Aracın anlaşmalı serviste onarım görmesi durumunda araç sahibinden herhangi bir ödeme alınmaksızın aracın onarımı tamamlanmaktadır.</div><div class='w-100 mt-3'>Anlaşmasız servisler ise sigorta şirketleri ile herhangi bir sözleşme olmayan servislerdir. Aracın onarımı bu servislerden birinde yapılırsa araç sahibi hasarın bedelini servise öder ve karşılığında aldığı faturayı ibraz ederek sigorta şirketinden ödeme talep eder. </div>",
      },
      {
        q: "Kasko poliçesindeki “ihtiyari mali sorumluluk” limiti nedir?",
        a: "İhtiyari mali sorumluluk limiti, motorlu aracın işletilmesi sırasında üçüncü şahıslara verilen zararın, trafik sigortası limitlerinin üstünde kalan kısmını poliçede belirtilen limitler dahilinde karşılar. ",
      },
    ],
  });
  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <>
      <section className="home-page-section mb-4">
        <div className="container">
          <h2 className="section-title">En Çok Sorulan 7 Soru</h2>
          <div className="w-100">
            {state.faqs.map((item, index) => {
              return (
                <>
                  <Accordion
                    key={index}
                    expanded={expanded === "panel" + index}
                    onChange={handleChange("panel" + index)}
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
                </>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default SSS;
