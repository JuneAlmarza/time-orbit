// Me habría encantado que al hacer click en cada una de als ciudades la bola del mundo tambien se moviese y se centrase en esa ciudad.
// Entiendo que eso se haria marcando la latitud y longitud o coordenadas de esa espera, guardarlas y enlazarlas con el click de cada pais, pero se me escapa ajjaja

let earth;
let camAngle = 0;

let targetScale = 1;   // escala objetivo
let currentScale = 1;  // escala actual (lerp)

let spaceSound;

// ===== ARRAY DE INFORMACIÓN =====
const cityData = {
  madrid: {
    name: "Madrid",
    country: "España",
    population: "3.3M",
    coords: "40.4168° N / 3.7038° W",
  },
  buenosaires: {
    name: "Buenos Aires",
    country: "Argentina",
    population: "15.6M (metro)",
    coords: "34.6037° S / 58.3816° W",
  },
  ny: {
    name: "New York",
    country: "Estados Unidos",
    population: "8.8M",
    coords: "40.7128° N / 74.0060° W",
  },
  tokyo: {
    name: "Tokyo",
    country: "Japón",
    population: "37M (metro)",
    coords: "35.6762° N / 139.6503° E",
  }
};

function preload() {
  earth = loadImage('assets/img/texture.jpeg');
  spaceSound = loadSound('assets/sound/space-sound.mp3');
}

function setup() {
  let c = createCanvas(windowWidth, windowHeight, WEBGL);
  c.parent('container');

  // ===== Configurar ciudades clicables =====
  let cities = document.querySelectorAll('.city');

  cities.forEach(city => {
    city.addEventListener('click', () => {

      cities.forEach(c => c.classList.remove('active'));
      city.classList.add('active');
      spaceSound.play();
      setTimeout(() => {
        spaceSound.stop();
      }, 1500); // 1,5 s

      updateInfo(city.id);
    });
  });
  updateInfo("madrid");
}

function draw() {
  background(0);
  noStroke();

  // ===== Dibujar estrellas de fondo =====
  for (let i = 0; i < 200; i++) {
    push();
      translate(
        random(-3000,3000),
        random(-3000,3000),
        random(-3000,3000)
      );
      fill(255);
      sphere(1);
    pop();
  }

  // ===== ROTACIÓN DE LA TIERRA =====
  let now = new Date();
  let utcSeconds = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
  let dayProgress = utcSeconds / 86400;
  let earthRotation = dayProgress * TWO_PI;

  // ===== CÁMARA ORBITANDO =====
  camAngle += 0.002;
  let camX = cos(camAngle) * 380;
  let camZ = sin(camAngle) * 380;
  camera(camX, 0, camZ, 0, 0, 0, 0, 1, 0);

  // ===== ZOOM AL PASAR EL RATÓN =====
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;
  let distance = sqrt(dx*dx + dy*dy);

  let radius = 140 * 1;
  if (distance < radius) {
    targetScale = map(distance, 0, radius, 1.2, 1);
  } else {
    targetScale = 1;
  }
  currentScale = lerp(currentScale, targetScale, 0.05);

  // ===== LUCES =====
  ambientLight(40);
  directionalLight(255, 255, 255, -1, 0, -1);
  pointLight(255, 255, 200, camX, -50, camZ);

  // ===== PLANETA =====
  push();
    rotateZ(radians(23.5));
    rotateY(earthRotation);
    scale(currentScale);
    texture(earth);
    sphere(140);
  pop();

  // ===== ACTUALIZAR HORAS =====
  updateTimes();
}

function updateTimes() {
  const now = new Date();

  function getTime(offset) {
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + 3600000 * offset);
    const h = cityTime.getHours().toString().padStart(2,'0');
    const m = cityTime.getMinutes().toString().padStart(2,'0');
    const s = cityTime.getSeconds().toString().padStart(2,'0');
    return `${h}:${m}:${s}`;
  }

  document.getElementById('time-madrid').textContent = getTime(1);
  document.getElementById('time-buenosaires').textContent = getTime(-3);
  document.getElementById('time-ny').textContent = getTime(-5);
  document.getElementById('time-tokyo').textContent = getTime(9);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function updateInfo(cityId) {
  const data = cityData[cityId];

  document.getElementById("info-title").textContent = data.name;

  document.getElementById("info-content").innerHTML = `
    <p><strong>/</strong> ${data.country}</p>
    <p><strong>/ Población</strong> / ${data.population}</p>
    <p><strong>/ Coordenadas</strong><br>[ ${data.coords} ]</p>
  `;
}