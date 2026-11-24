// =====================================================
// Proteção das páginas internas + botão "Sair"
// Carregado no <head> do perfil e da consulta.
// =====================================================

// Procura o usuário nas duas memórias do navegador:
// localStorage = "Lembrar de mim" marcado; sessionStorage = só esta aba
function usuarioLogado() {
    return localStorage.getItem("usuarioLogado") || sessionStorage.getItem("usuarioLogado");
}

// Se ninguém fez login, volta para a tela de login
if (!usuarioLogado()) {
    window.location.replace("../index.html");
}

document.addEventListener("DOMContentLoaded", function () {
    const botoesSair = document.querySelectorAll("[data-sair]");

    botoesSair.forEach(function (botao) {
        botao.addEventListener("click", function () {
            localStorage.removeItem("usuarioLogado");
            sessionStorage.removeItem("usuarioLogado");
            window.location.href = "../index.html";
        });
    });
});
