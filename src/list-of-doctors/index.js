const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");

const url = "http://moh-doctors.herokuapp.com";

const fetchListOfDoctors = () => {
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      fs.writeFileSync(
        "./data.csv",
        `DistrictEnglish,District,PHO,Doctor,Sanction`
      );
      $("table tbody tr").each((index, tr) => {
        let newRow = "";
        tr.children.forEach((td, i) => {
          if (td.name === "td") {
            const textData = td.children[0] ? td.children[0].data : "";
            if (newRow === "") {
              fs.writeFileSync("./data.csv", "\n", { flag: "a" });
              newRow += textData;
            } else {
              newRow += "," + textData;
            }
          }
          if (i === tr.children.length - 1) {
            fs.writeFileSync("./data.csv", newRow, { flag: "a" });
            newRow = "";
          }
        });
      });
    }
  });
};

fetchListOfDoctors();
