const displayPasswordEl = document.querySelector("[data-showpassword]");
const copyBtnEl = document.querySelector("[data-copy]");
const passwordStrengthEl = document.querySelector("[data-passwordLength]");
const sliderEl = document.querySelector("[data-lengthSlider]");
const allCheckedEl = document.querySelectorAll("input[type=checkbox]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const generateContainerBtn = document.querySelector(".generateBtnContainer");
const passCopyEl = document.querySelector(".tooltip");

// All special characters as a string

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkboxCount = 0;

// sliderChange();

function sliderChange() {
  passwordStrengthEl.innerText = passwordLength = sliderEl.value;
}

// Slider Progress

const e = document.querySelector('input[type="range"].slider-progress');

sliderProgress();
function sliderProgress() {
  e.style.setProperty("--value", e.value);
  e.style.setProperty("--min", e.min == "" ? "4" : e.min);
  e.style.setProperty("--max", e.max == "" ? "20" : e.max);
}
e.addEventListener("input", () => e.style.setProperty("--value", e.value));

// Checking all the checkboxes

function handleCheckBoxChange() {
  checkboxCount = 0;
  allCheckedEl.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxCount++;
    }
  });
  console.log(checkboxCount);

  //special condition
  if (passwordLength < checkboxCount) {
    passwordLength = checkboxCount;
    passwordStrengthEl.innerText = sliderEl.value = passwordLength;
    sliderProgress();
  }
}

allCheckedEl.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

// Checking the strength of the password

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.border = `3px solid ${color}`;
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ccc");
  } else {
    setIndicator("#f00");
  }
}

// Password text copy function

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(displayPasswordEl.value);
    passCopyEl.innerText = "copied";
  } catch (e) {
    passCopyEl.innerText = "Failed";
  }
  //to make copy wala span visible
  passCopyEl.classList.add("active");

  setTimeout(() => {
    passCopyEl.classList.remove("active");
  }, 1500);
}

//Copy button event listener

copyBtnEl.addEventListener("click", () => {
  console.log("Copy btn clicked");
  if (displayPasswordEl.value) copyPassword();
});

generateBtn.addEventListener("click", () => {
  if (checkboxCount == 0) {
    displayPasswordEl.value = "";
    setIndicator("hsl(268, 75%, 9%)");
    return;
  }

  if (passwordLength < checkboxCount) {
    passwordLength = checkboxCount;
    passwordStrengthEl.innerText = sliderEl.value = passwordLength;
    sliderProgress();
  }
  password = "";

  //let's put the stuff mentioned by checkboxes

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //At checkbox satisfied
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining adddition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    console.log(passwordLength);
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }
  //shuffle the password

  password = shufflePassword(Array.from(password));

  //show in UI
  displayPasswordEl.value = password;

  calcStrength();
});

function scaleUp() {
  generateContainerBtn.style.transform = "scale(1)";
}
function scaleDown() {
  generateContainerBtn.style.transform = "scale(0.9)";
}
generateContainerBtn.addEventListener("mousedown", () => {
  scaleDown();
});
generateContainerBtn.addEventListener("mouseup", () => {
  scaleUp();
});
generateContainerBtn.addEventListener("touchstart", () => {
  scaleDown();
});
generateContainerBtn.addEventListener("touchend", () => {
  scaleUp();
});
