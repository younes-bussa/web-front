// Année dynamique dans le footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Défilement fluide avec prise en compte de la navbar
const OFFSET = 80; // hauteur approximative de la navbar

document.querySelectorAll(".nav a, .btn-demande, .btn-primary, .btn-secondary").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || !href.startsWith("#")) return;

  link.addEventListener("click", (e) => {
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const top = target.offsetTop - OFFSET;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  });
});

// Mise en surbrillance du lien actif
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((sec) => {
    const top = window.scrollY;
    const offset = sec.offsetTop - (OFFSET + 20);
    const height = sec.offsetHeight;

    if (top >= offset && top < offset + height) {
      current = sec.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// Apparition progressive des sections (dynamique visuelle)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".section").forEach((sec) => observer.observe(sec));

/* ===========================
   Formulaire de demande -> API Render
   =========================== */

// ⚠️ MET ICI TON URL RENDER RÉELLE
// Exemple : const API_URL = "https://miplomberie.onrender.com/api/contact";
const API_URL = "https://miplombier.onrender.com/api/contact";

const demandeForm = document.getElementById("demandeForm");
const demandeStatus = document.getElementById("demandeStatus");
const submitBtn = document.getElementById("submitBtn");

if (demandeForm) {
  demandeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nom: document.getElementById("nom").value.trim(),
      email: document.getElementById("email").value.trim(),
      telephone: document.getElementById("telephone").value.trim(),
      description: document.getElementById("description").value.trim(),
    };

    if (!data.nom || (!data.email && !data.telephone) || !data.description) {
      demandeStatus.style.color = "red";
      demandeStatus.textContent =
        "Merci de remplir nom, un moyen de contact et la description.";
      return;
    }

    submitBtn.disabled = true;
    demandeStatus.style.color = "black";
    demandeStatus.textContent = "Envoi en cours...";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        demandeStatus.style.color = "green";
        demandeStatus.textContent =
          "Votre demande a été envoyée. Vous serez recontacté rapidement.";
        demandeForm.reset();
      } else {
        demandeStatus.style.color = "red";
        demandeStatus.textContent =
          result.error || "Erreur lors de l'envoi. Merci de réessayer.";
      }
    } catch (err) {
      console.error(err);
      demandeStatus.style.color = "red";
      demandeStatus.textContent =
        "Erreur réseau. Vérifiez votre connexion et réessayez.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}
