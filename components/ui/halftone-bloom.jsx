"use client";

// Halftone Bloom (Originkit), adapted for this site:
// - plain JS, fills its parent (no 1200x800 minimum), colors passed as props
// - performance guards so it stays usable on low-end phones:
//   * starts only after the page is idle (hero text paints first), then fades in
//   * the heavy "field" pass renders at 1/2–1/4 resolution (smooth field, upscaled for free)
//   * device pixel ratio capped at 1.5, frame rate capped (30fps on phones / weak CPUs)
//   * adaptive: if frames stay slow, the field resolution and frame rate drop further
//   * pauses when off screen or when the tab is hidden
//   * prefers-reduced-motion: one still frame, no loop
//   * no WebGL2 / context lost: the plain background color stays

import React, { useEffect, useRef } from "react";

const NAME = "HalftoneBloom";
const MAX_DPR = 1.5;

// Field: fold count and overall exposure of the ribbons.
const LAYERS = 86;
const GAIN = 0.48;

// Screen: grid turn in radians, dot growth at full weight, how far the resting
// screen is faded in over the smooth field, and the largest dot in cells.
const TURN = 0.32;
const SWELL = 1.1;
const REST = 0.42;
const CAP = 0.55;

const VERT_SRC = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }
`;

const FIELD_SRC = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC1;
uniform vec3 uC2;
uniform float uSize;
uniform float uAngle;
out vec4 o;

const float LAYERS = ${LAYERS.toFixed(1)};
const float GAIN = ${GAIN.toFixed(3)};
const vec2 CENTRE = vec2(-0.25, 0.56);
const float TILT = 1.4;
const float ZOOM = 1.05;
const float THETA = 2.13;
const float SHEAR = 0.965;
const float SHRINK = 0.957;
const vec2 WARP_FREQ = vec2(0.45, 2.5);
const vec2 WARP_AMP = vec2(0.13, 0.028);
const vec2 ASPECT = vec2(2.2, 0.18);
const float OFFSET = 0.37;
const float GLOW = 0.0021;
const float SOFT = 0.0019;
const float FALLOFF = 0.37;
const float PHASE = 23.0;
const float CYCLE = 0.16;
const float HUE_TRAVEL = 2.0;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

void main() {
  vec2 R = uRes;
  vec2 pos = (gl_FragCoord.xy - 0.5 * R) / R.y;

  pos = rot(uAngle) * pos / uSize;
  float t = uTime * 0.49 + PHASE;
  float breath = (-sin(uTime * 0.735) + sin(uTime * 0.49 + 1.0)) * 0.25 + 0.5;
  vec2 u = rot(TILT) * ((pos - CENTRE) * (ZOOM - breath * 0.085));
  mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));

  vec3 col = vec3(0.0);
  for (float i = 1.0; i <= LAYERS; i += 1.0) {
    u.x -= sin(u.y * WARP_FREQ.x + t + i * 0.007) * WARP_AMP.x;
    u.y -= sin(u.x * WARP_FREQ.y - t + i * 0.02) * WARP_AMP.y;
    u = fold * u * SHRINK;
    vec2 q = (u - vec2(OFFSET + breath * 0.1, 0.0)) * ASPECT;
    float g = GLOW / (dot(q, q) + SOFT) * (0.25 + breath * 0.4);
    float r = length(u);
    float k = sin(i * CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    col += g * mix(uC1, uC2, k) * (0.62 + 0.5 * k) * exp2(-r * FALLOFF);
  }
  vec3 x = max(col * GAIN, 0.0);
  col = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  col = pow(clamp(col, 0.0, 1.0), vec3(0.85, 0.92, 0.98));
  col *= 1.0 - smoothstep(0.5, 1.6, length(pos)) * 0.07;
  o = vec4(col, 1.0);
}
`;

const FINISH_SRC = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBg;
uniform float uPaper;
uniform vec2 uMouse;
uniform float uOn;
uniform float uReach;
uniform float uCell;
uniform float uPR;
out vec4 o;

