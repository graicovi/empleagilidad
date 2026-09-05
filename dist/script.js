const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rig = document.querySelector(".lanyard-rig");
const response = document.querySelector(".lanyard-response");
const titleLines = [...document.querySelectorAll(".title-line")];
const copyBlocks = [...document.querySelectorAll(".reveal-copy")];
const magneticButton = document.querySelector(".magnetic");

function revealText() {
  titleLines.forEach((line, index) => {
    line.animate(
      [
        { opacity: 0, transform: "translateY(0.55em) rotate(1.5deg)", filter: "blur(8px)" },
        { opacity: 1, transform: "translateY(0) rotate(0deg)", filter: "blur(0)" },
      ],
      {
        duration: 920,
        delay: 360 + index * 145,
        fill: "forwards",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );
  });

  copyBlocks.forEach((block, index) => {
    block.animate(
      [
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 760,
        delay: 180 + index * 180,
        fill: "forwards",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );
  });
}

function animateLanyard() {
  const entrance = rig.animate(
    [
      { opacity: 0, transform: "translateY(-68vh) rotate(-7deg) scale(0.96)" },
      { opacity: 1, offset: 0.18 },
      { opacity: 1, transform: "translateY(4.5vh) rotate(5deg) scale(1)", offset: 0.58 },
      { opacity: 1, transform: "translateY(-1.2vh) rotate(-2.4deg) scale(1)", offset: 0.76 },
      { opacity: 1, transform: "translateY(0.4vh) rotate(1.1deg) scale(1)", offset: 0.9 },
      { opacity: 1, transform: "translateY(0) rotate(0deg) scale(1)" },
    ],
    {
      duration: 2100,
      fill: "forwards",
      easing: "cubic-bezier(0.22, 0.72, 0.2, 1)",
    },
  );

  entrance.finished.then(() => {
    rig.animate(
      [
        { transform: "translateY(0) rotate(0deg)" },
        { transform: "translateY(2px) rotate(0.85deg)" },
        { transform: "translateY(0) rotate(0deg)" },
        { transform: "translateY(2px) rotate(-0.85deg)" },
        { transform: "translateY(0) rotate(0deg)" },
      ],
      {
        duration: 6800,
        iterations: Infinity,
        easing: "ease-in-out",
      },
    );
  });
}

function installPointerPhysics() {
  let rafId = 0;

  window.addEventListener("pointermove", (event) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      response.style.setProperty("--tilt-y", `${x * 7}deg`);
      response.style.setProperty("--tilt-x", `${y * -4}deg`);
    });
  });

  document.documentElement.addEventListener("pointerleave", () => {
    response.style.setProperty("--tilt-y", "0deg");
    response.style.setProperty("--tilt-x", "0deg");
  });
}

function installMagneticButton() {
  magneticButton.addEventListener("pointermove", (event) => {
    const rect = magneticButton.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    magneticButton.style.transform = `translate(${x * 0.08}px, ${y * 0.12 - 3}px)`;
  });

  magneticButton.addEventListener("pointerleave", () => {
    magneticButton.style.transform = "";
  });
}

if (reduceMotion) {
  rig.style.opacity = "1";
  rig.style.transform = "none";
  titleLines.forEach((line) => (line.style.opacity = "1"));
  copyBlocks.forEach((block) => (block.style.opacity = "1"));
} else {
  revealText();
  animateLanyard();
  installPointerPhysics();
  installMagneticButton();
}
