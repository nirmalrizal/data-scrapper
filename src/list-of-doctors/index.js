const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");

const url = "http://moh-doctors.herokuapp.com";
const filePath = path.resolve(__dirname + "/data.csv");

const fetchListOfDoctors = () => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        fs.writeFileSync(
          filePath,
          `DistrictEnglish,District,PHO,Doctor,Sanction`
        );
        $("table tbody tr").each((index, tr) => {
          let newRow = "";
          tr.children.forEach((td, i) => {
            if (td.name === "td") {
              const textData = td.children[0]
                ? `"${td.children[0].data}"`
                : `""`;
              if (newRow === "") {
                fs.writeFileSync(filePath, "\n", { flag: "a" });
                newRow += textData;
              } else {
                newRow += "," + textData;
              }
            }
            if (i === tr.children.length - 1) {
              fs.writeFileSync(filePath, newRow, { flag: "a" });
              newRow = "";
            }
          });
        });
        resolve("success");
      } else {
        reject(error);
      }
    });
  });
};

module.exports = fetchListOfDoctors;
