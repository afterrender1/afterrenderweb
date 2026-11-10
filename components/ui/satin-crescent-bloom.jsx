"use client";

// Satin Crescent Bloom from the supplied Originkit reference, adapted for the membership card.
// Uses the original crescent shader with the site's blue palette, a capped pixel budget,
// visibility pausing, reduced-motion support, and a CSS fallback.
import { useEffect, useRef } from "react";

const cl = (value, min, max) => Math.max(min, Math.min(max, value));
const TOP_PHASE = [0.3176, 0.2698, 0.2752, -0.2182, -0.6756, 0.0133, 0.2642, 0.076]
const RIGHT_PHASE = [0.2087, -0.1353, 0.3284, -0.2611, -0.8626, -0.0367, 0.268, -0.3745]
const TOP_ENV = [0.48, 0.8911, 0.8886, 1.9023, 0.6989, 3.7343, 0.4005, 1.6022, 0.5564, 0.5922, 1.2456, 1.9118]
const RIGHT_ENV = [0.39, 1.0224, 0.7461, 2.1255, 1.9145, 5.9036, 0.2932, 1.6862, 0.1189, 0.646, 1.2745, 1.9879]const BREATHE_PHASE = 0.45const ENV_N = 512
const ENV_AMAX = 2.6 // past lb × the largest Corner Fade factor (1.3)

/** Fills out (ENV_N × 2 texels, RG) with [D0, tip fade] for both rows. */
function bakeEnv(out, depthK, cornerK, bulge, bulgeW, fade) {
    const rows = [TOP_ENV, RIGHT_ENV]
    for (let row = 0; row < 2; row++) {
        const [H, ac, aw, de, ks, sm, , , , , la, lb] = rows[row]
        for (let i = 0; i < ENV_N; i++) {
            const a = ((i + 0.5) / ENV_N) * ENV_AMAX
            const dome = H * depthK * Math.exp(-Math.pow(Math.abs(a - ac + bulge) / (aw * bulgeW), de)) + 1e-4
            const ray = Math.max(ks * cornerK * a, 1e-4)
            const D = Math.pow(Math.pow(dome, -sm) + Math.pow(ray, -sm), -1 / sm)
            const t = cl((a - la * fade) / ((lb - la) * fade), 0, 1)
            const o = (row * ENV_N + i) * 2
            out[o] = D
            out[o + 1] = 1 - t * t * (3 - 2 * t)
        }
    }
}

const f = (x) => x.toFixed(4)
const phaseArgs = (P) => P.map(f).join(", ")const envArgs = (E, row) => [row + 0.5, E[0], E[6], E[7], E[8], E[9]].map((x, i) => (i === 0 ? (x / 2).toFixed(2) : f(x))).join(", ")

/*
 * Two crescents per pixel: the frame is split along its top-left →
 * bottom-right diagonal; the top-right half holds the top and right
 * crescents (fanning from the top-right corner), the other half their mirror
 * images (fanning from the bottom-left). Each crescent works in its own
 * (a, d): a runs along its edge away from its corner, normalised so the edge
 * is 2 long, and d is the depth in from the edge, in half-heights of the
 * short side — so wider frames lengthen the crescents along their edge
 * without changing how deep they reach or how wide the leaves are.
 */
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uS;
uniform float uPx;
uniform vec2 uAx;
uniform vec3 uT;
uniform vec2 uMouse;
uniform float uHover;
uniform float uSeed;
uniform vec3 uBg;
uniform vec3 uDeep;
uniform vec3 uIndigo;
uniform vec3 uBase;
uniform vec3 uLine;
uniform vec3 uAccent;
uniform vec3 uWhite;
uniform float uFolds;
uniform float uTwist;
uniform sampler2D uEnv;
uniform float uSatin;
uniform vec2 uCrease;
uniform float uGlow;
uniform float uGain;
uniform float uBreathe;
uniform float uWarp;
uniform vec4 uPtr;
uniform float uGrain;
uniform float uVig;
uniform float uScale;
uniform vec2 uOff;
uniform vec2 uRot;
uniform vec2 uTiltSC;
out vec4 outColor;
const float PI = 3.14159265;
const float TAU = 6.2831853;const float FOCAL = 4.4;const float R1 = 0.218;
const float R2 = 0.317;
const float R3 = 0.371;
const float R4 = 0.484;
const float R5 = 0.735;const float GLOW_W = 1.3;
const float CORNER_DIM = 0.65;
const float CORNER_R = 0.8;const float OUTER = 0.45;
const float ENV_AMAX = ${ENV_AMAX.toFixed(2)};

