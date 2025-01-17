/** @format */

const originalSectors = [
  {
    color: "#ffda85",
    text: "#333333",
    label: "T-shirt",
    image: "/src/tshirt.png",
  },
  {
    color: "#FFF",
    text: "#333333",
    label: "Cap",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1736941989/w7uwdwis2gbf5p9xy54f.png",
  },
  {
    color: "#ffda85",
    text: "#333333",
    label: "Sunlight",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1736940599/mxcmvvbiy3edq3wkmirc.png",
  },
  {
    color: "#FFF",
    text: "#333333",
    label: "Rin",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1736947162/pu0tlogr54tnhtjvsev7.png",
  },
  {
    color: "#ffda85",
    text: "#333333",
    label: "Cap",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1736941989/w7uwdwis2gbf5p9xy54f.png",
  },
  {
    color: "#FFF",
    text: "#333333",
    label: "Rin",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1736947162/pu0tlogr54tnhtjvsev7.png",
  },
];

let sectors = [...originalSectors];

const events = {
  listeners: {},
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

// Preload images for better performance
const preloadedImages = {};

function preloadImages() {
  originalSectors.forEach((sector) => {
    if (!preloadedImages[sector.image]) {
      const img = new Image();
      img.src = sector.image;
      preloadedImages[sector.image] = img;
    }
  });
}

// Function to check inventory and update sectors
function updateWheelSectors() {
  const inventory = JSON.parse(localStorage.getItem("wheelInventory"));
  sectors = originalSectors.map((sector) => {
    if (inventory[sector.label] >= 100) {
      return {
        ...sector,
        label: "Try Again",
        color: "#fff",
        image: null, // Remove image for Try Again sectors
      };
    }
    return sector;
  });

  // Redraw the wheel with updated sectors
  ctx.clearRect(0, 0, dia, dia);
  sectors.forEach(drawSector);
  rotate();
}

function initializeInventory() {
  if (!localStorage.getItem("wheelInventory")) {
    localStorage.setItem(
      "wheelInventory",
      JSON.stringify({
        "T-shirt": 0,
        Cap: 0,
        Sunlight: 0,
        Rin: 0,
      })
    );
  }
  updateWheelSectors(); // Update wheel sectors after initializing inventory
}

// Update inventory when item is won
function updateInventory(item) {
  const inventory = JSON.parse(localStorage.getItem("wheelInventory"));

  // Don't update inventory for "Try Again"
  if (item === "Try Again") return;

  inventory[item] = (inventory[item] || 0) + 1;

  localStorage.setItem("wheelInventory", JSON.stringify(inventory));
  updateInventoryDisplay();
  updateWheelSectors(); // Update wheel sectors after updating inventory
}

// Display inventory counts
function updateInventoryDisplay() {
  const inventory = JSON.parse(localStorage.getItem("wheelInventory"));
  const inventoryDiv = document.getElementById("inventory-display");

  inventoryDiv.innerHTML = `
    <h2>Your Inventory</h2>
    <div class="inventory-items">
      <div class="inventory-item">
        <span>👕 T-shirt:</span>
        <span>${inventory["T-shirt"]}/100</span>
      </div>
      <div class="inventory-item">
        <span>🧢 Cap:</span>
        <span>${inventory["Cap"]}/100</span>
      </div>
      <div class="inventory-item">
        <span>🧴 Sunlight:</span>
        <span>${inventory["Sunlight"]}/100</span>
      </div>
      <div class="inventory-item">
        <span>🧼 Rin:</span>
        <span>${inventory["Rin"]}/100</span>
      </div>
      <button id="reset-inventory" class="reset-button">Reset Inventory</button>
    </div>
  `;
}

function resetInventory() {
  const confirmReset = confirm(
    "Are you sure you want to reset your inventory? This action cannot be undone."
  );

  if (confirmReset) {
    localStorage.setItem(
      "wheelInventory",
      JSON.stringify({
        "T-shirt": 0,
        Cap: 0,
        Sunlight: 0,
        Rin: 0,
      })
    );
    updateInventoryDisplay();
    updateWheelSectors(); // Update wheel sectors after resetting inventory
  }
}
const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const bodyEl = document.querySelector("#game");
const resultsWrapperEl = document.querySelector("#results-wrapper");
const resultEl = document.querySelector("#result");
const resultTextEl = document.querySelector("#result-text");
const resultText1El = document.querySelector("#result-text1");
const congratsTextEl = document.querySelector("#congrats");
const resultContEl = document.querySelector("#result-container");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.991;
let angVel = 0;
let ang = 0;
let spinButtonClicked = false;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // Add border
  ctx.strokeStyle = "#eb6b34";
  ctx.lineWidth = 2;
  ctx.stroke();

  // IMAGE or TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);

  if (sector.label !== "Try Again" && sector.image) {
    // Draw image
    const imgSize = 200; // Adjust size as needed
    const imgX = rad - imgSize - 20; // Position from edge
    const imgY = -imgSize / 2; // Center vertically

    if (
      preloadedImages[sector.image] &&
      preloadedImages[sector.image].complete
    ) {
      ctx.drawImage(
        preloadedImages[sector.image],
        imgX,
        imgY,
        imgSize,
        imgSize
      );
    }
  } else {
    // Draw "Try Again" text
    ctx.textAlign = "right";
    ctx.fillStyle = sector.text;
    ctx.font = "bold 30px 'Lato', sans-serif";
    ctx.fillText(sector.label, rad - 100, 10);
  }

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  spinEl.textContent = !angVel ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false;
    return;
  }

  angVel *= friction;
  if (angVel < 0.002) angVel = 0;
  ang += angVel;
  ang %= TAU;
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

// Initialize when page loads
preloadImages();
initializeInventory();
updateInventoryDisplay();

events.addListener("spinEnd", (sector) => {
  resultsWrapperEl.style.display = "flex";
  resultEl.textContent = sector.label;

  if (sector.label === "Try Again") {
    resultTextEl.textContent = "Bad Luck!";
    congratsTextEl.style.display = "none";
  } else {
    resultTextEl.textContent = "You have won a";
    congratsTextEl.style.display = "block";
    updateInventory(sector.label);
  }
});

// Add reset button event listener
document
  .getElementById("reset-inventory")
  .addEventListener("click", resetInventory);

function init() {
  sectors.forEach(drawSector);
  rotate();
  engine();
  bodyEl.addEventListener("click", () => {
    if (!angVel) angVel = rand(0.25, 0.45);
    spinButtonClicked = true;
  });
}

resultsWrapperEl.addEventListener("click", function (event) {
  event.stopPropagation();
  resultsWrapperEl.style.display = "none";
  // window.location.reload();
});

init();

events.addListener("spinEnd", (sector) => {
  console.log(`Result: ${sector.label}`);
});
