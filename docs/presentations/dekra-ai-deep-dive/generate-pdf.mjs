import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generatePDF(lang = "de") {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const htmlPath = path.join(__dirname, `${lang}.html`);
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

  await page.pdf({
    path: path.join(__dirname, `${lang}.pdf`),
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log(`Generated ${lang}.pdf`);
}

const lang = process.argv[2] || "de";
generatePDF(lang);
