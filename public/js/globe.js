/* The Earth behind the landing page (WebGL, no libraries).

   Two passes per frame:
   1. Earth pass (one full-screen triangle). Each pixel ray-traces a unit
      sphere under the same perspective as the point pass and shades it from
      NASA imagery: the Blue Marble day map, Black Marble city lights, cloud
      cover and an ocean mask for the sun glint. The sun's longitude comes
      from the scroll position, so sunrise sweeps across the planet from
      04:00 to 06:12. Off the sphere: the platinum page with a lavender halo.
   2. Point pass (alpha-blended): arcs from India to markets with shipped
      client sites, the seven service satellites and their orbit, and Indian
      city markers.

   Textures stream in after the globe starts — a 1k set on phones and weak
   devices, a 4k day map on desktop. Until they land the sphere renders as a
   dark placeholder with its atmosphere, then cross-fades to the photo. */

const POINT_VS = `precision highp float;
attribute vec3 aPos; attribute vec3 aMeta;
uniform mat3 uRot; uniform vec2 uCenter;
uniform float uScale, uAspect, uRpx, uTime, uDpr, uArcs, uSats, uActive, uIndia, uMarkers, uSpin, uMotion;
varying vec4 vCol; varying float vSoft;
const vec3 GOLD = vec3(0.93, 0.66, 0.35);
const vec3 AMBER = vec3(1.0, 0.62, 0.26);
const vec3 COFFEE = vec3(0.435, 0.306, 0.216);
const float CAM = 4.0;
void main(){
  float kind = aMeta.x, rnd = aMeta.y, t = aMeta.z;
  vSoft = 0.0;
  float pxScale = clamp(uRpx / (380.0 * uDpr), 0.45, 1.8);
  vec3 w = aPos; vec3 v;
  if (kind > 2.5 && kind < 4.5){
    float ang = (kind < 3.5 ? t / 7.0 * 6.2831853 : t) + uSpin;
    v = vec3(cos(ang) * 1.38, sin(ang) * 0.34 - 0.06, sin(ang) * 1.32);
  } else {
    if (kind > 4.5) w = aPos * (1.0 + t * (0.07 + 0.08 * rnd) * uMarkers);
    v = uRot * w;
  }
  float k = CAM / (CAM - v.z);
  vec2 sxy = v.xy * k;
  gl_Position = vec4(sxy.x * uScale / uAspect + uCenter.x, sxy.y * uScale + uCenter.y, 0.0, 1.0);
  float occl = step(v.z, 0.0) * (1.0 - smoothstep(0.96, 1.04, length(sxy)));
  vec3 col; float a; float size;
  if (kind < 2.5){
    float head = fract(uTime * 0.16 + rnd * 0.73);
    float d = head - t;
    float trail = d >= 0.0 ? exp(-d * 10.0) : 0.0;
    trail = mix(0.0, trail, uMotion);
    col = mix(GOLD, vec3(1.0, 0.92, 0.75), trail);
    a = (mix(0.8, 0.55, uMotion) + 0.6 * trail) * uArcs * (1.0 - occl);
    size = (2.1 + 3.2 * trail) * uDpr * pxScale;
  } else if (kind < 3.5){
    float on = 1.0 - step(0.5, abs(t - uActive));
    col = mix(COFFEE, AMBER, on);
    a = uSats * mix(1.0, 0.25, occl);
    size = (on > 0.5 ? 26.0 : 16.0) * uDpr * pxScale;
    vSoft = 1.0;
  } else if (kind < 4.5){
    col = COFFEE;
    a = 0.4 * uSats * mix(1.0, 0.15, occl);
    size = 1.6 * uDpr;
  } else {
    float shown = step(t, uMarkers + 0.001);
    col = mix(AMBER, vec3(1.0, 0.9, 0.7), t);
    a = shown * uIndia * (1.0 - occl) * step(0.0, v.z) * (0.45 + 0.55 * t);
    size = (t > 0.97 ? 9.0 : 2.4) * uDpr * pxScale;
    if (t > 0.97) vSoft = 1.0;
  }
  vCol = vec4(col, min(a, 1.0));
  gl_PointSize = size;
}`;

const POINT_FS = `precision mediump float;
varying vec4 vCol; varying float vSoft;
void main(){
  vec2 p = gl_PointCoord - 0.5; float d = length(p);
  float a = vSoft > 0.5 ? min(1.0, exp(-d * d * 22.0) * 0.6 + (1.0 - smoothstep(0.12, 0.2, d))) : 1.0 - smoothstep(0.3, 0.5, d);
  a *= vCol.a;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vCol.rgb * a, a);
}`;