vec3 ramp(float v) {
    v = clamp(v, 0.0, 1.0);
    vec3 c = uBg;
    c += (uDeep - uBg) * clamp(v / R1, 0.0, 1.0);
    c += (uIndigo - uDeep) * clamp((v - R1) / (R2 - R1), 0.0, 1.0);
    c += (uBase - uIndigo) * clamp((v - R2) / (R3 - R2), 0.0, 1.0);
    c += (uLine - uBase) * clamp((v - R3) / (R4 - R3), 0.0, 1.0);
    c += (uAccent - uLine) * clamp((v - R4) / (R5 - R4), 0.0, 1.0);
    c += (uWhite - uAccent) * clamp((v - R5) / (1.0 - R5), 0.0, 1.0);
    return c;
}vec2 toContent(vec2 s) {
    s -= uOff * 2.0 * uAx;
    s = vec2(uRot.x * s.x - uRot.y * s.y, uRot.y * s.x + uRot.x * s.y);
    float fc = FOCAL / uScale; // the eye distance is the frame's, not the content's
    float den = max(fc * uTiltSC.y - s.y * uTiltSC.x, 1e-3);
    float v = s.y * fc / den;
    return vec2(s.x * (fc + v * uTiltSC.x) / fc, v);
}float phaseOf(vec2 ad, float P0, float P1, float P2, float P3, float P4, float P5, float P6, float off) {
    float a = max(ad.x, 1e-3);
    float r = length(ad);
    float fan = (ad.y / a) * (1.0 + uTwist * (P1 + P2 * a) * a) + uTwist * P3 * ad.y;
    float g = mix(0.5, 1.0, smoothstep(0.0, 0.5, r));
    return (fan / P0 * g + uTwist * ((P4 + (P5 + P6 * r) * r) * r)) * uFolds + off;
}vec2 envOf(vec2 ad, float br, float row, float H, float e0, float e1, float cl0, float rc) {
    float a = ad.x;
    float d = ad.y;
    if (a <= 0.0 || a >= ENV_AMAX) return vec2(0.0);
    vec2 lut = texture(uEnv, vec2(a / ENV_AMAX, row)).rg;
    float D = max(lut.x, 1e-4) * (1.0 + br / H);
    float q = d / D;
    if (q > e1 * GLOW_W || q < -OUTER || lut.y <= 0.0) return vec2(0.0);
    float r = length(ad);
    float e = 1.0 - smoothstep(e0, e1, q);
    float g = 1.0 - smoothstep(e0, e1 * GLOW_W, q);
    float k = (cl0 + (1.0 - cl0) * smoothstep(0.0, rc, r)) * lut.y;
    k *= mix(CORNER_DIM, 1.0, smoothstep(0.0, CORNER_R, r));    k *= 1.0 - smoothstep(0.0, 1.0, -q / OUTER);
    return vec2(e, g) * k;
}float leafOf(float ph, float fw, float r) {
    float u = fract(ph);
    float s = sin(PI * u);
    float cS = clamp(0.25 + 0.5 * r, 0.3, 0.92) * uSatin;
    float rr = 1.1 / max(r, 0.5);    float p = clamp(min(1.6 * rr * rr, 0.27 / max(fw, 1e-4)), 0.8, 8.0);
    float m = 0.15 * (1.0 - smoothstep(0.6, 1.0, r)) * uSatin;
    float du = min(u, 1.0 - u);    float w = max(uCrease.x, fw * 1.2);
    float cd = uCrease.y * (uCrease.x / w) * smoothstep(0.3, 0.8, r);
    float s2 = s * s;
    float h = 1.0 - cS * pow(1.0 - s, p) - m * s2 * s2 - cd * exp(-(du * du) / (w * w));
    return mix(clamp(h, 0.0, 1.0), 0.86, smoothstep(0.12, 0.45, fw));
}float crescent(vec2 ad, float ae, float br, float slide, float pxu,
               float P0, float P1, float P2, float P3, float P4, float P5, float P6, float off,
               float row, float H, float e0, float e1, float cl0, float rc) {
    vec2 e = envOf(ad, br, row, H, e0, e1, cl0, rc);
    if (e.y <= 1e-4) return 0.0;    if (e.x <= 1e-4) return uGlow * e.y;
    float ph = phaseOf(ad, P0, P1, P2, P3, P4, P5, P6, off) + slide;
    float a = max(ad.x, 1e-3);
    float r = length(ad);
    float k = uFolds * mix(0.5, 1.0, smoothstep(0.0, 0.5, r)) / P0;
    float fw = pxu * k * length(vec2(ad.y / (a * a * ae), 1.0 / a));
    float b = e.x * leafOf(ph, fw, r) * uGain;
    return 1.0 - (1.0 - b) * (1.0 - uGlow * e.y);
}

