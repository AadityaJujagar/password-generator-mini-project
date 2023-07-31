const copiedMsg = document.querySelector("[copied-msg]");
const slider = document.querySelector("[slider]");
const lenPw = document.querySelector("[pw-len]");
const showPw = document.querySelector("[show-password]");
const copyPw = document.querySelector("[pw-copy]");

const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");

const strengthPw = document.querySelector("[strength-indicator]");
const createPw = document.querySelector(".create-password");
const symbolCollection = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkboxCount = 0;
handleSlider();

function handleSlider() {
  slider.value = passwordLength;
  lenPw.innerText = passwordLength;
}

function setIndicator(color) {
  strengthPw.style.backgroundColor = color;
}

function createRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomInteger() {
  return createRandomInteger(0, 9);
}

function getRandomLowerCaseLetter() {
  return String.fromCharCode(createRandomInteger(97, 123));
}

function getRandomUpperCaseLetter() {
  return String.fromCharCode(createRandomInteger(65, 91));
}

function getRandomSymbols() {
  const intForSym = createRandomInteger(0, symbolCollection.length);
  return symbolCollection.charAt(intForSym);
  // return symbolCollection.charAt[createRandomInteger(0, symbolCollection.length)];
}

function getStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercase.checked) hasUpper = true;
  if (lowercase.checked) hasLower = true;
  if (numbers.checked) hasNum = true;
  if (symbols.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function passwordCopy() {
  try {
    await navigator.clipboard.writeText(showPw.value);
    copiedMsg.innerText = "Copied!";
  } catch (e) {
    copiedMsg.innerText = "Failed :(";
  }
  copiedMsg.classList.add("activate");
  setTimeout(() => {
    copiedMsg.classList.remove("activate");
  }, 2000);
}

slider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyPw.addEventListener("click", () => {
  if (showPw.value) {
    passwordCopy();
  }
});

// shuffle pw chars, Fisher Yates method
function shufflePw(array) {
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

function handleCheckboxChanges() {
  checkboxCount = 0;
  checkBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxCount++;
    }
  });
  if (passwordLength < checkboxCount) {
    passwordLength = checkboxCount;
    handleSlider();
  }
}

checkBoxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChanges);
});

createPw.addEventListener("click", () => {
  if (checkboxCount == 0) return;
  if (passwordLength < checkboxCount) {
    passwordLength = checkboxCount;
    handleSlider();
  }

  // remove previous one first
  password = "";

  let funcArr = [];
  if (uppercase.checked) funcArr.push(getRandomUpperCaseLetter);
  if (lowercase.checked) funcArr.push(getRandomLowerCaseLetter);
  if (numbers.checked) funcArr.push(getRandomInteger);
  if (symbols.checked) funcArr.push(getRandomSymbols);

  // compulsory conditions execution
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining conditions execution
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let getRandomIndex = createRandomInteger(0, funcArr.length);
    password += funcArr[getRandomIndex]();
  }

  password = shufflePw(Array.from(password));
  showPw.value = password;
  strengthPw();
});