const EARTH_VS = 'attribute vec2 aP; void main(){ gl_Position = vec4(aP, 0.0, 1.0); }';

// `deriv`: OES_standard_derivatives is available, so the date-line seam can
// be hidden (Tarini's trick) and the textures can be mipmapped.
const earthFS = (deriv) => `${deriv ? '#extension GL_OES_standard_derivatives : enable\n#define DERIV 1\n' : ''}
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes, uCenter, uSunScr;
uniform float uScale, uAspect, uRise, uDim, uReady, uDrift, uIndia;
uniform mat3 uRot;
uniform vec3 uSun, uIndiaC;
uniform sampler2D uDay, uNight, uClouds, uWater;
const vec3 BG = vec3(0.898, 0.894, 0.886);    // #E5E4E2 platinum
const vec3 LAV = vec3(0.70, 0.63, 0.89);      // halo
const vec3 PEACH = vec3(0.97, 0.80, 0.66);    // sunrise side of the halo
const vec3 SKY = vec3(0.55, 0.73, 1.0);       // daylit atmosphere
const vec3 DAWN = vec3(1.0, 0.52, 0.3);       // the sunrise line
const float CAM = 4.0;
const float LIMB = 1.0327956;  // the sphere's screen radius: CAM / sqrt(CAM*CAM - 1)
const float PI = 3.14159265;
void main(){
  vec2 ndc = gl_FragCoord.xy / uRes * 2.0 - 1.0;
  vec2 q = vec2((ndc.x - uCenter.x) * uAspect, ndc.y - uCenter.y) / uScale;
  float r = length(q), d = r / LIMB;
  vec2 dir = q / max(r, 1e-4);
  float side = dot(dir, uSunScr), top = clamp(dir.y, 0.0, 1.0);
  float px = 2.0 / (uRes.y * uScale * LIMB);  // one device pixel, in limb units

  // off the sphere: the page, a lavender halo warming toward the sun, sunrise bloom
  float o = max(d - 1.0, 0.0);
  vec3 halo = mix(LAV, PEACH, smoothstep(-0.1, 0.9, side) * 0.55);
  vec3 col = mix(BG, halo, exp(-o * 5.5) * 0.6 * uDim);
  col = mix(col, PEACH, uRise * exp(-o * 2.4) * (0.25 + 0.55 * top) * 0.7);

  if (d < 1.0 + px){
    vec3 E = vec3(0.0, 0.0, CAM);
    vec3 rd = normalize(vec3(q, -CAM));
    float b = dot(E, rd);
    vec3 n = normalize(E + rd * (-b - sqrt(max(b * b - CAM * CAM + 1.0, 0.0))));  // view-space normal
    vec3 w = n * uRot;                                                            // world space
    float u = atan(w.x, w.z) / (2.0 * PI) + 0.5;
    #ifdef DERIV
    float u2 = fract(u + 0.5) - 0.5;  // continuous across the date line
    u = fwidth(u) < fwidth(u2) - 0.001 ? u : u2;
    #endif
    vec2 uv = vec2(u, 0.5 - asin(clamp(w.y, -1.0, 1.0)) / PI);

    float lit = dot(w, uSun);
    float day = smoothstep(-0.08, 0.25, lit);
    float dawn = exp(-(lit / 0.1) * (lit / 0.1));
    vec3 V = normalize(E - n);
    float fres = pow(1.0 - clamp(dot(n, V), 0.0, 1.0), 3.0);
    float diff = pow(max(lit, 0.0), 0.8);

    vec3 albedo = texture2D(uDay, uv).rgb;
    float cloud = texture2D(uClouds, uv + vec2(uDrift, 0.0)).r;
    float water = texture2D(uWater, uv).r;
    float lights = texture2D(uNight, uv).r;

    vec3 surf = albedo * (vec3(0.13, 0.16, 0.24) + 1.08 * diff);                    // sunlit ground + moonlit earthshine
    surf = mix(surf, vec3(0.94, 0.95, 1.0) * (0.06 + 1.04 * diff), cloud * 0.9);    // clouds
    float glint = pow(max(dot(n, normalize(uRot * uSun + V)), 0.0), 70.0) * water * (1.0 - cloud) * day;
    surf += mix(vec3(1.0, 0.94, 0.84), vec3(1.0, 0.62, 0.42), dawn) * glint * 0.85;  // sun on the ocean
    surf += vec3(1.0, 0.76, 0.48) * pow(lights, 1.6) * 2.3 * (1.0 - day) * (1.0 - cloud * 0.7);  // city lights
    surf += DAWN * dawn * (0.08 + 0.22 * cloud);                                      // the sunrise line
    surf += vec3(1.0, 0.7, 0.35) * smoothstep(0.972, 0.994, dot(w, uIndiaC)) * uIndia * 0.22;
    vec3 atm = mix(mix(LAV, SKY, smoothstep(-0.3, 0.35, lit)), DAWN, clamp(dawn * 0.9, 0.0, 1.0));
    surf += atm * fres * (0.18 + 0.8 * smoothstep(-0.3, 0.35, lit));                // atmosphere at the limb
    vec3 ph = vec3(0.05, 0.08, 0.14) * (0.6 + 0.6 * day) + atm * fres * 0.7;         // before the photo lands

    vec3 globe = mix(BG, mix(ph, surf, uReady), uDim);
    globe = mix(globe, PEACH, uRise * smoothstep(0.8, 1.0, d) * (0.25 + 0.55 * top) * 0.35);
    col = mix(col, globe, clamp((1.0 - d) / px + 0.5, 0.0, 1.0));  // antialiased limb
  }
  gl_FragColor = vec4(col, 1.0);
}`;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const UNITS = ['day', 'night', 'clouds', 'water'];

