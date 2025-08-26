// services/contractPdf.service.ts
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export async function generateContractPDF(
  htmlContent: string,
  fileName: string
) {
  const contractsDir = path.join(__dirname, "../../../uploads/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true, // koristi headless mod
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const filePath = path.join(contractsDir, fileName);
  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return `/contracts/${fileName}`; // URL za klijenta
}
