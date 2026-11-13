
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
const botaoCorrigir = document.getElementById("botaoCorrigir");

const resultadoPublicacao = document.getElementById("resultadoPublicacao");
const painelEscrita = document.getElementById("painelEscrita");


// =====================================
// MODALIDADE
// =====================================

function atualizarModalidade() {

    const resenha = tipo.value === "resenha";

    avisoResenha.style.display = resenha ? "block" : "none";

    conteudo.placeholder = resenha
        ? "Escreva sua resenha-desafio aqui..."
        : "Comece a escrever sua redação aqui...";

}

tipo.addEventListener("change", atualizarModalidade);


// =====================================
// CONTADOR
// =====================================

conteudo.addEventListener("input", () => {
    contador.textContent = conteudo.value.length;
});


// =====================================
// BLOQUEIO NA RESENHA
// =====================================

function bloquearClipboard(evento) {

    if (tipo.value === "resenha") {
        evento.preventDefault();
    }

}

conteudo.addEventListener("copy", bloquearClipboard);
conteudo.addEventListener("cut", bloquearClipboard);
conteudo.addEventListener("paste", bloquearClipboard);

conteudo.addEventListener("contextmenu", evento => {

    if (tipo.value === "resenha") {
        evento.preventDefault();
    }

});

conteudo.addEventListener("keydown", evento => {

    if (tipo.value !== "resenha") return;

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

function mostrarMensagem(texto, classe) {

    mensagem.textContent = texto;
    mensagem.className = "mensagem " + classe;

}

function limparMensagem() {

    mensagem.textContent = "";
    mensagem.className = "mensagem";

}


// =====================================
// DADOS DO FORMULÁRIO
// =====================================

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
            "Seu texto precisa ter pelo menos 30 caracteres.",
            "erro"
        );

        return false;
    }

    return true;

}


// =====================================
// LEITURA DO ARMAZENAMENTO
// =====================================

function lerDados(chave) {

    try {

        const dados = JSON.parse(
            localStorage.getItem(chave) || "[]"
        );

        return Array.isArray(dados) ? dados : [];

    } catch (erro) {

        return [];

    }

}


// =====================================
// SALVAR RASCUNHO
// =====================================

botaoSalvar.addEventListener("click", () => {

    const dados = obterDados();

    if (!validarDados(dados)) return;

    const rascunhos = lerDados(RASCUNHO_KEY);

    rascunhos.unshift({
        ...dados,
        salvoEm: new Date().toISOString()
    });

    try {

        localStorage.setItem(
            RASCUNHO_KEY,
            JSON.stringify(rascunhos)
        );

        mostrarMensagem(
            "Sua redação foi salva como rascunho!",
            "sucesso"
        );

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível salvar. Verifique o armazenamento do navegador.",
            "erro"
        );

    }

});


// =====================================
// CORRIGIR
// =====================================

botaoCorrigir.addEventListener("click", () => {

    if (!conteudo.value.trim()) {

        mostrarMensagem(
            "Escreva seu texto antes de solicitar a correção.",
            "erro"
        );

        conteudo.focus();
        return;
    }

    mostrarMensagem(
        "O corretor ortográfico do navegador está ativado. As sugestões de escrita aparecem no próprio campo de texto. A correção completa por IA ainda precisa ser conectada a um servidor.",
        "aviso-mensagem"
    );

    conteudo.focus();

});


// =====================================
// PUBLICAR
// =====================================

form.addEventListener("submit", evento => {

    evento.preventDefault();

    const dados = obterDados();

    if (!validarDados(dados)) return;

    const publicacoes = lerDados(STORAGE_KEY);

    publicacoes.unshift(dados);

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(publicacoes)
        );

        // Esconde o formulário após a publicação.
        form.classList.add("oculto");

        mensagem.className = "mensagem";

        resultadoPublicacao.style.display = "block";

        resultadoPublicacao.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível publicar. Verifique o armazenamento do navegador.",
            "erro"
        );

    }

});


// =====================================
// CRIAR OUTRA PUBLICAÇÃO
// =====================================

document.getElementById("botaoNova").addEventListener("click", () => {

    form.reset();

    contador.textContent = "0";

    atualizarModalidade();

    limparMensagem();

    resultadoPublicacao.style.display = "none";

    form.classList.remove("oculto");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =====================================
// VOLTAR AO INÍCIO
// =====================================

document.getElementById("botaoInicio").addEventListener("click", () => {

    window.location.href = "home.html";

});


// =====================================
// INICIALIZAÇÃO
// =====================================

atualizarModalidade();