/* onLost: the context died or the shaders failed · onReady: first frame drawn */
export function createGlobe(canvas, onLost, onReady) {
  const conn = navigator.connection;
  if (conn && conn.saveData) return null;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl || gl.isContextLost()) return null;
  const lowEnd = (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency || 8) <= 4;
  const small = Math.min(innerWidth, innerHeight) < 600;
  const maxDpr = lowEnd ? 1.25 : 1.6;
  // The Earth pass shades every pixel, so cap the backing store as well as the DPR.
  const maxPixels = lowEnd || small ? 1.3e6 : 3.6e6;
  const deriv = !!gl.getExtension('OES_standard_derivatives');
  const aniso = gl.getExtension('EXT_texture_filter_anisotropic');

  /* geometry: x y z kind rnd t */
  const v = [];
  const add = (x, y, z, k, r, t) => v.push(x, y, z, k, r, t);
  const D2R = Math.PI / 180;
  const ll = (la, lo) => [Math.cos(la * D2R) * Math.sin(lo * D2R), Math.sin(la * D2R), Math.cos(la * D2R) * Math.cos(lo * D2R)];
  /* arcs from India to markets with shipped client sites */
  const from = ll(28.6, 77.2);
  const targets = [[19.3, -81.38], [28.54, -81.38], [27.95, -82.46], [29.76, -95.37], [34.05, -118.24], [42.36, -71.06], [33.45, -112.07], [44.98, -93.27]];
  targets.forEach((tg, ai) => {
    const b = ll(tg[0], tg[1]);
    const om = Math.acos(clamp(from[0] * b[0] + from[1] * b[1] + from[2] * b[2], -1, 1)), so = Math.sin(om);
    const S = 160;
    for (let s = 0; s <= S; s++) {
      const t = s / S, f1 = Math.sin((1 - t) * om) / so, f2 = Math.sin(t * om) / so;
      const h = 1.012 + Math.sin(Math.PI * t) * (.05 + om * .11);
      add((from[0] * f1 + b[0] * f2) * h, (from[1] * f1 + b[1] * f2) * h, (from[2] * f1 + b[2] * f2) * h, 2, ai / targets.length, t);
    }
  });
  for (let i = 0; i < 7; i++) add(0, 0, 0, 3, 0, i);
  for (let i = 0; i < 420; i++) add(0, 0, 0, 4, 0, i / 420 * Math.PI * 2);
  const cities = [[19.08, 72.88], [28.61, 77.21], [12.97, 77.59], [17.39, 78.49], [13.08, 80.27], [22.57, 88.36], [18.52, 73.86], [23.02, 72.57], [26.91, 75.79], [26.85, 80.95], [9.93, 76.27], [20.0, 73.79], [21.15, 79.09], [30.73, 76.78]];
  cities.forEach((c) => { const p = ll(c[0], c[1]), r = Math.random(); for (let s = 0; s <= 22; s++) add(p[0], p[1], p[2], 5, r, s / 22); });
  const data = new Float32Array(v), count = data.length / 6;

  // Compile and link without asking for the result: querying status blocks
  // until the driver finishes. With KHR_parallel_shader_compile the work
  // happens off the main thread and draw() waits for it; without it, the
  // first draw() pays the cost inside a frame instead of at startup.
  const par = gl.getExtension('KHR_parallel_shader_compile');
  const prog = (a, b) => {
    const p = gl.createProgram();
    [[gl.VERTEX_SHADER, a], [gl.FRAGMENT_SHADER, b]].forEach(([type, src]) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); gl.attachShader(p, s); });
    gl.linkProgram(p);
    return p;
  };
  const PP = prog(POINT_VS, POINT_FS), PE = prog(EARTH_VS, earthFS(deriv));
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const tri = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, tri); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const UP = {}, UE = {};
  let aPos, aMeta, aP, linked = false, failed = false;
  const link = () => {
    if (linked || failed) return linked;
    if (par && !(gl.getProgramParameter(PP, par.COMPLETION_STATUS_KHR) && gl.getProgramParameter(PE, par.COMPLETION_STATUS_KHR))) return false;
    for (const p of [PP, PE]) if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn('globe disabled', gl.getProgramInfoLog(p)); failed = true; onLost(); return false; }
    ['uRot', 'uCenter', 'uScale', 'uAspect', 'uRpx', 'uTime', 'uDpr', 'uArcs', 'uSats', 'uActive', 'uIndia', 'uMarkers', 'uSpin', 'uMotion'].forEach((n) => { UP[n] = gl.getUniformLocation(PP, n); });
    ['uRes', 'uCenter', 'uSunScr', 'uScale', 'uAspect', 'uRise', 'uDim', 'uReady', 'uDrift', 'uIndia', 'uRot', 'uSun', 'uIndiaC', 'uDay', 'uNight', 'uClouds', 'uWater'].forEach((n) => { UE[n] = gl.getUniformLocation(PE, n); });
    aPos = gl.getAttribLocation(PP, 'aPos'); aMeta = gl.getAttribLocation(PP, 'aMeta'); aP = gl.getAttribLocation(PE, 'aP');
    gl.useProgram(PE);
    UNITS.forEach((k, i) => gl.uniform1i(UE['u' + k[0].toUpperCase() + k.slice(1)], i));
    return (linked = true);
  };
  gl.disable(gl.DEPTH_TEST); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const india = ll(22, 79);

  /* textures: a black 1×1 stand-in each, replaced as the photos arrive */
  const tex = {};
  UNITS.forEach((k, i) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    tex[k] = t;
  });

  const hi = !lowEnd && !small && gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 4096;
  const files = hi
    ? { day: 'day-4k', night: 'night-2k', clouds: 'clouds-2k', water: 'water' }
    : { day: 'day-1k', night: 'night-1k', clouds: 'clouds-1k', water: 'water' };
  let disposed = false, uploaded = 0, readyAt = 0;
  const queue = [];
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const fetchImage = async (k) => {
    const url = `/assets/earth/${files[k]}.webp`;
    let img;
    if (typeof createImageBitmap === 'function') {
      const res = await fetch(url, { signal: ctrl && ctrl.signal });
      if (!res.ok) throw new Error(url);
      img = await createImageBitmap(await res.blob());  // decoded off the main thread
    } else {
      img = new Image(); img.src = url; await img.decode();
    }
    if (disposed) { if (img.close) img.close(); return; }
    queue.push([k, img]);
  };
  // The day map goes first so the planet appears as soon as possible.
  fetchImage('day').then(() => Promise.all(['night', 'clouds', 'water'].map(fetchImage))).catch(() => { /* keep the placeholder sphere */ });
  // One upload per frame keeps each frame's main-thread cost small.
  const uploadNext = () => {
    const next = queue.shift();
    if (!next) return;
    const [k, img] = next, i = UNITS.indexOf(k), fmt = k === 'day' ? gl.RGB : gl.LUMINANCE;
    gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, tex[k]);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, img);
    if (deriv) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
    if (aniso && (k === 'day' || k === 'clouds')) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
    if (img.close) img.close();
    if (++uploaded === UNITS.length) readyAt = performance.now();
  };

  let W = 0, H = 0, dpr = 1;
  function size() {
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    dpr = Math.min(devicePixelRatio || 1, maxDpr, Math.sqrt(maxPixels / Math.max(1, cw * ch)));
    const w = Math.round(cw * dpr), h = Math.round(ch * dpr);
    if (w !== W || Math.abs(h - H) > 80 * dpr || h > H) { W = canvas.width = w; H = canvas.height = h; gl.viewport(0, 0, W, H); }
  }
  size();

  const lost = (e) => { e.preventDefault(); onLost(); };
  canvas.addEventListener('webglcontextlost', lost);

  /* s: globe state (see the keyframes in main.js); extra: { activeSvc, spin, motion } */
  let shown = false;
  const draw = (s, time, extra) => {
    if (!link()) return;
    uploadNext();
    const ready = readyAt ? clamp((performance.now() - readyAt) / 900, 0, 1) : 0;
    const lon = s.lon * D2R, lat = s.lat * D2R;
    const c = Math.cos(lon), sn = Math.sin(lon), cp = Math.cos(lat), sp = Math.sin(lat);
    // rows: [c,0,-sn] [-sp*sn, cp, -sp*c] [cp*sn, sp, cp*c] -> column-major
    const R = new Float32Array([c, -sp * sn, cp * sn, 0, cp, sp, -sn, -sp * c, cp * c]);
    const dec = -11 * D2R, sl = (s.dawn + 90) * D2R;
    const sun = [Math.cos(dec) * Math.sin(sl), Math.sin(dec), Math.cos(dec) * Math.cos(sl)];
    const vx = R[0] * sun[0] + R[3] * sun[1] + R[6] * sun[2], vy = R[1] * sun[0] + R[4] * sun[1] + R[7] * sun[2];
    const vl = Math.hypot(vx, vy) || 1;
    const aspect = W / H, rpx = s.s * H / 2;

    gl.useProgram(PE);
    gl.bindBuffer(gl.ARRAY_BUFFER, tri);
    gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);
    gl.uniform2f(UE.uRes, W, H); gl.uniform2f(UE.uCenter, s.x, s.y); gl.uniform2f(UE.uSunScr, vx / vl, vy / vl);
    gl.uniform1f(UE.uScale, s.s); gl.uniform1f(UE.uAspect, aspect); gl.uniform1f(UE.uRise, s.rise); gl.uniform1f(UE.uDim, s.dim);
    gl.uniform1f(UE.uReady, ready * ready * (3 - 2 * ready)); gl.uniform1f(UE.uDrift, (time * .0025) % 1); gl.uniform1f(UE.uIndia, s.india);
    gl.uniformMatrix3fv(UE.uRot, false, R); gl.uniform3fv(UE.uSun, sun); gl.uniform3fv(UE.uIndiaC, india);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disableVertexAttribArray(aP);

    gl.enable(gl.BLEND);
    gl.useProgram(PP);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(aMeta); gl.vertexAttribPointer(aMeta, 3, gl.FLOAT, false, 24, 12);
    gl.uniformMatrix3fv(UP.uRot, false, R);
    gl.uniform2f(UP.uCenter, s.x, s.y);
    gl.uniform1f(UP.uScale, s.s); gl.uniform1f(UP.uAspect, aspect); gl.uniform1f(UP.uRpx, rpx);
    gl.uniform1f(UP.uTime, time); gl.uniform1f(UP.uDpr, dpr);
    gl.uniform1f(UP.uArcs, s.arcs); gl.uniform1f(UP.uSats, s.sats); gl.uniform1f(UP.uActive, extra.activeSvc);
    gl.uniform1f(UP.uIndia, s.india); gl.uniform1f(UP.uMarkers, s.mk);
    gl.uniform1f(UP.uSpin, extra.spin); gl.uniform1f(UP.uMotion, extra.motion);
    gl.drawArrays(gl.POINTS, 0, count);
    gl.disableVertexAttribArray(aPos); gl.disableVertexAttribArray(aMeta);
    if (!shown) { shown = true; if (onReady) onReady(); }
  };

  const dispose = () => {
    disposed = true;
    if (ctrl) ctrl.abort();
    queue.forEach(([, img]) => { if (img.close) img.close(); });
    queue.length = 0;
    canvas.removeEventListener('webglcontextlost', lost);
    gl.deleteBuffer(buf); gl.deleteBuffer(tri);
    gl.deleteProgram(PP); gl.deleteProgram(PE);
    UNITS.forEach((k) => gl.deleteTexture(tex[k]));
  };

  return { draw, resize: size, dispose };
}
