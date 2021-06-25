/* 
    Utilización de funciones asíncronas para el manejo de fetch().
    Se utilizan para escribir de una manera mas procedural el manejo de promesas.
*/

const MAX_POKEMON = 300;
const HTML_FORM = document.querySelector("form");
const RETRY_BTN = document.querySelector("#retry-btn");
const HTML_ANSWER = document.querySelector("#answer");
const HTML_POINTS = document.querySelector("#user-points");
const HTML_IMG = document.querySelector("#pokeImg");
const HTML_INPUT = document.querySelector("#user-guest");

let myPokemon = {};

const GAME = {
  _answer: "",
  _points: 0,

  get points() {
    return this._points;
  },

  set points(newPoints) {
    this._points = newPoints;
  },

  get answer() {
    return this._answer;
  },

  set answer(newAnswer) {
    this._answer = newAnswer;
  },
};

HTML_FORM.onsubmit = checkAnswer;
RETRY_BTN.onclick = getPokemon;

getPokemon();

async function retrievePokemon() {
  const randomID = Math.floor(Math.random() * MAX_POKEMON) + 1;
  const url = `https://pokeapi.co/api/v2/pokemon/${randomID}`;
  const response = await fetch(url);

  if (response.ok) {
    const pokeJson = await response.json();
    return pokeJson;
  } else {
    throw response.status;
  }

}

async function getPokemon() {
  try {
    const myPokemon = await retrievePokemon();
    createPokemon(myPokemon);
  } catch (err) {
    console.error(err);
  }
}

function createPokemon(fetchedPokemon) {
  myPokemon = fetchedPokemon;
  GAME.answer = myPokemon.name;
  setImgUrl(myPokemon);
  setImgBrightness(0);
  disableInput(false);
  clearText();
}

function checkAnswer(event) {
  event.preventDefault();

  if (GAME.answer == HTML_INPUT.value.toLowerCase()) {
    renderAnswer("Correct!", "correct");
    GAME.points = GAME.points + 1;
    renderPoints();
  } else {
    renderAnswer(`Incorrect! 😢 It's ${GAME.answer}!`, "incorrect");
  }

  setTimeout(getPokemon, 3000);
}

function renderAnswer(text, type) {
  HTML_ANSWER.textContent = text;
  HTML_ANSWER.className = type;
  setImgBrightness(1);
  disableInput(true);
}

function setImgBrightness(brightness) {
  HTML_IMG.style.filter = `brightness(${brightness})`;
}

function disableInput(value) {
  HTML_INPUT.disabled = value;
}

function clearText() {
  HTML_INPUT.value = "";
  HTML_ANSWER.textContent = "";
}

function setImgUrl(pokemon) {
  HTML_IMG.setAttribute("src", pokemon.sprites.other["official-artwork"].front_default);
}

function renderPoints() {
  HTML_POINTS.textContent = GAME.points;
}

