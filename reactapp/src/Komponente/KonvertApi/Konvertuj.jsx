import React, { useState } from 'react';
import axios from 'axios';
import './Konvertuj.css';

const Konvertuj = () => {
  const [file, setFile] = useState(null); // State za čuvanje fajla koji korisnik uploaduje
  const [errorMessage, setErrorMessage] = useState(''); // State za prikazivanje greške
  const [loading, setLoading] = useState(false); // State za praćenje statusa učitavanja (loading)
  const [downloadLink, setDownloadLink] = useState(null); // State za čuvanje linka za preuzimanje konvertovanog fajla

  // Funkcija koja se poziva kada korisnik klikne na dugme "Convert to PDF"
  const convertFile = async () => {
    // Provera da li je fajl uploadovan
    if (!file) {
      setErrorMessage('Molimo vas da uploadujete .docx fajl.'); // Postavljanje poruke greške
      return;
    }

    setLoading(true); // Postavljanje stanja loading na true dok traje konverzija
    setErrorMessage(''); // Resetovanje poruke greške
    setDownloadLink(null); // Resetovanje linka za preuzimanje

    try {
      const formData = new FormData(); // Kreiranje novog FormData objekta za slanje fajla
      formData.append('File', file); // Dodavanje fajla u formData

      // Slanje POST zahteva na API za konverziju
      const response = await axios.post(
        'https://v2.convertapi.com/convert/docx/to/pdf',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            Secret: 'secret_kYrQYS4gjBB80lv1', // API ključ za autentifikaciju
          },
        }
      );

      const result = response.data; // Dobijanje rezultata iz odgovora API-ja

      // Provera da li je konverzija uspešna i da li postoji fajl u odgovoru
      if (result && result.Files && result.Files.length > 0) {
        const fileData = result.Files[0].FileData; // Enkodirani podaci fajla u Base64 formatu
        const byteCharacters = atob(fileData); // Dekodiranje Base64 podataka u binarne podatke
        const byteNumbers = new Array(byteCharacters.length); // Kreiranje niza brojeva za čuvanje binarnih podataka

        // Pretvaranje binarnih podataka u niz bajtova
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers); // Kreiranje Uint8Array iz niza bajtova
        const blob = new Blob([byteArray], { type: 'application/pdf' }); // Kreiranje Blob objekta sa PDF tipom
        const url = URL.createObjectURL(blob); // Generisanje URL-a za preuzimanje PDF fajla
        setDownloadLink(url); // Postavljanje linka za preuzimanje
      } else {
        setErrorMessage('Konverzija fajla nije uspela.'); // Postavljanje poruke greške ako konverzija nije uspela
      }
    } catch (error) {
      console.error('Greška prilikom konverzije:', error); // Prikazivanje greške u konzoli
      setErrorMessage('Došlo je do greške tokom konverzije. Molimo pokušajte ponovo.'); // Postavljanje poruke greške za korisnika
    } finally {
      setLoading(false); // Resetovanje loading statusa nakon završetka konverzije
    }
  };

  // Funkcija koja se poziva kada korisnik uploaduje fajl
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Postavljanje fajla u state
  };

  return (
    <div className="convert-container">
      <h2>Pretvori DOCX u PDF</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} /> {/* Input za upload .docx fajla */}
      <button onClick={convertFile} disabled={loading}> {/* Dugme za pokretanje konverzije */}
        {loading ? 'Konvertovanje...' : 'Pretvori u PDF'} {/* Prikazivanje teksta dugmeta u zavisnosti od statusa loading */}
      </button>

      {errorMessage && <p className="error-text">{errorMessage}</p>} {/* Prikazivanje poruke greške ako postoji */}
      {downloadLink && (
        <p>
          Konverzija uspešna! <a href={downloadLink} download="converted.pdf">Preuzmi PDF</a> {/* Prikazivanje linka za preuzimanje konvertovanog fajla */}
        </p>
      )}
    </div>
  );
};

export default Konvertuj;