const float PI = 3.14159265359;
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
const float TURN = ${TURN.toFixed(4)};
const float SWELL = ${SWELL.toFixed(4)};
const float REST = ${REST.toFixed(4)};
const float CAP = ${CAP.toFixed(4)};

float ign(vec2 p, float f) { p += 5.588238 * mod(f, 64.0); return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y)); }

vec3 scene(vec2 uv) { return max(texture(uField, clamp(uv, 0.0, 1.0)).rgb, 0.0); }

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;

  mat2 turn = mat2(cos(TURN), -sin(TURN), sin(TURN), cos(TURN));
  vec2 rp = turn * frag;
  vec2 c = (floor(rp / uCell) + 0.5) * uCell;
  vec2 src = transpose(turn) * c;
  vec3 soft = scene(uv);
  vec3 ink = scene(src / uRes);
  float lvl = clamp(dot(ink, LUMA), 0.0, 1.0);
  float radius = uCell * sqrt(pow(lvl, 0.9) / PI);
  float presence = smoothstep(0.03, 0.16, lvl) * REST;

  if (uOn > 0.0) {
    vec2 d = (src - uMouse) / uReach;
    float w = uOn * exp(-dot(d, d));
    if (w > 1e-4) {
      radius *= 1.0 + SWELL * w;
      presence = mix(presence, 1.0, min(w, 1.0));
    }
  }
  radius = min(radius, uCell * CAP);
  float aa = 0.7 * uPR;
  float dm = 1.0 - smoothstep(radius - aa, radius + aa, length(rp - c));
  vec3 dots = ink * min(0.8 / max(lvl, 1e-3), 2.2) * dm;
  vec3 L = mix(soft, dots, presence);

  vec3 dark = uBg + L * (1.0 - uBg);
  float strength = clamp(max(L.r, max(L.g, L.b)), 0.0, 1.0);
  vec3 paper = uBg * (1.0 - strength) + L * 0.96;
  vec3 col = mix(dark, paper, uPaper);
  col += (ign(frag, floor(uTime * 24.0)) - 0.5) / 255.0;
  o = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const clampN = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const num = (v, fb) => (typeof v === "number" && Number.isFinite(v) ? v : fb);

// "#rgb" / "#rrggbb" -> [r, g, b] in 0..1
function hexToRgb(hex, fallback) {
  let h = String(hex || "").trim().replace(/^#/, "");
  if (h.length === 3 || h.length === 4) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = h.length >= 6 ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) : [];
  return n.length === 3 && n.every(Number.isFinite) ? n.map((c) => c / 255) : fallback;
}

function link(gl, frag, label) {
  const shader = (type, src) => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(`${NAME} ${label} shader:`, gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };
  const vs = shader(gl.VERTEX_SHADER, VERT_SRC);
  const fs = shader(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(`${NAME} ${label} link:`, gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

const locations = (gl, prog, names) =>
  Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(prog, n)]));

// Low-resolution field target. Half float where the GPU can render to it (no banding), 8-bit otherwise.
function fieldTarget(gl) {
  const fbo = gl.createFramebuffer();
  let tex = null;
  let w = 0;
  let h = 0;
  let half = !!gl.getExtension("EXT_color_buffer_float");
  return {
    fbo,
    texture: () => tex,
    width: () => w,
    height: () => h,
    resize(nw, nh) {
      if (nw === w && nh === h && tex) return;
      for (let attempt = 0; attempt < 2; attempt++) {
        if (tex) gl.deleteTexture(tex);
        tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D, 0, half ? gl.RGBA16F : gl.RGBA8, nw, nh, 0, gl.RGBA,
          half ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null
        );
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (ok || !half) break;
        half = false;
      }
      w = nw;
      h = nh;
    },
    dispose() {
      if (tex) gl.deleteTexture(tex);
      gl.deleteFramebuffer(fbo);
    },
  };
}

