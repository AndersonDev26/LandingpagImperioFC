// ====== CONFIGURAÇÃO: troque pelo seu número (com DDI 55 + DDD) ======
const WHATSAPP = "5511999999999";
const STORE = "Império FC";
const wa = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

// ====== Produtos (edite nomes, preços e cores) ======
const products = [
    { n: "Camisa Titular Clássica", c: "torcedor", cat: "Versão torcedor", p: 119.9, o: 199.9, b: "Mais vendida", f: ["#f5f5f5", "#0a0a0a", "#0a0a0a"], st: "v" },
    { n: "Camisa Reserva Noturna", c: "torcedor", cat: "Versão torcedor", p: 119.9, o: 199.9, b: "", f: ["#0a0a0a", "#f5b800", "#f5b800"], st: "h" },
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
const SIZES = ["P", "M", "G", "GG"];
function render(f = "todas") {
    grid.innerHTML = products.map((x, i) => ({ x, i })).filter(({ x }) => f === "todas" || x.c === f).map(({ x, i }) => `<article class="card" data-i="${i}"><div class="pic">${x.b ? `<span class="badge">${x.b}</span>` : ""}${shirt(x.f, x.st, i)}</div>
 <div class="info"><small>${x.cat}</small><h3>${x.n}</h3><div class="price"><b>${brl(x.p)}</b><s>${brl(x.o)}</s></div>
 <small>Tamanho</small><div class="sizes" role="radiogroup" aria-label="Tamanho">${SIZES.map(s => `<button type="button" class="sz" role="radio" aria-checked="false" data-s="${s}">${s}</button>`).join("")}</div>
 <p class="err" aria-live="polite"></p><button class="btn btn-gold add" type="button">Adicionar ao carrinho</button><span class="inst">ou 6x de ${brl(x.p / 6)} sem juros</span></div></article>`).join("");
}
tabs.innerHTML = cats.map(([k, l], i) => `<button class="tab" role="tab" data-k="${k}" aria-selected="${i === 0}">${l}</button>`).join("");
tabs.addEventListener("click", e => {
    const t = e.target.closest(".tab"); if (!t) return;
    tabs.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b === t)); render(t.dataset.k)
});
render();

