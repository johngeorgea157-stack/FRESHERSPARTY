import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js";
import { requestPetReply } from "./pet-ai.js";

const stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = "/pet/pet.css";
document.head.append(stylesheet);

const MODEL_URLS = {
  friendly: "/pet/models/friendly.glb",
  "extra-friendly": "/pet/models/extra-friendly.glb"
};

const reducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class PetCompanion {
  constructor() {
    this.mode =
      localStorage.getItem("pet-mode") || "friendly";

    this.state = "IDLE";
    this.lastContextKey = "";
    this.clock = new THREE.Clock();

    this.mount();
    this.setupScene();
    this.bind();
    this.animate();

    this.initialGreeting();
  }

  // --------------------------------------------------
  // INITIAL GREETING
  // --------------------------------------------------

  const page = document.body.dataset.page ||
  (window.location.pathname.startsWith("/ticket/")
    ? "ticket"
    : "registration");
    if (page === "ticket") {
      this.say(
        this.mode === "friendly"
          ? "You made it! 🎉 Your Freshers Party ticket is ready!"
          : "You actually got the ticket. I was starting to doubt you. 😂",
        "Celebrate",
        this.mode === "friendly"
          ? "Excited"
          : "Smirk"
      );

      setTimeout(() => {
        this.ticketReaction();
      }, 1800);

      return;
    }

    this.say(
      this.mode === "friendly"
        ? "Hi! I’m your Freshers Party fox. Tell me a little about you!"
        : "Extra Friendly mode? Interesting choice. 😈 Let's see what you've got.",
      "Welcome",
      this.mode === "friendly"
        ? "Smile"
        : "Smirk"
    );
  }

  // --------------------------------------------------
  // CREATE PET UI
  // --------------------------------------------------

  mount() {
    this.el = document.createElement("aside");

    this.el.id = "pet-companion";

    this.el.setAttribute(
      "aria-live",
      "polite"
    );

    this.el.innerHTML = `
      <div class="pet-companion__bubble"></div>

      <canvas
        class="pet-companion__canvas"
        aria-label="Animated fox companion">
      </canvas>
    `;

    document.body.append(this.el);

    this.canvas =
      this.el.querySelector(
        ".pet-companion__canvas"
      );

    this.bubble =
      this.el.querySelector(
        ".pet-companion__bubble"
      );
  }

  // --------------------------------------------------
  // THREE.JS SETUP
  // --------------------------------------------------

  setupScene() {
    this.renderer =
      new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true
      });

    this.renderer.setPixelRatio(
      Math.min(devicePixelRatio, 1.5)
    );

    this.scene = new THREE.Scene();

    this.camera =
      new THREE.PerspectiveCamera(
        35,
        1,
        0.1,
        100
      );

    this.camera.position.set(
      0,
      1.2,
      5
    );

    this.scene.add(
      new THREE.HemisphereLight(
        0xe9f9ff,
        0x192438,
        2.4
      )
    );

    const key =
      new THREE.DirectionalLight(
        0xffffff,
        2.2
      );

    key.position.set(
      3,
      5,
      4
    );

    this.scene.add(key);

    this.root =
      new THREE.Group();

    this.scene.add(this.root);

    this.loadModel(this.mode);

    this.resize();

    new ResizeObserver(() =>
      this.resize()
    ).observe(this.el);
  }

  // --------------------------------------------------
  // LOAD MODEL
  // --------------------------------------------------

  async loadModel(mode) {
    this.root.clear();

    this.model = null;
    this.mixer = null;
    this.actions = null;

    this.el.classList.remove(
      "is-awaiting-model"
    );

    try {
      const loader =
        new GLTFLoader();

      const gltf =
        await loader.loadAsync(
          MODEL_URLS[mode]
        );

      this.model =
        gltf.scene;

      this.root.add(
        this.model
      );

      this.mixer =
        new THREE.AnimationMixer(
          this.model
        );

      this.actions =
        Object.fromEntries(
          gltf.animations.map(
            clip => [
              clip.name,
              this.mixer.clipAction(
                clip
              )
            ]
          )
        );

      console.log(
        "Pet loaded:",
        mode
      );

      console.log(
        "Animations:",
        Object.keys(
          this.actions
        )
      );

      this.playAnimation(
        "Idle"
      );

    } catch (error) {
      console.error(
        "Pet model failed to load:",
        error
      );

      this.el.classList.add(
        "is-awaiting-model"
      );

      this.bubble.textContent =
        "Your buddy’s premium 3D model is being fitted. 🦊";

      this.bubble.classList.add(
        "is-visible"
      );
    }
  }

  // --------------------------------------------------
  // RESIZE
  // --------------------------------------------------

  resize() {
    const {
      width,
      height
    } =
      this.el.getBoundingClientRect();

    this.renderer.setSize(
      width,
      height,
      false
    );

    this.camera.aspect =
      width / height;

    this.camera.updateProjectionMatrix();
  }

  // --------------------------------------------------
  // ANIMATION LOOP
  // --------------------------------------------------

  animate() {
    requestAnimationFrame(
      () => this.animate()
    );

    const delta =
      this.clock.getDelta();

    const t =
      this.clock.elapsedTime;

    if (
      !reducedMotion &&
      this.model
    ) {
      this.model.position.y =
        Math.sin(t * 1.6) *
        0.035;

      this.model.rotation.y =
        Math.sin(t * 0.7) *
        0.18;
    }

    this.mixer?.update(
      delta
    );

    this.renderer.render(
      this.scene,
      this.camera
    );
  }

  // --------------------------------------------------
  // PLAY ANIMATION
  // --------------------------------------------------

  playAnimation(name) {
    this.state =
      name.toUpperCase();

    if (
      this.actions?.[name]
    ) {
      Object.values(
        this.actions
      ).forEach(action =>
        action.fadeOut(0.18)
      );

      this.actions[name]
        .reset()
        .fadeIn(0.18)
        .play();

      return;
    }

    // Fallback if animation
    // doesn't exist in GLB.

    if (
      name === "Excited" ||
      name === "Celebrate"
    ) {
      this.el.style.transform =
        "translateY(-12px) rotate(-2deg)";

      setTimeout(() => {
        this.el.style.transform =
          "";
      }, 550);
    }
  }

  // --------------------------------------------------
  // FACIAL EXPRESSION
  // --------------------------------------------------

  setExpression(expression) {
    this.model?.traverse(
      node => {

        if (
          !node.isMesh ||
          !node.morphTargetDictionary ||
          !node.morphTargetInfluences
        ) {
          return;
        }

        Object.entries(
          node.morphTargetDictionary
        ).forEach(
          ([name, index]) => {

            node.morphTargetInfluences[
              index
            ] =
              name.toLowerCase() ===
              expression.toLowerCase()
                ? 1
                : 0;
          }
        );
      }
    );
  }

  // --------------------------------------------------
  // SPEECH
  // --------------------------------------------------

  say(
    message,
    animation = "Idle",
    expression = "Smile"
  ) {
    this.bubble.textContent =
      message;

    this.bubble.classList.add(
      "is-visible"
    );

    this.playAnimation(
      animation
    );

    this.setExpression(
      expression
    );

    clearTimeout(
      this.timer
    );

    this.timer =
      setTimeout(() => {
        this.bubble.classList.remove(
          "is-visible"
        );
      }, 6200);
  }

  // --------------------------------------------------
  // CONTEXT
  // --------------------------------------------------

  context() {
    const name =
      document
        .querySelector(
          "#fullName"
        )
        ?.value
        .trim()
        .slice(0, 60) || "";

    const course =
      document
        .querySelector(
          "#course"
        )
        ?.value
        .trim()
        .slice(0, 80) || "";

    const batch =
      document
        .querySelector(
          "#batch"
        )
        ?.value || "";

    // Ticket page

    const ticketName =
      document
        .querySelector(
          "#ticket-name"
        )
        ?.textContent
        .trim()
        .slice(0, 60) || "";

    const ticketCourse =
      document
        .querySelector(
          "#ticket-course"
        )
        ?.textContent
        .trim()
        .slice(0, 80) || "";

    const ticketBatch =
      document
        .querySelector(
          "#ticket-batch"
        )
        ?.textContent
        .trim()
        .slice(0, 60) || "";

    return {
      name:
        name ||
        ticketName,

      course:
        course ||
        ticketCourse,

      batch:
        batch ||
        ticketBatch,

      mode:
        this.mode,

      page:
        document.body.dataset.page ||
        "unknown"
    };
  }

  // --------------------------------------------------
  // REGISTRATION REACTION
  // --------------------------------------------------

  async react() {
    if (
      this.mode === "off"
    ) {
      return;
    }

    const context =
      this.context();

    if (
      !context.name &&
      !context.course &&
      !context.batch
    ) {
      return;
    }

    const key =
      JSON.stringify(
        context
      );

    if (
      key ===
      this.lastContextKey
    ) {
      return;
    }

    this.lastContextKey =
      key;

    this.playAnimation(
      this.mode ===
        "friendly"
        ? "Curious"
        : "Smug"
    );

    try {
      const reply =
        await requestPetReply(
          context
        );

      this.say(
        reply.message,
        reply.animation,
        reply.expression
      );

    } catch {
      this.say(
        this.mode ===
          "friendly"
          ? "I’m still cheering you on!"
          : "My joke generator is taking a snack break. 🦊",
        "Idle",
        "Smile"
      );
    }
  }

  // --------------------------------------------------
  // TICKET REACTION
  // --------------------------------------------------

  async ticketReaction() {
    if (
      this.mode === "off"
    ) {
      return;
    }

    const context =
      this.context();

    if (
      !context.name &&
      !context.course &&
      !context.batch
    ) {
      return;
    }

    try {
      const reply =
        await requestPetReply({
          ...context,
          event: "ticket_view"
        });

      this.say(
        reply.message,
        reply.animation,
        reply.expression
      );

    } catch {
      this.say(
        this.mode ===
          "friendly"
          ? "Your ticket is ready! I’ll see you at Freshers! 🎉"
          : "You actually got the ticket. I was starting to doubt you. 😂",
        "Celebrate",
        this.mode ===
          "friendly"
          ? "Excited"
          : "Smirk"
      );
    }
  }

  // --------------------------------------------------
  // CHANGE MODE
  // --------------------------------------------------

  setMode(mode) {
  this.mode = mode;
  localStorage.setItem("pet-mode", mode);
  this.lastContextKey = "";
  this.el.hidden = mode === "off";

  if (mode === "off") return;

  this.loadModel(mode);

  const isTicket =
    document.body.dataset.page === "ticket" ||
    window.location.pathname.startsWith("/ticket/");

  if (isTicket) {
    this.say(
      mode === "friendly"
        ? "Your ticket is ready! 🎉 See you at Freshers!"
        : "Ticket secured. Somehow you survived registration. 😂",
      "Celebrate",
      mode === "friendly" ? "Excited" : "Smirk"
    );

    setTimeout(() => this.ticketReaction(), 1200);
    return;
  }

  this.say(
    mode === "friendly"
      ? "Friendly mode on — let’s make this easy!"
      : "Extra Friendly mode on. I’ve brought jokes. 😈",
    "Welcome",
    mode === "friendly" ? "Smile" : "Smirk"
  );
}
  // --------------------------------------------------
  // EVENTS
  // --------------------------------------------------

  bind() {
    let nameTimer;
    document
      .querySelector(
        "#fullName"
      )
      ?.addEventListener(
        "input",
        () => {

          clearTimeout(
            nameTimer
          );

          nameTimer =
            setTimeout(
              () =>
                this.react(),
              900
            );
        }
      );

    // --------------------------
    // COURSE / BATCH
    // --------------------------

    [
      "#course",
      "#batch"
    ].forEach(
      selector => {

        const field =
          document.querySelector(
            selector
          );

        field?.addEventListener(
          "change",
          () => this.react()
        );

        field?.addEventListener(
          "blur",
          () => this.react()
        );
      }
    );

    // --------------------------
    // REGISTRATION
    // --------------------------

    document
      .querySelector(
        "#registration"
      )
      ?.addEventListener(
        "submit",
        () => {

          this.say(
            "Almost there — I’m guarding the payment button from bad vibes.",
            "Excited",
            "Excited"
          );
        }
      );

    // --------------------------
    // PET MODE BUTTONS
    // --------------------------

    document
      .querySelectorAll(
        "[data-pet-mode]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              document
                .querySelectorAll(
                  "[data-pet-mode]"
                )
                .forEach(
                  b => {

                    const active =
                      b === button;

                    b.classList.toggle(
                      "is-selected",
                      active
                    );

                    b.setAttribute(
                      "aria-pressed",
                      String(active)
                    );
                  }
                );

              this.setMode(
                button.dataset.petMode
              );
            }
          );
        }
      );

    // --------------------------
    // PAYMENT SUCCESS
    // --------------------------

    window.addEventListener(
      "pet:payment-success",
      () => {

        this.say(
          "Ticket secured! See you on the dance floor! 🎉",
          "Celebrate",
          "Excited"
        );
      }
    );

    // --------------------------
    // VISIBILITY
    // --------------------------

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.hidden
        ) {
          this.clock.stop();
        } else {
          this.clock.start();
        }
      }
    );
  }
}

// ------------------------------------------------------
// START PET
// ------------------------------------------------------

try {

  if (
    window.WebGLRenderingContext
  ) {
    new PetCompanion();
  }

} catch (error) {

  console.info(
    "3D pet unavailable; registration continues normally.",
    error
  );
}
