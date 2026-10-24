
const questions = [
  {
    question: "1. 💗 ¿Qué plan te gustaría compartir conmigo?",
    answers: [
      "🌅 Ver el atardecer",
      "🎬 Una tarde de películas",
      "🍓 Salir por algo rico",
      "💌 Platicar durante horas"
    ]
  },
  {
    question: "2. 🌷 ¿Qué flores te hacen más ilusión?",
    answers: [
      "🌷 Tulipanes",
      "🌹 Rosas rojas",
      "🌸 Flores rositas",
      "💐 Un ramo combinado"
    ]
  },
  {
    question: "3. 🥹 ¿Qué detalle te hace sentir más querida?",
    answers: [
      "💌 Una carta larga",
      "🎶 Una canción dedicada",
      "📸 Fotos y recuerdos",
      "🧸 Un detalle tierno"
    ]
  },
  {
    question: "4. 🌙 ¿Qué momento del día te gusta más?",
    answers: [
      "🌅 Amanecer",
      "☀️ Una tarde soleada",
      "🌇 Atardecer",
      "🌙 Una noche tranquila"
    ]
  },
  {
    question: "5. 🎀 ¿Qué colores elegirías para tu ramo?",
    answers: [
      "❤️ Rojo y blanco",
      "🌸 Rosa pastel",
      "💜 Lila y rosa",
      "🌈 Muchos colores"
    ]
  },
  {
    question: "6. 🍰 ¿Cuál sería una cita ideal?",
    answers: [
      "🍰 Comer algo dulce",
      "🌳 Pasear juntos",
      "🎥 Ver una película",
      "🎡 Hacer algo nuevo"
    ]
  },
  {
    question: "7. 🎶 ¿Qué recuerdo te gustaría guardar?",
    answers: [
      "🎵 Nuestra canción",
      "📷 Una foto bonita",
      "✉️ Una carta especial",
      "🌷 Un día sorpresa"
    ]
  },
  {
    question: "8. 💞 ¿Qué hace especial una relación para ti?",
    answers: [
      "🫶 Confianza y respeto",
      "😂 Reír juntos",
      "💬 Hablar con sinceridad",
      "🌱 Aprender juntos"
    ]
  },
  {
    question: "9. 🥰 ¿Qué te gustaría que nunca faltara?",
    answers: [
      "💗 Cariño y ternura",
      "🤍 Respeto y confianza",
      "😂 Risas y ocurrencias",
      "🌷 Tiempo de calidad"
    ]
  }
];

const $ = (id) => document.getElementById(id);

let currentQuestion = 0;
let answers = [];
let selectedGift = "";
let photoURLs = [];

// Mostrar las preguntas del juego
function renderQuestion() {
  const question = questions[currentQuestion];

  $("progress").textContent =
    `Pregunta ${currentQuestion + 1} de ${questions.length}`;

  $("question").textContent = question.question;

  const optionsContainer = $("options");
  optionsContainer.replaceChildren();

  question.answers.forEach((answer) => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = answer;

    button.addEventListener("click", () => {
      answers[currentQuestion] = answer;
      currentQuestion++;

      if (currentQuestion < questions.length) {
        renderQuestion();
      } else {
        $("quiz").hidden = true;
        $("giftStep").hidden = false;
        $("giftStep").scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });

    optionsContainer.appendChild(button);
  });
}

// Iniciar el juego
renderQuestion();

// Elegir uno de los cinco regalos
document.querySelectorAll(".gift").forEach((button) => {
  button.addEventListener("click", () => {
    selectedGift = button.dataset.gift;

    document.querySelectorAll(".gift").forEach((giftButton) => {
      giftButton.classList.toggle(
        "selected",
        giftButton === button
      );
    });

    $("chosenGift").textContent = selectedGift;
    $("chosenImage").src = button.dataset.image;

    $("locationStep").hidden = false;

    $("feedback").textContent =
      `Elegiste ${selectedGift}. Ahora dime dónde lo quieres. 💗`;

    $("locationStep").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
});

// Permitir seleccionar hasta cinco fotos y mostrarlas
$("photos").addEventListener("change", () => {
  photoURLs.forEach((url) => URL.revokeObjectURL(url));
  photoURLs = [];

  const preview = $("preview");
  preview.replaceChildren();

  const files = [...$("photos").files];
  const imageFiles = files
    .filter((file) => file.type.startsWith("image/"))
    .slice(0, 5);

  imageFiles.forEach((file) => {
    const url = URL.createObjectURL(file);
    photoURLs.push(url);

    const image = document.createElement("img");
    image.src = url;
    image.alt = file.name;

    preview.appendChild(image);
  });

  $("feedback").textContent =
    files.length > 5
      ? "Solo se mostrarán las primeras cinco imágenes. 📸"
      : `${imageFiles.length} imagen(es) seleccionada(s). ♡`;
});

// Finalizar la experiencia
$("finish").addEventListener("click", () => {
  if (!selectedGift) {
    $("feedback").textContent =
      "Primero elige el regalo que más te guste. 💗";
    return;
  }

  const location = $("location").value.trim();

  $("feedback").textContent =
    `¡Sorpresa, Ferchis! 💗 ` +
    `Elegiste ${selectedGift}. ` +
    (location ? `Lugar indicado: ${location}. ` : "") +
    "¡Gracias por jugar! Con cariño, tu Vampi. ♡";

  $("share").hidden = false;
  $("feedback").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

// Copiar las respuestas para compartirlas manualmente
$("share").addEventListener("click", async () => {
  const location = $("location").value.trim();

  const message =
    "🌷 Mis respuestas para Vampi ♡\n\n" +
    questions.map((question, index) =>
      question.question + "\n" + (answers[index] || "Sin respuesta")
    ).join("\n\n") +
    "\n\n🎁 Regalo: " + selectedGift +
    "\n📍 Ubicación: " + (location || "No indicada") +
    "\n📸 Las fotos deben adjuntarse manualmente.";

  try {
    await navigator.clipboard.writeText(message);

    $("feedback").textContent =
      "¡Respuestas copiadas! Puedes pegarlas en el chat que prefieras. ♡";
  } catch {
    $("feedback").textContent = message;
  }
});

// Abrir y cerrar la carta completa


// Crear las diez opciones del reproductor
for (let number = 1; number <= 10; number++) {
  const option = document.createElement("option");

  option.value = number;
  option.textContent = `Canción ${number}`;

  $("song").appendChild(option);
}

const player = $("player");
const songSelect = $("song");

let currentSong = 1;

// Reproducir una canción
function playSong(number) {
  currentSong = number;
  songSelect.value = String(number);

  player.src = `musica/cancion${number}.mp3`;
  player.load();

  player.play().catch(() => {
    $("feedback").textContent =
      "Comprueba que la canción exista en la carpeta musica " +
      "y vuelve a pulsar reproducir. ♫";
  });
}

// Botón para reproducir la canción seleccionada
$("play").addEventListener("click", () => {
  playSong(Number(songSelect.value));
});

// Cambiar de canción manualmente
songSelect.addEventListener("change", () => {
  currentSong = Number(songSelect.value);

  player.pause();
  player.currentTime = 0;
  player.src = `musica/cancion${currentSong}.mp3`;
  player.load();
});

// Pasar automáticamente a la siguiente canción
player.addEventListener("ended", () => {
  const nextSong = currentSong >= 10 ? 1 : currentSong + 1;

  playSong(nextSong);
});