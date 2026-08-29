import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { requestPetReply } from "./pet-ai.js";

const css = document.createElement("link");
css.rel = "stylesheet";
css.href = "/pet/pet.css";
document.head.append(css);

const MODEL_URLS = {
  friendly: "/pet/models/friendly.glb",
  "extra-friendly": "/pet/models/extra-friendly.glb"
};

const reducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class PetCompanion {
  constructor() {
    this.mode = localStorage.getItem("pet-mode") || "friendly";
    this.lastContextKey = "";
    this.clock = new THREE.Clock();

    this.mount();
    this.setupScene();
    this.bind();
    this.animate();
    this.initialGreeting();
  }

  mount() {
    this.el = document.createElement("aside");
    this.el.id = "pet-companion";
    this.el.setAttribute("aria-live", "polite");
    this.el.innerHTML = `
      <div class="pet-companion__bubble"></div>
      <canvas class="pet-companion__canvas"
        aria-label="Animated fox companion"></canvas>
    `;
    document.body.append(this.el);
    this.canvas = this.el.querySelector("canvas");
    this.bubble = this.el.querySelector(".pet-companion__bubble");
  }

  setupScene() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set(0, 1.2, 5);

    this.scene.add(
      new THREE.HemisphereLight(0xe9f9ff, 0x192438, 2.4)
    );

    const light = new THREE.DirectionalLight(0xffffff, 2.2);
    light.position.set(3, 5, 4);
    this.scene.add(light);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.loadModel(this.mode);
    this.resize();

    new ResizeObserver(() => this.resize()).observe(this.el);
  }

  async loadModel(mode) {
    this.root.clear();
    this.model = null;
    this.mixer = null;
    this.actions = null;

    try {
      const gltf = await new GLTFLoader().loadAsync(MODEL_URLS[mode]);
      this.model = gltf.scene;
      this.root.add(this.model);

      this.mixer = new THREE.AnimationMixer(this.model);
      this.actions = Object.fromEntries(
        gltf.animations.map(clip => [
          clip.name,
          this.mixer.clipAction(clip)
        ])
      );

      this.playAnimation("Idle");
    } catch (error) {
      console.error("Pet model failed to load:", error);
      this.bubble.textContent = "Your fox is taking a quick nap. 🦊";
      this.bubble.classList.add("is-visible");
    }
  }

  resize() {
    const { width, height } = this.el.getBoundingClientRect();
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const t = this.clock.elapsedTime;

    if (!reducedMotion && this.model) {
      this.model.position.y = Math.sin(t * 1.6) * 0.035;
      this.model.rotation.y = Math.sin(t * 0.7) * 0.18;
    }

    this.mixer?.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  playAnimation(name) {
    if (this.actions?.[name]) {
      Object.values(this.actions).forEach(a => a.fadeOut(0.18));
      this.actions[name].reset().fadeIn(0.18).play();
    }

    if (name === "Excited" || name === "Celebrate") {
      this.el.style.transform = "translateY(-12px) rotate(-2deg)";
      setTimeout(() => (this.el.style.transform = ""), 550);
    }
  }

  setExpression(expression) {
    this.model?.traverse(node => {
      if (
        !node.isMesh ||
        !node.morphTargetDictionary ||
        !node.morphTargetInfluences
      ) return;

      Object.entries(node.morphTargetDictionary).forEach(([name, index]) => {
        node.morphTargetInfluences[index] =
          name.toLowerCase() === expression.toLowerCase() ? 1 : 0;
      });
    });
  }

  say(message, animation = "Idle", expression = "Smile") {
    this.bubble.textContent = message;
    this.bubble.classList.add("is-visible");
    this.playAnimation(animation);
    this.setExpression(expression);

    clearTimeout(this.timer);
    this.timer = setTimeout(
      () => this.bubble.classList.remove("is-visible"),
      6200
    );
  }

  context() {
    const getValue = selector =>
      document.querySelector(selector)?.value?.trim() || "";

    const getText = selector =>
      document.querySelector(selector)?.textContent?.trim() || "";

    return {
      name: (getValue("#fullName") || getText("#ticket-name")).slice(0, 60),
      course: (getValue("#course") || getText("#ticket-course")).slice(0, 80),
      batch: (getValue("#batch") || getText("#ticket-batch")).slice(0, 60),
      mode: this.mode,
      page: document.body.dataset.page || "unknown"
    };
  }

  async react() {
    if (this.mode === "off") return;

    const context = this.context();
    if (!context.name && !context.course && !context.batch) return;

    const key = JSON.stringify(context);
    if (key === this.lastContextKey) return;
    this.lastContextKey = key;

    this.playAnimation(this.mode === "friendly" ? "Curious" : "Smug");

    try {
      const reply = await requestPetReply(context);
      this.say(reply.message, reply.animation, reply.expression);
    } catch {
      this.say(
        this.mode === "friendly"
          ? "I’m still cheering you on! ✨"
          : "My joke generator needs a snack break. 😂",
        "Idle",
        "Smile"
      );
    }
  }

  async ticketReaction() {
    if (this.mode === "off") return;

    const context = this.context();
    if (!context.name && !context.course && !context.batch) return;

    try {
      const reply = await requestPetReply({
        ...context,
        event: "ticket_view"
      });

      this.say(reply.message, reply.animation, reply.expression);
    } catch {
      this.say(
        this.mode === "friendly"
          ? `Nice work${context.name ? `, ${context.name}` : ""}! Your ticket is ready. 🎉`
          : `${context.name || "You"} actually made it. Respect. 😂`,
        "Celebrate",
        this.mode === "friendly" ? "Excited" : "Smirk"
      );
    }
  }

  initialGreeting() {
    const ticket = document.body.dataset.page === "ticket";

    if (ticket) {
      this.say(
        this.mode === "friendly"
          ? "You made it! 🎉 Your ticket is ready!"
          : "You actually made it. Respect. 😂",
        "Celebrate",
        this.mode === "friendly" ? "Excited" : "Smirk"
      );

      setTimeout(() => this.ticketReaction(), 1800);
      return;
    }

    this.say(
      this.mode === "friendly"
        ? "Hi! I’m your Freshers Party fox. Tell me a little about you!"
        : "Alright, let's see what you've got. 😈",
      "Welcome",
      this.mode === "friendly" ? "Smile" : "Smirk"
    );
  }

  setMode(mode) {
    this.mode = mode;
    localStorage.setItem("pet-mode", mode);
    this.lastContextKey = "";
    this.el.hidden = mode === "off";

    if (mode === "off") return;

    this.loadModel(mode);

    if (document.body.dataset.page === "ticket") {
      this.say(
        mode === "friendly"
          ? "Nice! Your ticket is ready. 🎉"
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

  bind() {
    let timer;

    document.querySelector("#fullName")?.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => this.react(), 900);
    });

    ["#course", "#batch"].forEach(selector => {
      document.querySelector(selector)?.addEventListener("change", () => this.react());
      document.querySelector(selector)?.addEventListener("blur", () => this.react());
    });

    document.querySelector("#registration")?.addEventListener("submit", () => {
      this.say(
        "Almost there — I’m guarding the payment button from bad vibes.",
        "Excited",
        "Excited"
      );
    });

    document.querySelectorAll("[data-pet-mode]").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-pet-mode]").forEach(b => {
          const active = b === button;
          b.classList.toggle("is-selected", active);
          b.setAttribute("aria-pressed", String(active));
        });

        this.setMode(button.dataset.petMode);
      });
    });

    window.addEventListener("pet:payment-success", () => {
      this.say(
        "Ticket secured! See you on the dance floor! 🎉",
        "Celebrate",
        "Excited"
      );
    });

    document.addEventListener("visibilitychange", () => {
      document.hidden ? this.clock.stop() : this.clock.start();
    });
  }
}

try {
  if (window.WebGLRenderingContext) new PetCompanion();
} catch (error) {
  console.info("3D pet unavailable.", error);
}
