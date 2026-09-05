const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rig = document.querySelector(".lanyard-rig");
const response = document.querySelector(".lanyard-response");
const titleLines = [...document.querySelectorAll(".title-line")];
const copyBlocks = [...document.querySelectorAll(".reveal-copy")];
const magneticButton = document.querySelector(".magnetic");
const mobileLayout = window.matchMedia("(max-width: 760px)").matches;

function revealText() {
  titleLines.forEach((line, index) => {
    line.animate(
      [
        { opacity: 0, transform: "translateY(0.55em) rotate(1.5deg)", filter: "blur(8px)" },
        { opacity: 1, transform: "translateY(0) rotate(0deg)", filter: "blur(0)" },
      ],
      {
        duration: 920,
        delay: mobileLayout ? 1950 + index * 230 : 720 + index * 240,
        fill: "forwards",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );
  });

  const copyDelays = mobileLayout
    ? [1760, 2680, 2900, 3100]
    : [480, 1500, 1700, 1880];

  copyBlocks.forEach((block, index) => {
    block.animate(
      [
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 760,
        delay: copyDelays[index] ?? 1640 + index * 180,
        fill: "forwards",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );
  });
}

function animateLanyard() {
  response.classList.add("glint-active");

  if (mobileLayout) {
    const mobileEntrance = rig.animate(
      [
        {
          opacity: 0,
          filter: "blur(8px) saturate(0.78)",
          transform: "translateY(-13vh) rotate(-4deg) scale(1.14)",
          offset: 0,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
        {
          opacity: 1,
          filter: "blur(0) saturate(1)",
          transform: "translateY(1.7vh) rotate(3.8deg) scale(1)",
          offset: 0.56,
          easing: "ease-in-out",
        },
        {
          opacity: 1,
          filter: "blur(0) saturate(1)",
          transform: "translateY(0) rotate(-1.7deg) scale(1)",
          offset: 0.76,
          easing: "ease-in-out",
        },
        {
          opacity: 1,
          filter: "blur(0) saturate(1)",
          transform: "translateY(0) rotate(0.65deg) scale(1)",
          offset: 0.9,
          easing: "ease-in-out",
        },
        {
          opacity: 1,
          filter: "blur(0) saturate(1)",
          transform: "translateY(0) rotate(0deg) scale(1)",
          offset: 1,
        },
      ],
      {
        duration: 1450,
        fill: "forwards",
        easing: "linear",
      },
    );

    mobileEntrance.finished.then(() => {
      window.setTimeout(() => {
        rig.animate(
          [
            {
              opacity: 1,
              filter: "blur(0) saturate(1)",
              transform: "translateY(0) rotate(0deg) scale(1)",
            },
            {
              opacity: 0.14,
              filter: "blur(16px) saturate(0.78)",
              transform: "translateY(-2vh) rotate(0deg) scale(1.03)",
            },
          ],
          {
            duration: 720,
            fill: "forwards",
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          },
        );
      }, 360);
    });

    return;
  }

  const entrance = rig.animate(
    [
      {
        opacity: 0.38,
        filter: "blur(10px) saturate(0.72)",
        transform: "translate3d(15vw, -9vh, 0) rotate(-5deg) scale(1.58)",
        offset: 0,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      {
        opacity: 1,
        filter: "blur(0) saturate(1)",
        transform: "translate3d(0, 0, 0) rotate(6.4deg) scale(1)",
        offset: 0.48,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
      {
        opacity: 1,
        filter: "blur(0) saturate(1)",
        transform: "translate3d(0, 0, 0) rotate(-3.1deg) scale(1)",
        offset: 0.67,
        easing: "ease-in-out",
      },
      {
        opacity: 1,
        filter: "blur(0) saturate(1)",
        transform: "translate3d(0, 0, 0) rotate(1.45deg) scale(1)",
        offset: 0.82,
        easing: "ease-in-out",
      },
      {
        opacity: 1,
        filter: "blur(0) saturate(1)",
        transform: "translate3d(0, 0, 0) rotate(-0.58deg) scale(1)",
        offset: 0.93,
        easing: "ease-in-out",
      },
      {
        opacity: 1,
        filter: "blur(0) saturate(1)",
        transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)",
        offset: 1,
      },
    ],
    {
      duration: 2550,
      fill: "forwards",
      easing: "linear",
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
  rig.style.filter = "none";
  titleLines.forEach((line) => (line.style.opacity = "1"));
  copyBlocks.forEach((block) => (block.style.opacity = "1"));
} else {
  revealText();
  animateLanyard();
  if (!mobileLayout) {
    installPointerPhysics();
    installMagneticButton();
  }
}
