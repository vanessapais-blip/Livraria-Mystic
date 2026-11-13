
const STORAGE_KEY = "mysticPublicacoes";
const RASCUNHO_KEY = "mysticRascunhos";

const form = document.getElementById("formRedacao");

const tipo = document.getElementById("tipo");
const autor = document.getElementById("autor");
const titulo = document.getElementById("titulo");
const tema = document.getElementById("tema");
const conteudo = document.getElementById("conteudo");

const avisoResenha = document.getElementById("avisoResenha");
const contador = document.getElementById("contador");
const mensagem = document.getElementById("mensagem");

const botaoSalvar = document.getElementById("botaoSalvar");


// ==================================
// MENSAGENS
// ==================================

function mostrarMensagem(texto, classe) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + classe;
}


// ==================================
// SELEÇÃO DA MODALIDADE
// ==================================

function atualizarModalidade() {

    const resenhaAtiva = tipo.value === "resenha";

    avisoResenha.style.display = resenhaAtiva
        ? "block"
        : "none";

    conteudo.placeholder = resenhaAtiva
        ? "Escreva sua resenha-desafio aqui..."
        : "Comece a escrever sua redação aqui...";

    conteudo.spellcheck = true;

}

tipo.addEventListener("change", atualizarModalidade);


// ==================================
// CONTADOR
// ==================================

conteudo.addEventListener("input", () => {
    contador.textContent = conteudo.value.length;
});


// ==================================
// BLOQUEIO DE COPIAR E COLAR
// ==================================

function bloquearAcao(evento) {

    if (tipo.value !== "resenha") {
        return;
    }

    evento.preventDefault();

}

conteudo.addEventListener("copy", bloquearAcao);
conteudo.addEventListener("cut", bloquearAcao);
conteudo.addEventListener("paste", bloquearAcao);

conteudo.addEventListener("contextmenu", evento => {

    if (tipo.value === "resenha") {
        evento.preventDefault();
    }

});

conteudo.addEventListener("keydown", evento => {

    if (tipo.value !== "resenha") {
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


// ==================================
// OBTER DADOS DO FORMULÁRIO
// ==================================

function obterDados() {

    return {
        id: Date.now(),
        tipo: tipo.value,
        autor: autor.value.trim(),
        titulo: titulo.value.trim(),
        tema: tema.value.trim(),
        conteudo: conteudo.value.trim(),
        data: new Date().toLocaleDateString("pt-BR")
    };

}

function validarDados(dados) {

    if (
        !dados.autor ||
        !dados.titulo ||
        !dados.tema ||
        !dados.conteudo
    ) {
        mostrarMensagem(
            "Preencha todos os campos antes de continuar.",
            "erro"
        );

        return false;
    }

    if (dados.conteudo.length < 30) {
        mostrarMensagem(
            "Escreva pelo menos 30 caracteres.",
            "erro"
        );

        return false;
    }

    return true;

}


// ==================================
// LER ARMAZENAMENTO
// ==================================

function lerArmazenamento(chave) {

    try {

        const dados = JSON.parse(
            localStorage.getItem(chave) || "[]"
        );

        return Array.isArray(dados) ? dados : [];

    } catch (erro) {

        return [];

    }

}


// ==================================
// SALVAR RASCUNHO
// ==================================

botaoSalvar.addEventListener("click", () => {

    const dados = obterDados();

    if (!validarDados(dados)) {
        return;
    }

    const rascunhos = lerArmazenamento(RASCUNHO_KEY);

    const novoRascunho = {
        ...dados,
        salvoEm: new Date().toISOString()
    };

    rascunhos.unshift(novoRascunho);

    try {

        localStorage.setItem(
            RASCUNHO_KEY,
            JSON.stringify(rascunhos)
        );

        mostrarMensagem(
            "Rascunho salvo com sucesso! Você poderá continuar sua escrita depois, neste navegador.",
            "sucesso"
        );

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível salvar. Verifique o espaço disponível no navegador.",
            "erro"
        );

    }

});


// ==================================
// PUBLICAR
// ==================================

form.addEventListener("submit", evento => {

    evento.preventDefault();

    const dados = obterDados();

    if (!validarDados(dados)) {
        return;
    }

    const publicacoes = lerArmazenamento(STORAGE_KEY);

    publicacoes.unshift(dados);

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(publicacoes)
        );

        mostrarMensagem(
            "Publicação realizada com sucesso! Abrindo a página de redações...",
            "sucesso"
        );

        form.reset();

        contador.textContent = "0";

        atualizarModalidade();

        setTimeout(() => {
            location.href = "redacoes.html";
        }, 1200);

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível publicar. Verifique o espaço disponível no navegador.",
            "erro"
        );

    }

});


// ==================================
// INICIALIZAÇÃO
// ==================================

atualizarModalidade();
