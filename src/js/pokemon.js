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

/*
    Función asincróna que realizará la petición a la API.
*/

async function retrievePokemon() {
  // Generamos un ID aleatorio en base al máximo pókemon.
  const randomID = Math.floor(Math.random() * MAX_POKEMON) + 1;

  // Armamos la url para consultar el pókemon.
  const url = `https://pokeapi.co/api/v2/pokemon/${randomID}`;

  // Esperamos a que la función fetch nos devuelva un valor.
  const response = await fetch(url);

  // Una vez que se ejecuta el fetch confirmamos que haya resuelto correctamente la request.
  if (response.ok) {
    // Si está todo bien esperamos a que se parsee la respuesta a JSON.
    const pokeJson = await response.json();

    // Una vez parseado lo devolvemos como resultado
    return pokeJson;
  } else {
    // En caso de no estar correcta la petición, lanzamos un error
    throw `Ocurrio un error al intentar consultar la API: ${response.status}`;
  }
}

/*
    La función retrievePokemon es una promesa, por lo que para utilizarla
    debemos trabajarla dentro de otra función asíncrona.
*/

async function getPokemon() {
  // Debido a que retrievePokemon nos lanza un error
  // utilizamos try-catch para trabajar
  // Si llega a existir un error (404 por ejemplo), se dispara por alert.

  try {
    // Esperamos hasta obtener un pókemon
    const myPokemon = await retrievePokemon();

    createPokemon(myPokemon);
  } catch (err) {
    alert(err);
  }
}

function createPokemon(pokemon) {
  GAME.answer = pokemon.name;

  setImgUrl(pokemon.sprites.front_default);
  setImgBrightness(0);
  disableInput(false);
  clearText();
}

function checkAnswer(event) {
  event.preventDefault();

  if (GAME.answer == HTML_INPUT.value) {
    renderAnswer("Correct! 😁", "correct");
    GAME.points = GAME.points + 1;
    renderPoints();
  } else {
    renderAnswer(`Incorrect! 😟 It's ${GAME.answer}!`, "incorrect");
  }
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

function setImgUrl(url) {
  HTML_IMG.src = url;
}

function renderPoints() {
  HTML_POINTS.textContent = GAME.points;
}
