import React, { useState } from 'react';
import './FAQ.css';
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Kako mogu da upload-ujem dokumente?",
      answer: "Da biste upload-ovali dokumente, idite na stranicu za upload i izaberite fajl sa vašeg računara. Kliknite na dugme 'Upload' da biste završili proces."
    },
    {
      question: "Kako mogu da pretražujem dokumente?",
      answer: "Možete pretraživati dokumente koristeći pretraživač na glavnoj stranici. Unesite ključne reči i kliknite na dugme 'Pretraži' da biste prikazali rezultate."
    },
    {
      question: "Šta da radim ako ne mogu da pronađem svoj dokument?",
      answer: "Ako ne možete da pronađete dokument, proverite da li ste uneli tačne ključne reči u pretraživač. Takođe, proverite da li je dokument slučajno obrisan ili premešten."
    },
    {
      question: "Koje vrste dokumenata mogu da upload-ujem?",
      answer: "Naša aplikacija podržava različite vrste dokumenata uključujući PDF, Word (.docx), Excel (.xlsx), i slike (.jpg, .png)."
    },
    {
      question: "Kako mogu da obrišem dokument?",
      answer: "Da biste obrisali dokument, pronađite dokument u vašem skladištu, kliknite na dugme 'Obriši' pored dokumenta i potvrdite akciju kada budete upitani."
    },
    {
      question: "Da li postoji limit za veličinu dokumenata?",
      answer: "Da, maksimalna veličina dokumenta koju možete upload-ovati je 50 MB. Ako je vaš dokument veći od toga, razmislite o kompresiji ili deljenju dokumenta na manje delove."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>Često Postavljana Pitanja</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 
              className="faq-question" 
              onClick={() => handleToggle(index)}
              style={{ cursor: 'pointer' }}
            >
              {faq.question}
            </h3>
            {openIndex === index && (
              <p className="faq-answer">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
