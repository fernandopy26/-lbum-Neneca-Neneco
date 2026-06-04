const dataInicio = new Date(2025, 1, 8, 18, 46, 0);
const albumInicio = new Date(2025, 1, 1);

const nomesMeses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

const frasesMes = [
  "Um mês para guardar no bolso do coração.",
  "A foto escolhida vai contar o que as palavras deixaram brilhando.",
  "Mais uma página para provar que o tempo fica bonito quando passa com você.",
  "Quando essa foto entrar aqui, esse mês ganha casa para sempre.",
  "O amor também mora nos detalhes que a gente escolhe lembrar."
];

const musica = document.getElementById("musica");
const musicButton = document.getElementById("musicButton");
const secretButton = document.getElementById("secretButton");
const printButton = document.getElementById("printButton");
const contador = document.getElementById("contador");
const bookStage = document.getElementById("bookStage");
const pageLabel = document.getElementById("pageLabel");
const tocButton = document.getElementById("tocButton");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
const imgModal = document.getElementById("imgModal");
const modalCaption = document.getElementById("modalCaption");
const toast = document.getElementById("toast");

let tocando = false;
let paginaAtual = 0;
let virandoPagina = false;
let meses = [];
let paginas = [];
let fotosDisponiveis = [];
let modalIndex = 0;
let toqueLivro = null;
const statusImagens = new Map();

function pad(numero) {
  return String(numero).padStart(2, "0");
}

function formatarMes(mes) {
  return `${nomesMeses[mes.mes - 1]} / ${mes.ano}`;
}

