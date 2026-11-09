const WHATSAPP = " +55 11 934591039";
const STORE = "Império FC";
const wa = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

// ====== Produtos (edite nomes, preços e cores) ======
const products = [
    { n: "Camisa Titular Clássica", c: "torcedor", cat: "Versão torcedor", p: 149.9, o: 199.9, b: "Mais vendida", f: ["#f5f5f5", "#0a0a0a", "#0a0a0a"], st: "v" },
    { n: "Camisa Reserva Noturna", c: "torcedor", cat: "Versão torcedor", p: 149.9, o: 199.9, b: "", f: ["#0a0a0a", "#f5b800", "#f5b800"], st: "h" },
    { n: "Camisa Jogador Pro", c: "jogador", cat: "Versão jogador", p: 219.9, o: 289.9, b: "Novo", f: ["#f5b800", "#0a0a0a", "#0a0a0a"], st: "n" },
    { n: "Seleção Verde e Amarela", c: "selecoes", cat: "Seleções", p: 169.9, o: 219.9, b: "Copa", f: ["#ffd400", "#0b8a3e", "#0b8a3e"], st: "n" },
    { n: "Retrô Anos 90", c: "retro", cat: "Retrô", p: 179.9, o: 239.9, b: "Edição limitada", f: ["#1c3d8f", "#ffffff", "#e32d2d"], st: "h" },
    { n: "Seleção Celeste", c: "selecoes", cat: "Seleções", p: 169.9, o: 219.9, b: "", f: ["#79c4ee", "#ffffff", "#ffffff"], st: "v" },
    { n: "Jogador Edição Preta", c: "jogador", cat: "Versão jogador", p: 229.9, o: 299.9, b: "", f: ["#111111", "#2a2a2a", "#f5b800"], st: "v" },
    { n: "Retrô Listrada Campeã", c: "retro", cat: "Retrô", p: 179.9, o: 239.9, b: "", f: ["#d62828", "#ffffff", "#0a0a0a"], st: "v" }
];
const cats = [["todas", "Todas"], ["torcedor", "Torcedor"], ["jogador", "Jogador"], ["selecoes", "Seleções"], ["retro", "Retrô"]];
const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function shirt([a, b, t], st, i) {
    let pat = "";
    if (st === "v") pat = [...Array(5)].map((_, k) => `<rect x="${27 + k * 14}" y="0" width="7" height="110" fill="${b}"/>`).join("");
    if (st === "h") pat = [...Array(5)].map((_, k) => `<rect x="0" y="${34 + k * 14}" width="120" height="7" fill="${b}"/>`).join("");
    return `<svg viewBox="0 0 120 110" role="img" aria-label="Camisa de futebol"><defs><clipPath id="c${i}"><path d="M30 10L10 22 2 48l16 6 6-14v60h72V40l6 14 16-6-8-26L90 10Q60 28 30 10z"/></clipPath></defs>
 <g clip-path="url(#c${i})"><rect width="120" height="110" fill="${a}"/>${pat}<path d="M30 10L10 22 2 48l16 6 6-14V10z" fill="${t}"/><path d="M90 10l20 12 8 26-16 6-6-14V10z" fill="${t}"/><path d="M0 100h120v10H0z" fill="rgba(0,0,0,.18)"/></g>
 <path d="M44 11Q60 30 76 11" fill="none" stroke="${t}" stroke-width="5"/><path d="M30 10L10 22 2 48l16 6 6-14v60h72V40l6 14 16-6-8-26L90 10" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
 <circle cx="84" cy="34" r="4.5" fill="#f5b800"/></svg>`;
}
const grid = document.getElementById("grid"), tabs = document.getElementById("tabs");
function render(f = "todas") {
    grid.innerHTML = products.map((x, i) => ({ x, i })).filter(({ x }) => f === "todas" || x.c === f).map(({ x, i }) => {
        const msg = `Olá, ${STORE}! Quero comprar a *${x.n}* (${brl(x.p)}). Pode me ajudar com tamanho e frete?`;
        return `<article class="card"><div class="pic">${x.b ? `<span class="badge">${x.b}</span>` : ""}${shirt(x.f, x.st, i)}</div>
  <div class="info"><small>${x.cat}</small><h3>${x.n}</h3><div class="price"><b>${brl(x.p)}</b><s>${brl(x.o)}</s></div>
  <div class="sizes"><span>P</span><span>M</span><span>G</span><span>GG</span></div>
  <a class="btn btn-gold" target="_blank" rel="noopener" href="${wa(msg)}">Comprar no WhatsApp</a></div></article>`
    }).join("");
}
tabs.innerHTML = cats.map(([k, l], i) => `<button class="tab" role="tab" data-k="${k}" aria-selected="${i === 0}">${l}</button>`).join("");
tabs.addEventListener("click", e => {
    const t = e.target.closest(".tab"); if (!t) return;
    tabs.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b === t)); render(t.dataset.k)
});
render();

// WhatsApp genérico
document.querySelectorAll("a.wa").forEach(a => { a.href = wa(`Olá, ${STORE}! Vim pelo site e gostaria de ver as camisas disponíveis.`); a.target = "_blank"; a.rel = "noopener" });
// Header, menu mobile
const hd = document.getElementById("top"), menu = document.getElementById("menu"), bg = document.getElementById("burger");
const onS = () => hd.classList.toggle("s", scrollY > 30); onS(); addEventListener("scroll", onS, { passive: true });
bg.onclick = () => { const o = menu.classList.toggle("open"); bg.setAttribute("aria-expanded", o) };
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); bg.setAttribute("aria-expanded", false) }));
// Reveal nas seções
document.querySelectorAll(".card,.b,.step,.r").forEach(e => e.classList.add("reveal"));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }), { threshold: .12 });
const obs = () => document.querySelectorAll(".reveal:not(.in)").forEach(e => io.observe(e)); obs();
new MutationObserver(() => { document.querySelectorAll(".card:not(.reveal)").forEach(e => e.classList.add("reveal", "in")) }).observe(grid, { childList: true });
// Contadores
const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.n, d = +(el.dataset.d || 0), t0 = performance.now();
    (function f(t) {
        const k = Math.min((t - t0) / 1400, 1), v = end * (1 - Math.pow(1 - k, 3));
        el.textContent = (d ? v.toFixed(d).replace(".", ",") : Math.round(v).toLocaleString("pt-BR")) + (end >= 1000 && k === 1 ? "+" : "");
        if (k < 1) requestAnimationFrame(f)
    })(t0)
}), { threshold: .5 });
document.querySelectorAll("[data-n]").forEach(e => cio.observe(e));
// Balão do WhatsApp aparece após 4s
setTimeout(() => { const f = document.getElementById("fab"); f.classList.add("tip"); setTimeout(() => f.classList.remove("tip"), 5000) }, 4000);
document.getElementById("yr").textContent = new Date().getFullYear();
