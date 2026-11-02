
const loveButton = document.getElementById("loveButton");
const subtitle = document.getElementById("subtitle");

const messageOverlay = document.getElementById("messageOverlay");
const closeButton = document.getElementById("closeButton");

const heartOutline = document.querySelector(".heart-outline");

// رسم القلب ثم إظهار الزر
heartOutline.addEventListener("animationend", (event) => {
    if (event.animationName === "drawHeart") {
        loveButton.disabled = false;
        loveButton.classList.add("show");
        subtitle.textContent = ".";
    }
});

// فتح الرسالة
loveButton.addEventListener("click", () => {
    messageOverlay.classList.add("active");
});

// إغلاق الرسالة
closeButton.addEventListener("click", () => {
    messageOverlay.classList.remove("active");
});

// الإغلاق بالضغط خارج الرسالة
messageOverlay.addEventListener("click", (event) => {
    if (event.target === messageOverlay) {
        messageOverlay.classList.remove("active");
    }
});

// SVG بتلات متحركة
const petalsContainer = document.getElementById("petals");

function createPetal() {
    const petal = document.createElement("div");

    petal.className = "petal";

    const rotation = Math.random() * 360;

    petal.innerHTML = `
        <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15 2 C28 5 28 23 15 28 C2 23 2 5 15 2Z"
                fill="${Math.random() > 0.5 ? '#f28ab5' : '#e65c98'}"
            />
        </svg>
    `;

    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = (5 + Math.random() * 5) + "s";
    petal.style.transform = `rotate(${rotation}deg)`;

    petalsContainer.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 11000);
}

setInterval(createPetal, 900);
// LAYLA falling name animation

const laylaRain = document.getElementById("laylaRain");

function createLayla() {
    const word = document.createElement("div");

    word.className = "layla-word";
    word.textContent = "LAYLA";

    word.style.left = Math.random() * 90 + "%";

    word.style.animationDuration =
        (6 + Math.random() * 6) + "s";

    laylaRain.appendChild(word);

    setTimeout(() => {
        word.remove();
    }, 13000);
}

setInterval(createLayla, 500);