void main() {
    vec2 res = max(uRes, vec2(1.0));
    vec2 uv = gl_FragCoord.xy / res;
    vec2 q = toContent((gl_FragCoord.xy - 0.5 * res) / max(uS, 1.0));
    vec2 mp = toContent(uMouse);    vec2 md = q - mp;
    float R = max(uPtr.w, 1e-3) / uScale;
    float bump = uHover * uPtr.x * exp(-dot(md, md) / (R * R));
    q -= md * bump * uPtr.y;    vec2 A = uAx;
    vec2 adT = vec2((A.x - q.x) / A.x, A.y - q.y);
    vec2 adR = vec2((A.y - q.y) / A.y, A.x - q.x);
    vec2 adL = vec2((q.y + A.y) / A.y, q.x + A.x);
    vec2 adB = vec2((q.x + A.x) / A.x, q.y + A.y);    float wph = TAU * uT.z;
    adT.y += uWarp * (0.6 * sin(adT.x * 2.3 + wph) + 0.4 * sin(adT.x * 4.1 - wph * 1.3 + 1.7));
    adL.y += uWarp * (0.6 * sin(adL.x * 2.3 + wph) + 0.4 * sin(adL.x * 4.1 - wph * 1.3 + 1.7));
    adR.y += uWarp * (0.6 * sin(adR.x * 2.3 + wph + 2.1) + 0.4 * sin(adR.x * 4.1 - wph * 1.3 + 0.4));
    adB.y += uWarp * (0.6 * sin(adB.x * 2.3 + wph + 2.1) + 0.4 * sin(adB.x * 4.1 - wph * 1.3 + 0.4));

    float slide = uT.x + bump * uPtr.z;
    float br = uBreathe * uT.y;    float pxu = 1.0 / max(uS, 1e-3);
    float v = crescent(adT, A.x, br, slide, pxu, ${phaseArgs(TOP_PHASE)}, ${envArgs(TOP_ENV, 0)});
    v = max(v, crescent(adL, A.y, br, slide, pxu, ${phaseArgs(TOP_PHASE)}, ${envArgs(TOP_ENV, 0)}));
    v = max(v, crescent(adR, A.y, br, slide, pxu, ${phaseArgs(RIGHT_PHASE)}, ${envArgs(RIGHT_ENV, 1)}));
    v = max(v, crescent(adB, A.x, br, slide, pxu, ${phaseArgs(RIGHT_PHASE)}, ${envArgs(RIGHT_ENV, 1)}));

    vec3 col = ramp(v);
    float vd = length((uv - 0.5) * vec2(A.x / max(A.x, A.y), A.y / max(A.x, A.y))) * 1.6;
    col *= 1.0 - uVig * 0.6 * smoothstep(0.35, 1.05, vd);    vec2 cell = floor(gl_FragCoord.xy / max(uPx, 1.0));
    float n = fract(sin(dot(cell + uSeed * 17.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    col += n * (uGrain * 0.12 + 2.0 / 255.0);
    outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`


const rgb = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
const UNIFORMS = {
  uBg: rgb("#07111F"), uDeep: rgb("#0B2542"), uIndigo: rgb("#154C80"),
  uBase: rgb("#267FC5"), uLine: rgb("#48A2FF"), uAccent: rgb("#92CDFF"), uWhite: rgb("#E2F1FF"),
  uFolds: [1], uTwist: [0.8], uSatin: [1], uCrease: [0.03, 0.2], uGlow: [0.04],
  uGain: [0.985], uBreathe: [0.02], uWarp: [0.012], uPtr: [0, 0, 0, 0.6],
  uGrain: [0], uVig: [0.12], uScale: [0.68], uOff: [0, 0], uRot: [1, 0], uTiltSC: [0, 1],
};

export default function SatinCrescentBloom() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let gl = null;
    let program = null;
    let buffer = null;
    let texture = null;
    let ready = false;
    let failed = false;
    let disposed = false;
    let visible = false;
    let frameId = 0;
    let idleId = null;
    let timerId = null;
    let lastDraw = -1;
    let elapsed = 0;
    let width = 1;
    let height = 1;
    const locations = new Map();

    function upload(name, values) {
      if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
      const location = locations.get(name);
      if (location !== null) gl['uniform' + values.length + 'fv'](location, values);
    }

    function release() {
      if (!gl) return;
      if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      texture = buffer = program = null;
      ready = false;
    }

    function init() {
      try {
        gl = canvas.getContext("webgl2", {alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power"});
        if (!gl) return false;
        const compile = (type, source) => {
          const shader = gl.createShader(type);
          if (!shader) return null;
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            return null;
          }
          return shader;
        };
        const vertex = compile(gl.VERTEX_SHADER, VERT);
        const fragment = compile(gl.FRAGMENT_SHADER, FRAG);
        if (!vertex || !fragment) {
          if (vertex) gl.deleteShader(vertex);
          if (fragment) gl.deleteShader(fragment);
          return false;
        }
        program = gl.createProgram();
        if (!program) {
          gl.deleteShader(vertex);
          gl.deleteShader(fragment);
          return false;
        }
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
        gl.useProgram(program);
        buffer = gl.createBuffer();
        texture = gl.createTexture();
        if (!buffer || !texture) return false;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, "aPos");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const environment = new Float32Array(ENV_N * 4);
        bakeEnv(environment, 1, 1, 0, 1, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, ENV_N, 2, 0, gl.RG, gl.FLOAT, environment);
        gl.uniform1i(gl.getUniformLocation(program, "uEnv"), 0);
        locations.clear();
        for (const [name, values] of Object.entries(UNIFORMS)) upload(name, values);
        ready = true;
        resize();
        return true;
      } catch {
        return false;
      }
    }

    function draw() {
      if (!ready || !gl) return;
      const unit = Math.max(0.5, Math.min(width, height) / 2) * UNIFORMS.uScale[0];
      const time = motion.matches ? 0 : elapsed * 0.55;
      upload("uRes", [canvas.width, canvas.height]);
      upload("uPx", [canvas.height / height]);
      upload("uS", [unit * canvas.height / height]);
      upload("uAx", [width / 2 / unit, height / 2 / unit]);
      upload("uT", [(time / 6) % 1, Math.sin(2 * Math.PI * (time / 9 - BREATHE_PHASE)), (time / 7) % 1]);
      upload("uMouse", [0, 0]);
      upload("uHover", [0]);
      upload("uSeed", [0]);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.style.opacity = "1";
    }

    function resize() {
      width = Math.max(1, root.clientWidth);
      height = Math.max(1, root.clientHeight);
      let ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      ratio = Math.min(ratio, Math.sqrt(500000 / (width * height)));
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      if (visible && document.visibilityState !== "hidden") draw();
    }

    function stop() {
      if (frameId) cancelAnimationFrame(frameId);
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timerId !== null) clearTimeout(timerId);
      frameId = 0;
      idleId = timerId = null;
      lastDraw = -1;
    }

    function frame(now) {
      frameId = 0;
      if (disposed || !visible || document.visibilityState === "hidden" || !ready) return;
      if (motion.matches) { draw(); return; }
      frameId = requestAnimationFrame(frame);
      if (lastDraw >= 0 && now - lastDraw < 1000 / 24) return;
      if (lastDraw >= 0) elapsed += Math.min((now - lastDraw) / 1000, 0.1);
      lastDraw = now;
      draw();
    }

    function start() {
      if (disposed || failed || !visible || document.visibilityState === "hidden") return;
      if (!ready) {
        if (idleId !== null || timerId !== null) return;
        const initialize = () => {
          idleId = timerId = null;
          if (disposed || !visible || document.visibilityState === "hidden") return;
          if (!init()) { release(); failed = true; return; }
          start();
        };
        if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(initialize, {timeout: 800});
        else timerId = setTimeout(initialize, 0);
      } else if (!frameId) frameId = requestAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    visibilityObserver.observe(root);
    const onVisibility = () => { if (document.visibilityState === "hidden") stop(); else start(); };
    const onMotion = () => { stop(); start(); };
    const onLost = (event) => { event.preventDefault(); stop(); ready = false; canvas.style.opacity = "0"; };
    const onRestored = () => { gl = program = buffer = texture = null; failed = false; locations.clear(); start(); };
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      release();
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="relative h-full w-full" style={{background: "radial-gradient(ellipse at top right, #16446D, #07111F 65%)"}}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{opacity: 0}} />
    </div>
  );
}
