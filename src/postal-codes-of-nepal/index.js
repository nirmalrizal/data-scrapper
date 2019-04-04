const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");

const fetchUrl = "http://www.nepalpost.gov.np/index.php/postal-codes-of-nepal";
const filePath = path.resolve(__dirname, "data.csv");

fs.writeFileSync(
  filePath,
  `"District","Post Office","Postal/Pin Code","Post Office Type"\n`
);

const fetchPostalCodesOfNepal = () => {
  return new Promise((resolve, reject) => {
    request(fetchUrl, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        $(".item-page table tbody tr").each((index, tr) => {
          if (index !== 0) {
            $(tr)
              .children()
              .each((tdIndex, td) => {
                const tdText = $(td).text();
                if (tdIndex === 3) {
                  writeTextInFile(`"${tdText}"\n`);
                } else {
                  writeTextInFile(`"${tdText}",`);
                }
              });
          }
        });
        console.log("Done");
        resolve("success");
      } else {
        reject(error);
      }
    });
  });
};

fetchPostalCodesOfNepal();

function writeTextInFile(text) {
  fs.writeFileSync(filePath, text, { flag: "a" });
}
