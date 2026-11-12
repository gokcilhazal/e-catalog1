
const pages = document.querySelectorAll(".page");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageCounter = document.getElementById("pageCounter");
const navigationDots = document.getElementById("navigationDots");
const catalog = document.querySelector(".catalog");

let currentPage = 0;
let isAnimating = false;

const totalPages = pages.length;
const duration = 950;

// SİHİR TOZU ALANI
const particleLayer = document.createElement("div");
particleLayer.className = "magic-particles";
catalog.appendChild(particleLayer);

// SİHİR TOZU OLUŞTUR
function createFairyDust() {
    particleLayer.innerHTML = "";

    for (let i = 0; i < 85; i++) {
        const particle = document.createElement("span");
        const isFlower = i % 8 === 0;

        particle.className = isFlower
            ? "magic-particle flower"
            : "magic-particle";

        if (isFlower) particle.textContent = "✿";

        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const moveX = (Math.random() - 0.5) * 220;
        const moveY = -40 - Math.random() * 180;

        const size = isFlower
            ? 11 + Math.random() * 9
            : 2 + Math.random() * 4;

        particle.style.setProperty("--start-x", `${startX}%`);
        particle.style.setProperty("--start-y", `${startY}%`);
        particle.style.setProperty("--move-x", `${moveX}px`);
        particle.style.setProperty("--move-y", `${moveY}px`);
        particle.style.setProperty("--size", `${size}px`);
        particle.style.setProperty("--duration", `${650 + Math.random() * 550}ms`);
        particle.style.setProperty("--delay", `${Math.random() * 180}ms`);

        particleLayer.appendChild(particle);
    }
}

// SAYFA NOKTALARI
pages.forEach((page, index) => {
    const dot = document.createElement("button");

    dot.className = "dot";
    dot.setAttribute("aria-label", `${index + 1}. sayfaya git`);
    dot.addEventListener("click", () => goToPage(index));

    navigationDots.appendChild(dot);
});

// SAYFA GEÇİŞİ
function goToPage(targetPage) {
    if (isAnimating) return;
    if (targetPage < 0 || targetPage >= totalPages) return;
    if (targetPage === currentPage) return;

    isAnimating = true;

    const oldPage = pages[currentPage];
    const newPage = pages[targetPage];
    const forward = targetPage > currentPage;

    // Önceki animasyon sınıflarını temizle
    pages.forEach(page => {
        page.classList.remove(
            "active",
            "slide-in-left",
            "slide-in-right",
            "slide-out-left",
            "slide-out-right",
            "page-leaving"
        );
    });

    // Yeni sayfayı doğru yönden hazırla
    newPage.classList.add("active");
    oldPage.classList.add("page-leaving");

    newPage.classList.add(
        forward ? "slide-in-right" : "slide-in-left"
    );

    oldPage.classList.add(
        forward ? "slide-out-left" : "slide-out-right"
    );

    createFairyDust();

    currentPage = targetPage;
    updateNavigation();

    setTimeout(() => {
        pages.forEach(page => {
            page.classList.remove(
                "slide-in-left",
                "slide-in-right",
                "slide-out-left",
                "slide-out-right",
                "page-leaving"
            );
        });

        particleLayer.innerHTML = "";
        isAnimating = false;
    }, duration + 80);
}

// NAVİGASYON
function updateNavigation() {
    navigationDots.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentPage);
    });

    pageCounter.textContent =
        `${String(currentPage + 1).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

// OKLAR
prevBtn.addEventListener("click", () => {
    goToPage(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
    goToPage(currentPage + 1);
});

// KLAVYE
document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") goToPage(currentPage + 1);
    if (event.key === "ArrowLeft") goToPage(currentPage - 1);
});

// MOBİL KAYDIRMA
let touchStartX = 0;

catalog.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

catalog.addEventListener("touchend", event => {
    const distance = event.changedTouches[0].screenX - touchStartX;

    if (Math.abs(distance) < 60) return;

    goToPage(currentPage + (distance < 0 ? 1 : -1));
}, { passive: true });

// BAŞLANGIÇ
updateNavigation();
