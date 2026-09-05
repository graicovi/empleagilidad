const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rig = document.querySelector(".lanyard-rig");
const response = document.querySelector(".lanyard-response");
const titleLines = [...document.querySelectorAll(".title-line")];
const copyBlocks = [...document.querySelectorAll(".reveal-copy")];
const magneticButton = document.querySelector(".magnetic");
const lanyardImage = document.querySelector(".lanyard-response img");
const layoutQuery = window.matchMedia("(max-width: 760px)");
const mobileLayout = layoutQuery.matches;
const alternateMotion = new URLSearchParams(window.location.search).get("motion") === "alternate";
let entranceAnimation = null;

layoutQuery.addEventListener("change", () => window.location.reload());

window.addEventListener("pageshow", (event) => {
  if (event.persisted) window.location.reload();
});

document.addEventListener("visibilitychange", () => {
  if (!entranceAnimation || entranceAnimation.playState === "finished") return;
  if (document.hidden) entranceAnimation.pause();
  else entranceAnimation.play();
});

function waitUntilVisible() {
  if (!document.hidden) return Promise.resolve();

  return new Promise((resolve) => {
    const onVisibilityChange = () => {
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resolve();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
  });
}

async function waitForLanyard() {
  if (!lanyardImage) return;

  if (!lanyardImage.complete) {
    await new Promise((resolve) => {
      lanyardImage.addEventListener("load", resolve, { once: true });
      lanyardImage.addEventListener("error", resolve, { once: true });
    });
  }

  if (typeof lanyardImage.decode === "function") {
    try {
      await lanyardImage.decode();
    } catch {
      // The load event is enough when a browser cannot decode explicitly.
    }
  }
}

function waitForFirstPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function revealText() {
  titleLines.forEach((line, index) => {
    line.animate(
      [
        { opacity: 0, transform: "translateY(0.55em) rotate(1.5deg)", filter: "blur(8px)" },
        { opacity: 1, transform: "translateY(0) rotate(0deg)", filter: "blur(0)" },
      ],
      {
        duration: 920,
        delay: mobileLayout ? 3920 + index * 230 : 720 + index * 240,
        fill: "forwards",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );
  });

  const copyDelays = mobileLayout
    ? [3740, 4620, 4840, 5040]
    : [480, 1180, 1420, 1640];

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
          transform: "translateY(-8vh) rotate(-3deg) scale(1.06)",
          offset: 0,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
        {
          opacity: 1,
          filter: "blur(0) saturate(1)",
          transform: "translateY(1vh) rotate(3.2deg) scale(1)",
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
    entranceAnimation = mobileEntrance;

    mobileEntrance.finished.then(() => {
      const holdSwing = rig.animate(
        [
          { transform: "translateY(0) rotate(0deg) scale(1)" },
          { transform: "translateY(0) rotate(1.15deg) scale(1)", offset: 0.25 },
          { transform: "translateY(0) rotate(0deg) scale(1)", offset: 0.5 },
          { transform: "translateY(0) rotate(-0.9deg) scale(1)", offset: 0.75 },
          { transform: "translateY(0) rotate(0deg) scale(1)" },
        ],
        {
          duration: 2200,
          fill: "forwards",
          easing: "ease-in-out",
        },
      );

      holdSwing.finished.then(() => {
        rig.animate(
          [
            {
              opacity: 1,
              filter: "blur(0) saturate(1)",
              transform: "translateY(0) rotate(0deg) scale(1)",
            },
            {
              opacity: 0.1,
              filter: "blur(18px) saturate(0.78)",
              transform: "translateY(-1vh) rotate(0deg) scale(1.02)",
            },
          ],
          {
            duration: 720,
            fill: "forwards",
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          },
        );
      });
    });

    return;
  }

  const standardEntranceFrames = [
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
    ];

  const alternateEntranceFrames = [
    {
      opacity: 0.42,
      filter: "blur(8px) saturate(0.76)",
      transform: "translate3d(13vw, -8vh, 0) rotate(-4deg) scale(1.52)",
      offset: 0,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    {
      opacity: 0.62,
      filter: "blur(5px) saturate(0.84)",
      transform: "translate3d(10vw, -6vh, 0) rotate(-1.8deg) scale(1.38)",
      offset: 0.12,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    {
      opacity: 0.94,
      filter: "blur(1px) saturate(0.97)",
      transform: "translate3d(2vw, -1vh, 0) rotate(3.4deg) scale(1.08)",
      offset: 0.42,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    {
      opacity: 1,
      filter: "blur(0) saturate(1)",
      transform: "translate3d(0, 0, 0) rotate(4.8deg) scale(1)",
      offset: 0.54,
      easing: "ease-in-out",
    },
    {
      opacity: 1,
      filter: "blur(0) saturate(1)",
      transform: "translate3d(0, 0, 0) rotate(-2.2deg) scale(1)",
      offset: 0.69,
      easing: "ease-in-out",
    },
    {
      opacity: 1,
      filter: "blur(0) saturate(1)",
      transform: "translate3d(0, 0, 0) rotate(0.9deg) scale(1)",
      offset: 0.84,
      easing: "ease-in-out",
    },
    {
      opacity: 1,
      filter: "blur(0) saturate(1)",
      transform: "translate3d(0, 0, 0) rotate(-0.32deg) scale(1)",
      offset: 0.94,
      easing: "ease-in-out",
    },
    {
      opacity: 1,
      filter: "blur(0) saturate(1)",
      transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)",
      offset: 1,
    },
  ];

  const entrance = rig.animate(
    alternateMotion ? alternateEntranceFrames : standardEntranceFrames,
    {
      duration: alternateMotion ? 2850 : 2550,
      fill: "forwards",
      easing: "linear",
    },
  );
  entranceAnimation = entrance;

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

async function startHero() {
  await Promise.all([
    waitForLanyard(),
    document.fonts?.ready ?? Promise.resolve(),
  ]);
  await waitUntilVisible();
  await waitForFirstPaint();

  if (alternateMotion && !mobileLayout) {
    rig.style.opacity = "0.42";
    rig.style.filter = "blur(8px) saturate(0.76)";
    rig.style.transform = "translate3d(13vw, -8vh, 0) rotate(-4deg) scale(1.52)";
    await waitForFirstPaint();
    await new Promise((resolve) => window.setTimeout(resolve, 180));
  }

  revealText();
  animateLanyard();
  if (!mobileLayout) {
    installPointerPhysics();
    installMagneticButton();
  }
}

if (reduceMotion) {
  rig.style.opacity = "1";
  rig.style.transform = "none";
  rig.style.filter = "none";
  titleLines.forEach((line) => (line.style.opacity = "1"));
  copyBlocks.forEach((block) => (block.style.opacity = "1"));
} else {
  startHero();
}
