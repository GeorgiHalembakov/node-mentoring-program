import csv from "csvtojson";
import fs from "fs";
import { pipeline } from "stream";
const csvFile = `./csv/task1.csv`;

// WRITE ALL AT ONCE

// csv()
//   .fromFile(csvFile)
//   .then((jsonObj) => {
//     fs.writeFile("./text-files/task1.txt", JSON.stringify(jsonObj), (error) => {
//       if (error) throw error;
//       console.log("The file has been saved");
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//PIPELINE METHOD

pipeline(
  fs.createReadStream(csvFile),
  csv(),
  fs.createWriteStream("./text-files/task1.txt"),
  (error) => {
    if (error) throw error;
    console.log("The file has been saved");
  }
);
