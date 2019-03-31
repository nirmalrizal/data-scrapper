const readline = require("readline");
const ora = require("ora");

const blank = "\n".repeat(process.stdout.rows);

/* Options */
const fetchListOfDoctors = require("./src/list-of-doctors");

const readMove = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const scrapOptions = {
  1: {
    key: 1,
    title: "List of Doctors",
    scrapFunc: fetchListOfDoctors
  }
};

const printTheMenu = () => {
  clearTheScreen();
  const optionsList = Object.values(scrapOptions);
  console.log("------------------ MENU ------------------");
  console.log("|");
  optionsList.forEach(option => {
    console.log(`|     ${option.key}  :  ${option.title}`);
  });
  console.log("|");
  console.log("------------------------------------------");
};

const getUserInput = () => {
  printTheMenu();
  readMove.question(`Enter your choice : `, async choice => {
    if (scrapOptions[choice]) {
      showMessageWithSpinner(`Fetching ${scrapOptions[choice].title}`);
      await scrapOptions[choice].scrapFunc();
      stopTheSpinner();
      console.log("Data fetch complete");
      process.exit();
    } else {
      getUserInput();
    }
  });
};

let cliSpinner;
function showMessageWithSpinner(message) {
  cliSpinner = ora({
    text: message,
    spinner: "dots"
  }).start();
}

function stopTheSpinner() {
  if (cliSpinner) {
    cliSpinner.stop();
  }
}

function clearTheScreen() {
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

getUserInput();
