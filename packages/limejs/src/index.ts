/* Minimal limejs (Closure-like) UMD shim */

type Nullable<T> = T | null;

declare global {
  interface Window {
    goog?: any;
    limejs?: any;
    lime?: any;
    mygame?: any;
  }
}

function ensureNamespace(root: any, path: string) {
  return path.split(".").reduce((obj, key) => (obj[key] ??= {}), root);
}

/** --- goog shim (정말 단순한 provide/require) --- */
const goog = (function () {
  function provide(ns: string) {
    ensureNamespace(window as any, ns);
  }
  function require(_ns: string) {
    // 번들링 환경이 아니라서 실제 의존성 로딩은 하지 않음 (no-op)
  }
  return { provide, require };
})();

/** --- lime core --- */
class Node {
  el: HTMLElement;
  children: Node[] = [];

  private _x = 0;
  private _y = 0;
  private _w = 0;
  private _h = 0;
  private _ax = 0;
  private _ay = 0;

  constructor(tag: string = "div") {
    this.el = document.createElement(tag);
    this.el.style.position = "absolute";
  }

  private _applyLayout() {
    this.el.style.left = `${this._x}px`;
    this.el.style.top = `${this._y}px`;

    const tx = -this._ax * 100;
    const ty = -this._ay * 100;
    this.el.style.transform = `translate(${tx}%, ${ty}%)`;
    this.el.style.transformOrigin = `${this._ax * 100}% ${this._ay * 100}%`;

    if (this._w) this.el.style.width = `${this._w}px`;
    if (this._h) this.el.style.height = `${this._h}px`;
  }


  appendChild(child: Node) {
    this.children.push(child);
    this.el.appendChild(child.el);
    return this;
  }

  setPosition(x: number, y: number) {
    this._x = x;
    this._y = y;
    this._applyLayout();
    return this;
  }
  getPosition() {
    return { x: this._x, y: this._y };
  }

  setSize(w: number, h: number) {
    this._w = w;
    this._h = h;
    this._applyLayout();
    return this;
  }
  getSize() {
    return { width: this._w, height: this._h };
  }

  setAnchorPoint(ax: number, ay: number) {
    this._ax = ax;
    this._ay = ay;
    this._applyLayout();
    return this;
  }
  getAnchorPoint() {
    return { x: this._ax, y: this._ay };
  }
}

class Sprite extends Node {
  constructor() {
    super("div");
  }
  setFill(color: string) {
    (this.el.style as any).background = color;
    return this;
  }
  runAction(action: any) {
  if (action && typeof action.run === "function") {
    action.run(this);
  }
  return this;
}
}

class Text extends Node {
  constructor() {
    super("div");
    this.el.style.whiteSpace = "pre";
  }
  setText(text: string) {
    this.el.textContent = text;
    return this;
  }
}

/** --- animation --- */
namespace animation {
  export class MoveBy {
    dx: number;
    dy: number;
    durationSec = 1;

    constructor(dx: number, dy: number) {
      this.dx = dx;
      this.dy = dy;
    }
    setDuration(sec: number) {
      this.durationSec = sec;
      return this;
    }

    run(target: Node) {
      const start = target.getPosition();
      const endX = start.x + this.dx;
      const endY = start.y + this.dy;

      const t0 = performance.now();
      const dur = this.durationSec * 1000;

      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const x = start.x + (endX - start.x) * p;
        const y = start.y + (endY - start.y) * p;
        target.setPosition(x, y);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }
}

/** --- scheduleManager --- */
const scheduleManager = {
  callAfter(fn: () => void, delayMs: number) {
    return setTimeout(fn, delayMs);
  },
};

class Scene extends Node {
  constructor(mount: HTMLElement) {
    super("div");
    this.el.style.position = "relative";
    this.el.style.width = "100%";
    this.el.style.height = "100%";
    mount.innerHTML = "";
    mount.appendChild(this.el);
  }
}

const lime = {
  Node,
  Sprite,
  Text,
  Scene,
  animation: { MoveBy: animation.MoveBy },
  scheduleManager,
  version: "0.1.0",
};

/** --- UMD 전역 노출 --- */
if (typeof window !== "undefined") {
  (window as any).goog = (window as any).goog ?? goog;
  (window as any).lime = (window as any).lime ?? lime;
  (window as any).limejs = (window as any).limejs ?? { version: "0.1.0" };
}

export {}; // ESM 만족용(실제 사용은 전역)