function gerarMeses() {
  const hoje = new Date();
  const cursor = new Date(albumInicio.getFullYear(), albumInicio.getMonth(), 1);
  const fim = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const lista = [];

  while (cursor <= fim) {
    const ano = cursor.getFullYear();
    const mes = cursor.getMonth() + 1;
    const id = `${ano}-${pad(mes)}`;

    lista.push({
      id,
      ano,
      mes,
      arquivo: `${id}.jpg`,
      caminho: `imagens/meses/${id}.jpg`,
      atual: ano === hoje.getFullYear() && mes === hoje.getMonth() + 1
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return lista;
}

function atualizarContador() {
  const agora = new Date();
  const diferenca = Math.max(0, agora - dataInicio);
  const segundo = 1000;
  const minuto = segundo * 60;
  const hora = minuto * 60;
  const dia = hora * 24;

  const dias = Math.floor(diferenca / dia);
  const horas = Math.floor(diferenca / hora) % 24;
  const minutos = Math.floor(diferenca / minuto) % 60;
  const segundos = Math.floor(diferenca / segundo) % 60;

  document.querySelector('[data-counter="dias"]').textContent = dias;
  document.querySelector('[data-counter="horas"]').textContent = pad(horas);
  document.querySelector('[data-counter="minutos"]').textContent = pad(minutos);
  document.querySelector('[data-counter="segundos"]').textContent = pad(segundos);

  contador.textContent = `${dias} dias juntinhos, e esse número ainda está só começando.`;
}

function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add("is-visible");

  window.clearTimeout(mostrarToast.timeout);
  mostrarToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

async function alternarMusica() {
  try {
    if (tocando) {
      musica.pause();
      tocando = false;
      musicButton.querySelector("span:last-child").textContent = "Tocar música";
      return;
    }

    await musica.play();
    tocando = true;
    musicButton.querySelector("span:last-child").textContent = "Pausar música";
  } catch (erro) {
    mostrarToast("O navegador segurou a música por enquanto. Tente clicar de novo.");
  }
}

function prepararPaginas() {
  meses = gerarMeses();
  paginas = [{ tipo: "sumario" }, ...meses.map((mes) => ({ tipo: "mes", mes }))];
  meses.forEach(verificarImagemDoMes);
}

function verificarImagemDoMes(mes) {
  if (statusImagens.has(mes.id)) return;

  const teste = new Image();
  teste.onload = () => {
    statusImagens.set(mes.id, true);
    atualizarStatusDoSumario(mes.id, true);
    atualizarFotosDisponiveis();
  };
  teste.onerror = () => {
    statusImagens.set(mes.id, false);
    atualizarStatusDoSumario(mes.id, false);
  };
  teste.src = `${mes.caminho}?v=${Date.now()}`;
}

function atualizarStatusDoSumario(id, temFoto) {
  document.querySelectorAll(`[data-month-id="${id}"]`).forEach((botao) => {
    botao.classList.toggle("has-photo", temFoto);
    botao.querySelector("span").textContent = temFoto ? "com foto" : "esperando";
  });
}

function atualizarFotosDisponiveis() {
  fotosDisponiveis = meses
    .filter((mes) => statusImagens.get(mes.id))
    .map((mes) => ({
      src: mes.caminho,
      legenda: formatarMes(mes)
    }));
}

function criarIndiceMeses() {
  const anos = document.createElement("div");
  anos.className = "toc-years";

  const grupos = meses.reduce((acc, mes) => {
    acc[mes.ano] = acc[mes.ano] || [];
    acc[mes.ano].push(mes);
    return acc;
  }, {});

  Object.entries(grupos).forEach(([ano, lista]) => {
    const bloco = document.createElement("div");
    bloco.className = "year-block";

    const yearTitle = document.createElement("p");
    yearTitle.className = "year-title";
    yearTitle.textContent = ano;

    const grade = document.createElement("div");
    grade.className = "month-grid";

    lista.forEach((mes) => {
      const botao = document.createElement("button");
      const temFoto = statusImagens.get(mes.id) === true;
      botao.className = `toc-month${temFoto ? " has-photo" : ""}${mes.atual ? " is-current" : ""}`;
      botao.type = "button";
      botao.dataset.monthId = mes.id;
      botao.innerHTML = `<strong>${nomesMeses[mes.mes - 1]}</strong><span>${temFoto ? "com foto" : "esperando"}</span>`;
      botao.addEventListener("click", () => irParaPagina(paginas.findIndex((pagina) => pagina.mes?.id === mes.id)));
      grade.appendChild(botao);
    });

    bloco.append(yearTitle, grade);
    anos.appendChild(bloco);
  });

  return anos;
}

function criarSpreadSumario() {
  const spread = document.createElement("article");
  spread.className = "book-spread";

  const capa = document.createElement("section");
  capa.className = "book-page summary-cover";
  capa.innerHTML = `
    <span class="book-mark" aria-hidden="true"></span>
    <div>
      <p class="eyebrow">Sumário</p>
      <h3>O mapa do nosso álbum</h3>
      <p>${meses.length} páginas mensais desde o começo da nossa história.</p>
    </div>
    <p>Cada mês tem um lugar marcado para a lembrança que vai morar ali.</p>
  `;

  const indice = document.createElement("section");
  indice.className = "book-page toc-page";

  const titulo = document.createElement("div");
  titulo.innerHTML = `
    <p class="eyebrow">Meses guardados</p>
    <p class="toc-intro">O calendário vira, e uma página nova aparece para esperar a próxima foto.</p>
  `;

  const anos = criarIndiceMeses();

  indice.append(titulo, anos);
  spread.append(capa, indice);

  return spread;
}

function criarSpreadMes(mes) {
  const spread = document.createElement("article");
  spread.className = "book-spread";

  const paginaFoto = document.createElement("section");
  paginaFoto.className = "book-page photo-page";

  const moldura = document.createElement("figure");
  moldura.className = "month-photo";

  const imagem = document.createElement("img");
  imagem.alt = `Foto de ${formatarMes(mes)}`;
  imagem.loading = "lazy";

  const placeholder = document.createElement("div");
  placeholder.className = "photo-placeholder";
  placeholder.innerHTML = `
    <div>
      <strong>${nomesMeses[mes.mes - 1]}</strong>
      <span>${mes.arquivo}</span>
    </div>
  `;
  placeholder.addEventListener("click", () => {
    mostrarToast("Essa página já está pronta. Falta só escolher a foto do mês.");
  });

  const legenda = document.createElement("figcaption");
  legenda.textContent = formatarMes(mes);

  imagem.addEventListener("load", () => {
    moldura.classList.add("has-photo");
    statusImagens.set(mes.id, true);
    atualizarStatusDoSumario(mes.id, true);
    atualizarFotosDisponiveis();
    paginaTexto.querySelector("[data-photo-status]").textContent = "foto escolhida";
  });

  imagem.addEventListener("error", () => {
    moldura.classList.add("is-empty");
    imagem.removeAttribute("src");
    statusImagens.set(mes.id, false);
    atualizarStatusDoSumario(mes.id, false);
    paginaTexto.querySelector("[data-photo-status]").textContent = "esperando vocês";
  });

  imagem.addEventListener("click", () => abrirModal(mes.caminho, formatarMes(mes)));

  moldura.append(imagem, placeholder, legenda);
  paginaFoto.appendChild(moldura);

  const paginaTexto = document.createElement("section");
  paginaTexto.className = "book-page month-info";
  paginaTexto.innerHTML = `
    <div>
      <p class="eyebrow">${mes.atual ? "Mês atual" : "Página do mês"}</p>
      <h3>${formatarMes(mes)}</h3>
      <p>${frasesMes[(mes.mes + mes.ano) % frasesMes.length]}</p>
      <div class="month-meta">
        <span><strong>Arquivo</strong>${mes.arquivo}</span>
        <span><strong>Status</strong><span data-photo-status>${statusImagens.get(mes.id) ? "foto escolhida" : "esperando vocês"}</span></span>
      </div>
    </div>
    <p class="page-note">A página existe desde já. A lembrança entra quando a gente escolhe a foto.</p>
  `;

  imagem.src = mes.caminho;
  spread.append(paginaFoto, paginaTexto);

  return spread;
}

function criarSpread(indicePagina) {
  const pagina = paginas[indicePagina];
  return pagina.tipo === "sumario" ? criarSpreadSumario() : criarSpreadMes(pagina.mes);
}

function atualizarControles() {
  const pagina = paginas[paginaAtual];
  pageLabel.textContent = pagina.tipo === "sumario" ? "Sumário" : formatarMes(pagina.mes);
  prevPage.disabled = paginaAtual === 0;
  nextPage.disabled = paginaAtual === paginas.length - 1;
  tocButton.disabled = paginaAtual === 0;
}

function irParaPagina(proximaPagina) {
  if (virandoPagina || proximaPagina < 0 || proximaPagina >= paginas.length || proximaPagina === paginaAtual) {
    return;
  }

  virandoPagina = true;
  const direcao = proximaPagina > paginaAtual ? "next" : "prev";
  const spreadAtual = bookStage.querySelector(".book-spread");
  const novoSpread = criarSpread(proximaPagina);
  const folha = document.createElement("div");
  const duracao = 800;

  folha.className = `page-sheet sheet-${direcao}`;
  novoSpread.classList.add("spread-under", `under-${direcao}`);
  bookStage.appendChild(novoSpread);
  bookStage.appendChild(folha);

  requestAnimationFrame(() => {
    spreadAtual.classList.add("spread-turning", direcao === "next" ? "turn-page-next" : "turn-page-prev");
    novoSpread.classList.add("under-reveal");
    folha.classList.add("sheet-turning");
  });

  window.setTimeout(() => {
    spreadAtual.remove();
    folha.remove();
    novoSpread.classList.remove("spread-under", `under-${direcao}`, "under-reveal");
    paginaAtual = proximaPagina;
    virandoPagina = false;
    atualizarControles();
  }, duracao);
}

function renderizarLivro() {
  bookStage.innerHTML = "";
  bookStage.appendChild(criarSpread(paginaAtual));
  atualizarControles();
}

function iniciarToqueLivro(evento) {
  const toque = evento.touches[0];

  if (!toque || modal.classList.contains("is-open")) return;

  toqueLivro = {
    x: toque.clientX,
    y: toque.clientY,
    tempo: Date.now()
  };
}

function finalizarToqueLivro(evento) {
  if (!toqueLivro || modal.classList.contains("is-open")) {
    toqueLivro = null;
    return;
  }

  const toque = evento.changedTouches[0];
  if (!toque) {
    toqueLivro = null;
    return;
  }

  const deltaX = toque.clientX - toqueLivro.x;
  const deltaY = toque.clientY - toqueLivro.y;
  const tempo = Date.now() - toqueLivro.tempo;
  toqueLivro = null;

  const movimentoHorizontal = Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35;
  const gestoRapido = tempo < 900;

  if (!movimentoHorizontal || !gestoRapido) return;

  irParaPagina(deltaX < 0 ? paginaAtual + 1 : paginaAtual - 1);
}

function cancelarToqueLivro() {
  toqueLivro = null;
}

function abrirModal(src, legenda) {
  const index = fotosDisponiveis.findIndex((foto) => foto.src === src);

  if (index === -1) {
    mostrarToast("Essa página ainda está esperando a foto do mês.");
    return;
  }

  modalIndex = index;
  atualizarModal();
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function atualizarModal() {
  const foto = fotosDisponiveis[modalIndex];
  imgModal.src = foto.src;
  imgModal.alt = foto.legenda;
  modalCaption.textContent = foto.legenda;
  modalPrev.disabled = fotosDisponiveis.length <= 1;
  modalNext.disabled = fotosDisponiveis.length <= 1;
}

function fecharModal() {
  modal.classList.remove("is-open");
  imgModal.src = "";
  document.body.style.overflow = "";
}

function navegarModal(passo) {
  if (!fotosDisponiveis.length) return;
  modalIndex = (modalIndex + passo + fotosDisponiveis.length) % fotosDisponiveis.length;
  atualizarModal();
}

function prepararImagemOpcional(imagem, classeContainer) {
  const container = imagem.closest(classeContainer);

  imagem.addEventListener("load", () => {
    container.classList.add("has-image");
  });

  imagem.addEventListener("error", () => {
    imagem.removeAttribute("src");
    container.classList.remove("has-image");
  });

  if (imagem.complete && imagem.naturalWidth > 0) {
    container.classList.add("has-image");
  }
}

function iniciarRevelacoes() {
  const elementos = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("is-visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

function criarCoracao() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const coracao = document.createElement("span");
  coracao.className = "heart-particle";
  coracao.textContent = "♥";
  coracao.style.left = `${Math.random() * 94 + 2}vw`;
  coracao.style.animationDuration = `${7 + Math.random() * 5}s`;
  coracao.style.fontSize = `${0.85 + Math.random() * 0.75}rem`;
  document.body.appendChild(coracao);
  coracao.addEventListener("animationend", () => coracao.remove());
}

musicButton.addEventListener("click", alternarMusica);
secretButton.addEventListener("click", () => {
  mostrarToast("Eu te amo muito. Do jeitinho mais meu, mais seu, mais nosso.");
});
printButton.addEventListener("click", () => window.print());
tocButton.addEventListener("click", () => irParaPagina(0));
prevPage.addEventListener("click", () => irParaPagina(paginaAtual - 1));
nextPage.addEventListener("click", () => irParaPagina(paginaAtual + 1));
modalClose.addEventListener("click", fecharModal);
modalPrev.addEventListener("click", () => navegarModal(-1));
modalNext.addEventListener("click", () => navegarModal(1));
bookStage.addEventListener("touchstart", iniciarToqueLivro, { passive: true });
bookStage.addEventListener("touchend", finalizarToqueLivro, { passive: true });
bookStage.addEventListener("touchcancel", cancelarToqueLivro, { passive: true });

modal.addEventListener("click", (evento) => {
  if (evento.target === modal) fecharModal();
});

document.addEventListener("keydown", (evento) => {
  if (modal.classList.contains("is-open")) {
    if (evento.key === "Escape") fecharModal();
    if (evento.key === "ArrowLeft") navegarModal(-1);
    if (evento.key === "ArrowRight") navegarModal(1);
    return;
  }

  if (evento.key === "ArrowLeft") irParaPagina(paginaAtual - 1);
  if (evento.key === "ArrowRight") irParaPagina(paginaAtual + 1);
});

prepararImagemOpcional(document.getElementById("printPhoto"), ".print-photo-frame");
prepararImagemOpcional(document.getElementById("qrImage"), ".qr-frame");
prepararPaginas();
renderizarLivro();
atualizarContador();
setInterval(atualizarContador, 1000);
iniciarRevelacoes();
setInterval(criarCoracao, 950);