// Pointer in CSS px relative to the root
function trackPointer(root) {
  const p = { tx: 0, ty: 0, inside: false };
  const read = (e) => {
    const r = root.getBoundingClientRect();
    p.tx = e.clientX - r.left;
    p.ty = e.clientY - r.top;
    p.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };
  const out = (e) => {
    if (!e.relatedTarget) p.inside = false;
  };
  window.addEventListener("pointermove", read, { passive: true });
  window.addEventListener("pointerdown", read, { passive: true });
  document.addEventListener("pointerout", out);
  return {
    p,
    dispose() {
      window.removeEventListener("pointermove", read);
      window.removeEventListener("pointerdown", read);
      document.removeEventListener("pointerout", out);
    },
  };
}

const DEFAULT_BG = [1, 1, 1];
const DEFAULT_C1 = [0x77 / 255, 0xa9 / 255, 0xfd / 255];
const DEFAULT_C2 = [0, 0x4a / 255, 0x70 / 255];

export default function HalftoneBloom({
  className = "",
  style,
  background = "#FFFFFF",
  color1 = "#77A9FD",
  color2 = "#004A70",
  speed = 50, // 0 = still, 50 = original rate, 100 = double
  size = 200, // 50..200
  angle = 180, // degrees, -180..180
  dotSize = 6, // px, 3..24
  hover = 200, // pointer swell strength, 0..200 (0 = off)
  reach = 429, // pointer radius in px
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  // Latest props for the render loop, without restarting WebGL on every change
  const vRef = useRef(null);
  useEffect(() => {
    vRef.current = {
      bg: hexToRgb(background, DEFAULT_BG),
      c1: hexToRgb(color1, DEFAULT_C1),
      c2: hexToRgb(color2, DEFAULT_C2),
      speed: clampN(num(speed, 50), 0, 100) / 50,
      size: clampN(num(size, 100), 50, 200) / 100,
      angle: (clampN(num(angle, 0), -180, 180) * Math.PI) / 180,
      dot: clampN(num(dotSize, 6), 3, 24),
      hover: clampN(num(hover, 100), 0, 200) / 100,
      reach: clampN(num(reach, 200), 10, 800),
    };
  }, [background, color1, color2, speed, size, angle, dotSize, hover, reach]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    let disposed = false;
    let cleanupGl = null;

    const init = () => {
      if (disposed) return;
      const gl = canvas.getContext("webgl2", {
        antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "low-power",
      });
      if (!gl) return; // no WebGL2: the root's background color stays

      const field = link(gl, FIELD_SRC, "field");
      const finish = link(gl, FINISH_SRC, "finish");
      if (!field || !finish) return;
      const uf = locations(gl, field, ["uRes", "uTime", "uC1", "uC2", "uSize", "uAngle"]);
      const un = locations(gl, finish, [
        "uField", "uRes", "uTime", "uBg", "uPaper", "uMouse", "uOn", "uReach", "uCell", "uPR",
      ]);
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const target = fieldTarget(gl);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const weak = coarse || (navigator.hardwareConcurrency || 8) <= 4;

      // Quality knobs (adaptive): field resolution divisor and frame interval
      let fieldDiv = weak ? 3 : 2;
      let frameMs = weak ? 1000 / 30 : 1000 / 60;
      let slowFrames = 0;

      const pointer = (vRef.current?.hover ?? 0) > 0 && !reduceMotion ? trackPointer(root) : null;
      const ptr = pointer ? pointer.p : { tx: 0, ty: 0, inside: false };

      let mx = 0;
      let my = 0;
      let on = 0;
      let raf = 0;
      let last = -1;
      let lastDraw = -1;
      let clock = 0;
      let visible = true;
      let shown = false;

      const draw = (dt) => {
        const v = vRef.current;
        if (!v) return;
        clock = (clock + dt * v.speed) % 3600;

        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const cw = canvas.clientWidth || 1;
        const ch = canvas.clientHeight || 1;
        const bw = Math.max(1, Math.round(cw * dpr));
        const bh = Math.max(1, Math.round(ch * dpr));
        if (canvas.width !== bw || canvas.height !== bh) {
          canvas.width = bw;
          canvas.height = bh;
        }
        target.resize(Math.max(1, Math.round(bw / fieldDiv)), Math.max(1, Math.round(bh / fieldDiv)));

        // Pointer presence fades in/out; position is lightly smoothed
        const present = ptr.inside ? 1 : 0;
        if (present && on < 0.02) {
          mx = ptr.tx;
          my = ptr.ty;
        }
        on += (present - on) * (1 - Math.exp(-dt * 5));
        const k = 1 - Math.exp(-dt * 16);
        mx += (ptr.tx - mx) * k;
        my += (ptr.ty - my) * k;

        const bgLum = 0.2126 * v.bg[0] + 0.7152 * v.bg[1] + 0.0722 * v.bg[2];

        // Pass 1: the field, at reduced resolution
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.width(), target.height());
        gl.useProgram(field);
        gl.uniform2f(uf.uRes, target.width(), target.height());
        gl.uniform1f(uf.uTime, clock);
        gl.uniform3f(uf.uC1, v.c1[0], v.c1[1], v.c1[2]);
        gl.uniform3f(uf.uC2, v.c2[0], v.c2[1], v.c2[2]);
        gl.uniform1f(uf.uSize, v.size);
        gl.uniform1f(uf.uAngle, v.angle);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // Pass 2: halftone, upsample and composite (device px, GL y-up)
        const pr = bw / cw;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, bw, bh);
        gl.useProgram(finish);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, target.texture());
        gl.uniform1i(un.uField, 0);
        gl.uniform2f(un.uRes, bw, bh);
        gl.uniform1f(un.uTime, clock);
        gl.uniform3f(un.uBg, v.bg[0], v.bg[1], v.bg[2]);
        gl.uniform1f(un.uPaper, clampN((bgLum - 0.35) / 0.3, 0, 1));
        gl.uniform2f(un.uMouse, mx * pr, (ch - my) * pr);
        gl.uniform1f(un.uOn, on * v.hover);
        gl.uniform1f(un.uReach, v.reach * pr);
        gl.uniform1f(un.uCell, v.dot * pr);
        gl.uniform1f(un.uPR, pr);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if (!shown) {
          shown = true;
          canvas.style.opacity = "1";
        }
      };

      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        if (lastDraw >= 0 && now - lastDraw < frameMs - 2) return; // frame-rate cap
        const dt = last < 0 ? 0 : clampN((now - last) / 1000, 0, 0.05);
        const gap = lastDraw < 0 ? 0 : now - lastDraw;
        last = now;
        lastDraw = now;
        draw(dt);

        // Adaptive quality: sustained slow frames -> cheaper field, then lower frame rate
        if (gap > frameMs * 1.6) slowFrames++;
        else slowFrames = Math.max(0, slowFrames - 1);
        if (slowFrames > 20) {
          slowFrames = 0;
          if (fieldDiv < 4) fieldDiv++;
          else frameMs = Math.max(frameMs, 1000 / 24);
        }
      };

      const start = () => {
        if (raf || reduceMotion || !visible || document.hidden) return;
        last = -1;
        lastDraw = -1;
        raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        if (!raf) return;
        cancelAnimationFrame(raf);
        raf = 0;
      };

      // Reduced motion: one still frame, redrawn only when the size changes
      const resizeObserver = reduceMotion
        ? new ResizeObserver(() => draw(0))
        : null;
      if (reduceMotion) {
        clock = 4; // a pleasant still frame
        resizeObserver.observe(canvas);
        draw(0);
      }

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      });
      io.observe(root);

      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibility);

      const onLost = (e) => {
        e.preventDefault();
        stop();
      };
      canvas.addEventListener("webglcontextlost", onLost);

      start();

      cleanupGl = () => {
        stop();
        io.disconnect();
        resizeObserver?.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("webglcontextlost", onLost);
        pointer?.dispose();
        target.dispose();
        gl.deleteVertexArray(vao);
        gl.deleteProgram(field);
        gl.deleteProgram(finish);
      };
    };

    // Start after the page is idle so the hero text and LCP paint first
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(init, { timeout: 1500 })
      : window.setTimeout(init, 300);

    return () => {
      disposed = true;
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanupGl?.();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background, ...style }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full opacity-0 transition-opacity duration-700 ease-out"
      />
    </div>
  );
}