// ====== Carrinho ======
const $ = id => document.getElementById(id), FREE = 299, SHIP = 19.9;
let cart = []; try { cart = JSON.parse(localStorage.getItem("cart") || "[]") } catch (e) { }
const save = () => { try { localStorage.setItem("cart", JSON.stringify(cart)) } catch (e) { } };
const total = () => cart.reduce((a, c) => a + products[c.i].p * c.q, 0);
function openCart() { $("drawer").classList.add("open"); $("ov").classList.add("on"); $("drawer").setAttribute("aria-hidden", "false") }
function closeCart() { $("drawer").classList.remove("open"); $("ov").classList.remove("on"); $("drawer").setAttribute("aria-hidden", "true") }
function addItem(i, s) { const k = cart.find(c => c.i === i && c.s === s); k ? k.q++ : cart.push({ i, s, q: 1 }); save(); drawCart(); openCart() }
function drawCart() {
    const n = cart.reduce((a, c) => a + c.q, 0), t = total(), f = Math.max(FREE - t, 0);
    $("cnt").textContent = n; $("cnt").hidden = !n;
    $("items").innerHTML = cart.length ? cart.map((c, k) => { const p = products[c.i]; return `<div class="it"><div class="th">${shirt(p.f, p.st, "k" + k)}</div><div class="id"><b>${p.n}</b><small>Tamanho ${c.s}</small><div class="q"><button data-a="-" data-k="${k}" aria-label="Diminuir">−</button><span>${c.q}</span><button data-a="+" data-k="${k}" aria-label="Aumentar">+</button></div></div><div class="ir"><b>${brl(p.p * c.q)}</b><button class="rm" data-a="x" data-k="${k}">Remover</button></div></div>` }).join("") : `<p class="empty">Seu carrinho está vazio.<br>Escolha uma camisa e adicione aqui.</p>`;
    $("ship").innerHTML = cart.length ? (f ? `Faltam <b>${brl(f)}</b> para o frete grátis<div class="bar"><i style="width:${t / FREE * 100}%"></i></div>` : `Você ganhou <b>frete grátis</b>!<div class="bar"><i style="width:100%"></i></div>`) : "Frete grátis acima de R$ 299";
    $("sub").textContent = brl(t); $("pix").textContent = brl(t * .95); $("checkout").disabled = !cart.length;
}
grid.addEventListener("click", e => {
    const card = e.target.closest(".card"); if (!card) return;
    const sz = e.target.closest(".sz"), add = e.target.closest(".add");
    if (sz) { card.querySelectorAll(".sz").forEach(b => b.setAttribute("aria-checked", b === sz)); card.querySelector(".err").textContent = ""; return }
    if (add) {
        const s = card.querySelector('.sz[aria-checked="true"]');
        if (!s) { card.querySelector(".err").textContent = "Selecione um tamanho"; return }
        addItem(+card.dataset.i, s.dataset.s); add.textContent = "Adicionado ✓"; setTimeout(() => add.textContent = "Adicionar ao carrinho", 1400)
    }
});
$("items").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return; const k = +b.dataset.k, a = b.dataset.a;
    if (a === "+") cart[k].q++; else if (a === "-") { if (--cart[k].q < 1) cart.splice(k, 1) } else cart.splice(k, 1); save(); drawCart()
});
$("openCart").onclick = openCart; $("closeCart").onclick = closeCart; $("ov").onclick = closeCart;
const closeModal = () => $("modal").classList.remove("on");
addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); closeModal() } });
$("modal").addEventListener("click", e => { if (e.target.id === "modal" || e.target.closest("#mx")) closeModal() });
$("checkout").onclick = () => {
    closeCart();
    $("mbox").innerHTML = `<button class="x" id="mx" aria-label="Fechar">×</button><h3>Finalizar compra</h3><form id="fm" novalidate>
 <label>Nome completo<input name="n" required autocomplete="name"></label>
 <label>E-mail<input name="e" type="email" required autocomplete="email"></label>
 <div class="two"><label>CEP<input name="c" required inputmode="numeric" maxlength="9" placeholder="00000-000"></label><label>Número<input name="u" required></label></div>
 <label>Endereço<input name="a" required autocomplete="street-address"></label>
 <fieldset><legend>Pagamento</legend><label class="op"><input type="radio" name="p" value="pix" checked> Pix (5% de desconto)</label><label class="op"><input type="radio" name="p" value="card"> Cartão em até 6x sem juros</label></fieldset>
 <div class="row"><span>Frete</span><b id="fr"></b></div><div class="row"><span>Total</span><b id="tt" style="color:var(--gold);font-size:1.3rem"></b></div>
 <p class="err" id="fe"></p><button class="btn btn-gold" type="submit">Confirmar pedido</button></form>`;
    const fm = $("fm"), calc = () => { const t = total(), sh = t >= FREE ? 0 : SHIP, px = fm.p.value === "pix"; $("fr").textContent = sh ? brl(sh) : "Grátis"; $("tt").textContent = brl(t * (px ? .95 : 1) + sh) };
    calc(); fm.addEventListener("change", calc);
    fm.addEventListener("submit", e => {
        e.preventDefault();
        if ([...fm.querySelectorAll("[required]")].some(i => !i.value.trim() || !i.checkValidity())) { $("fe").textContent = "Preencha todos os campos corretamente."; return }
        const nº = Math.floor(10000 + Math.random() * 90000), em = fm.e.value;
        $("mbox").innerHTML = `<button class="x" id="mx" aria-label="Fechar">×</button><div class="ok"><div class="ic"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div><h3>Pedido #${nº} confirmado!</h3><p>Enviamos os detalhes para ${em.replace(/</g, "&lt;")}. Obrigado por comprar na ${STORE}.</p><button class="btn btn-gold" id="mx2">Continuar comprando</button></div>`;
        $("mx2").onclick = closeModal; cart = []; save(); drawCart()
    });
    $("modal").classList.add("on");
};
drawCart();

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
