export function businessContractTemplate({
  hostName,
  tenantName,
  estateName,
  checkIn,
  checkOut,
  pricePerMonth,
}: {
  hostName: string;
  tenantName: string;
  estateName: string;
  checkIn: string;
  checkOut: string;
  pricePerMonth: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="sr">
    <head>
      <meta charset="UTF-8">
      <title>Ugovor o Zakupu</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 40px;
          line-height: 1.6;
          background-color: #f7f9fc;
          color: #1e2a38;
        }
        header {
          text-align: center;
          border-bottom: 4px solid #2a3f54;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        header h1 {
          color: #2a3f54;
          font-size: 26px;
          margin-bottom: 5px;
        }
        header p {
          font-size: 14px;
          color: #7d8b99;
        }
        section {
          margin-bottom: 25px;
        }
        h2 {
          font-size: 18px;
          color: #2a3f54;
          border-bottom: 2px solid #e0e6ed;
          padding-bottom: 4px;
          margin-bottom: 8px;
        }
        p {
          margin: 6px 0;
          font-size: 14px;
        }
        .highlight {
          background-color: #e6eff6;
          padding: 3px 6px;
          border-radius: 3px;
        }
        footer {
          margin-top: 50px;
          border-top: 2px solid #e0e6ed;
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
        <h1>UGOVOR O ZAKUPU POSLOVNOG PROSTORA</h1>
        <p>Zaključen između Zakupodavca i Zakupca</p>
      </header>

      <section>
        <h2>Učesnici</h2>
        <p><strong>Zakupodavac:</strong> <span class="highlight">${hostName}</span></p>
        <p><strong>Zakupac:</strong> <span class="highlight">${tenantName}</span></p>
      </section>

      <section>
        <h2>Predmet Ugovora</h2>
        <p>Zakupodavac daje u zakup poslovni prostor <strong>${estateName}</strong> za period od <strong>${checkIn}</strong> do <strong>${checkOut}</strong>.</p>
      </section>

      <section>
        <h2>Finansijski Uslovi</h2>
        <p>Iznos zakupnine iznosi <strong>${pricePerMonth}</strong> mjesečno.</p>
        <p>Zakupac se obavezuje da plaća zakupninu unaprijed, najkasnije do 5. dana u mjesecu.</p>
      </section>

      <section>
        <h2>Ostale Odredbe</h2>
        <p>Zakupac se obavezuje da koristi prostor u skladu sa zakonskim propisima i namjenom.</p>
        <p>Bilo kakve preinake u prostoru mogu se vršiti samo uz pismenu saglasnost Zakupodavca.</p>
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
