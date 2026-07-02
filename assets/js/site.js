document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".navbar-burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const target = document.getElementById(burger.dataset.target);
      burger.classList.toggle("is-active");
      target.classList.toggle("is-active");
    });
  }

  setUpScrollReveal();
  setUpConferenceModals();
});

function setUpScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
}

function setUpConferenceModals() {
  const closeModal = (modal) => modal.classList.remove("is-active");

  document.querySelectorAll("[data-target]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modal = document.getElementById(trigger.dataset.target);
      if (modal) modal.classList.add("is-active");
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.querySelectorAll(".modal-background, .modal-close").forEach((el) => {
      el.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".modal.is-active").forEach(closeModal);
  });
}
