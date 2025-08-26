export function terminationNoticeTemplate({
  hostName,
  tenantName,
  estateName,
  terminationDate,
  reason,
}: {
  hostName: string;
  tenantName: string;
  estateName: string;
  terminationDate: string;
  reason: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="sr">
    <head>
      <meta charset="UTF-8">
      <title>Otkaz Ugovora o Zakupu</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 40px;
          line-height: 1.6;
          background-color: #f5faf6;
          color: #1e2a38;
        }
        header {
          text-align: center;
          border-bottom: 4px solid #2f5f3f;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        header h1 {
          color: #2f5f3f;
          font-size: 26px;
          margin-bottom: 5px;
        }
        header p {
          font-size: 14px;
          color: #6a7c6a;
        }
        section {
          margin-bottom: 25px;
        }
        h2 {
          font-size: 18px;
          color: #2f5f3f;
          border-bottom: 2px solid #dcefe4;
          padding-bottom: 4px;
          margin-bottom: 8px;
        }
        p {
          margin: 6px 0;
          font-size: 14px;
        }
        .highlight {
          background-color: #dcefe4;
          padding: 3px 6px;
          border-radius: 3px;
        }
        footer {
          margin-top: 50px;
          border-top: 2px solid #dcefe4;
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .signature {
          text-align: center;
          font-size: 14px;
        }
        .signature-line {
          margin-top: 50px;
          border-top: 1px solid #1e2a38;
          width: 200px;
          margin-left: auto;
          margin-right: auto;
          padding-top: 5px;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>OBAVJEŠTENJE O OTKAZIVANJU UGOVORA</h1>
        <p>Zaključenog između Zakupodavca i Zakupca</p>
      </header>

      <section>
        <h2>Učesnici</h2>
        <p><strong>Zakupodavac:</strong> <span class="highlight">${hostName}</span></p>
        <p><strong>Zakupac:</strong> <span class="highlight">${tenantName}</span></p>
      </section>

      <section>
        <h2>Predmet Otkazivanja</h2>
        <p>Ovim dokumentom potvrđuje se otkazivanje Ugovora o zakupu za poslovni prostor <strong>${estateName}</strong>.</p>
        <p>Datum stupanja otkaza na snagu: <strong>${terminationDate}</strong>.</p>
      </section>

      <section>
        <h2>Razlog Otkaza</h2>
        <p><em>${reason}</em></p>
      </section>

      <section>
        <h2>Napomena</h2>
        <p>Izražavamo žaljenje zbog prekida saradnje i zahvaljujemo se na dosadašnjoj korektnoj saradnji.</p>
        <p>Molimo da se sve obaveze do datuma otkaza izmire u skladu sa ugovorenim uslovima.</p>
      </section>

      <footer>
        <div class="signature">
          <div class="signature-line"></div>
          <p>${hostName}</p>
          <p>Zakupodavac</p>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <p>${tenantName}</p>
          <p>Zakupac</p>
        </div>
      </footer>
    </body>
    </html>
  `;
}
