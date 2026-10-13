
/* =========================================
   MYSTIC — LEITOR DE TEXTO
   Arquivo: leitor.js
   ========================================= */

(function () {
  "use strict";

  if (!("speechSynthesis" in window)) {
    console.warn("Este navegador não oferece leitura de texto em voz alta.");
    return;
  }

  const leitor = window.speechSynthesis;

  let vozes = [];
  let textoAtual = "";
  let idiomaAtual = "pt-BR";
  let velocidadeAtual = 1;
  let vozSelecionada = null;

  // Atualiza as vozes disponíveis no dispositivo.
  function carregarVozes() {
    vozes = leitor.getVoices();

    if (vozSelecionada) {
      const atual = vozes.find(
        voz => voz.name === vozSelecionada.name
      );

      if (atual) vozSelecionada = atual;
    }
  }

  carregarVozes();
  leitor.addEventListener("voiceschanged", carregarVozes);

  // Escolhe uma voz adequada ao idioma.
  function encontrarVoz(idioma) {
    const idiomaBase = idioma.toLowerCase().split("-")[0];

    return (
      vozes.find(voz =>
        voz.lang.toLowerCase() === idioma.toLowerCase()
      ) ||
      vozes.find(voz =>
        voz.lang.toLowerCase().startsWith(idiomaBase)
      ) ||
      null
    );
  }

  // Define o texto que será lido.
  function definirTexto(texto, idioma) {
    if (typeof texto !== "string" || !texto.trim()) {
      console.warn("O Mystic Reader precisa de um texto para ler.");
      return false;
    }

    textoAtual = texto.trim();

    if (idioma) {
      idiomaAtual = idioma;
    }

    return true;
  }

  // Inicia a leitura.
  function ler(texto, idioma) {
    if (texto !== undefined) {
      if (!definirTexto(texto, idioma)) return;
    }

    if (!textoAtual) {
      console.warn("Nenhum texto foi definido para leitura.");
      return;
    }

    leitor.cancel();

    const fala = new SpeechSynthesisUtterance(textoAtual);

    fala.lang = idiomaAtual;
    fala.rate = velocidadeAtual;
    fala.pitch = 1;
    fala.volume = 1;

    vozSelecionada = encontrarVoz(idiomaAtual);

    if (vozSelecionada) {
      fala.voice = vozSelecionada;
    }

    leitor.speak(fala);
  }

  // Pausa a leitura atual.
  function pausar() {
    if (leitor.speaking && !leitor.paused) {
      leitor.pause();
    }
  }

  // Continua uma leitura pausada.
  function continuar() {
    if (leitor.paused) {
      leitor.resume();
    } else if (!leitor.speaking && textoAtual) {
      ler();
    }
  }

  // Para a leitura e limpa a fila de fala.
  function parar() {
    leitor.cancel();
  }

  // Ajusta a velocidade de 0.5 até 2.
  function definirVelocidade(velocidade) {
    const valor = Number(velocidade);

    if (!Number.isFinite(valor)) return;

    velocidadeAtual = Math.min(2, Math.max(0.5, valor));
  }

  // Altera o idioma da leitura.
  function definirIdioma(idioma) {
    const permitidos = ["pt-BR", "pt-PT", "en-US", "en-GB", "en"];

    if (permitidos.includes(idioma)) {
      idiomaAtual = idioma;
      vozSelecionada = encontrarVoz(idioma);
    }
  }

  // Lê automaticamente o conteúdo de um elemento HTML.
  function lerElemento(seletor, idioma) {
    const elemento = document.querySelector(seletor);

    if (!elemento) {
      console.warn("Elemento não encontrado:", seletor);
      return;
    }

    definirTexto(elemento.innerText || elemento.textContent, idioma);
    ler();
  }

  // Disponibiliza os controles para o restante do site.
  window.MysticReader = {
    ler,
    pausar,
    continuar,
    parar,
    definirTexto,
    definirIdioma,
    definirVelocidade,
    lerElemento,

    obterVozes() {
      return [...vozes];
    },

    estaLendo() {
      return leitor.speaking;
    },

    estaPausado() {
      return leitor.paused;
    }
  };
})();

