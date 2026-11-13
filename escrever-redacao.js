
const STORAGE_KEY = "mysticPublicacoes";

const form = document.getElementById("formRedacao");
const conteudo = document.getElementById("conteudo");
const autor = document.getElementById("autor");
const titulo = document.getElementById("titulo");
const tema = document.getElementById("tema");

const abaRedacao = document.getElementById("abaRedacao");
const abaResenha = document.getElementById("abaResenha");

const tituloPagina = document.getElementById("tituloPagina");
const descricaoPagina = document.getElementById("descricaoPagina");
const labelConteudo = document.getElementById("labelConteudo");
const informacaoTexto = document.getElementById("informacaoTexto");

const avisoResenha = document.getElementById("avisoResenha");
const contador = document.getElementById("contador");

const mensagem = document.getElementById("mensagem");
const botaoRevisar = document.getElementById("botaoRevisar");

const areaRevisao = document.getElementById("areaRevisao");
const resultadoRevisao = document.getElementById("resultadoRevisao");

let modalidadeAtual = "redacao";


// =====================================
// TROCA DE MODALIDADE
// =====================================

function selecionarModalidade(tipo) {

    modalidadeAtual = tipo;

    abaRedacao.classList.toggle(
        "ativa",
        tipo === "redacao"
    );

    abaResenha.classList.toggle(
        "ativa",
        tipo === "resenha"
    );

    if (tipo === "redacao") {

        tituloPagina.textContent = "Criar redação";

        descricaoPagina.textContent =
            "Desenvolva suas ideias e compartilhe sua produção com a comunidade Mystic.";

        labelConteudo.textContent = "Sua redação";

        conteudo.placeholder =
            "Comece a desenvolver sua redação aqui...";

        informacaoTexto.textContent =
            "Você pode editar, copiar e colar normalmente nesta modalidade.";

        avisoResenha.style.display = "none";

        conteudo.setAttribute("spellcheck", "true");

    } else {

        tituloPagina.textContent = "Resenha-desafio";

        descricaoPagina.textContent =
            "Uma modalidade especial para testar sua escrita e desenvolver sua interpretação.";

        labelConteudo.textContent = "Sua resenha";

        conteudo.placeholder =
            "Comece a escrever sua resenha-desafio aqui...";

        informacaoTexto.textContent =
            "Os comandos comuns de copiar, recortar e colar ficam bloqueados neste campo.";

        avisoResenha.style.display = "block";

        conteudo.setAttribute("spellcheck", "true");
    }

    mensagem.className = "mensagem";
    mensagem.textContent = "";

    areaRevisao.style.display = "none";
}

abaRedacao.addEventListener("click", () => {
    selecionarModalidade("redacao");
});

abaResenha.addEventListener("click", () => {
    selecionarModalidade("resenha");
});


// =====================================
// CONTADOR DE CARACTERES
// =====================================

conteudo.addEventListener("input", () => {

    contador.textContent = conteudo.value.length;

    areaRevisao.style.display = "none";

});


// =====================================
// BLOQUEIO BÁSICO NA RESENHA
// =====================================

function bloquearClipboard(evento) {

    if (modalidadeAtual !== "resenha") {
        return;
    }

    evento.preventDefault();

}

conteudo.addEventListener("copy", bloquearClipboard);
conteudo.addEventListener("cut", bloquearClipboard);
conteudo.addEventListener("paste", bloquearClipboard);

conteudo.addEventListener("contextmenu", evento => {

    if (modalidadeAtual === "resenha") {
        evento.preventDefault();
    }

});

conteudo.addEventListener("keydown", evento => {

    if (modalidadeAtual !== "resenha") {
        return;
    }

    const tecla = evento.key.toLowerCase();

    if (
        (evento.ctrlKey || evento.metaKey) &&
        ["c", "x", "v"].includes(tecla)
    ) {
        evento.preventDefault();
    }

});


// =====================================
// MENSAGENS
// =====================================

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;

}


// =====================================
// SALVAR PUBLICAÇÃO
// =====================================

form.addEventListener("submit", evento => {

    evento.preventDefault();

    const nomeAutor = autor.value.trim();
    const tituloTexto = titulo.value.trim();
    const temaTexto = tema.value.trim();
    const texto = conteudo.value.trim();

    if (!nomeAutor || !tituloTexto || !temaTexto || !texto) {

        mostrarMensagem(
            "Preencha todos os campos antes de publicar.",
            "erro"
        );

        return;
    }

    if (texto.length < 30) {

        mostrarMensagem(
            "Seu texto precisa ter pelo menos 30 caracteres.",
            "erro"
        );

        return;
    }

    let publicacoes = [];

    try {

        publicacoes = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(publicacoes)) {
            publicacoes = [];
        }

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível acessar suas publicações salvas.",
            "erro"
        );

        return;
    }

    const novaPublicacao = {

        id: Date.now(),

        tipo: modalidadeAtual,

        titulo: tituloTexto,

        tema: temaTexto,

        autor: nomeAutor,

        conteudo: texto,

        data: new Date().toLocaleDateString("pt-BR")

    };

    publicacoes.unshift(novaPublicacao);

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(publicacoes)
        );

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível salvar. O armazenamento do navegador pode estar cheio.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        "Sua publicação foi salva com sucesso! Redirecionando...",
        "sucesso"
    );

    form.reset();

    contador.textContent = "0";

    areaRevisao.style.display = "none";

    setTimeout(() => {

        window.location.href = "redacoes.html";

    }, 1200);

});


// =====================================
// REVISOR DE IA
// =====================================

botaoRevisar.addEventListener("click", async () => {

    const texto = conteudo.value.trim();

    if (texto.length < 30) {

        mostrarMensagem(
            "Escreva pelo menos 30 caracteres antes de solicitar uma revisão.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        "O revisor de IA ainda precisa ser conectado a um servidor seguro.",
        "aviso"
    );

    /*
       FUTURA INTEGRAÇÃO:

       O botão será conectado a um servidor externo
       que receberá o texto e devolverá a análise da IA.

       Não coloque chaves de API neste arquivo público.

       A integração será feita por uma chamada ao backend,
       com autenticação e proteção da chave no servidor.
    */

});


// =====================================
// INICIALIZAÇÃO
// =====================================

selecionarModalidade("redacao");

contador.textContent = "0";

