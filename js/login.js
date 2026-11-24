/*
Descricao: Projeto integrador - Blog de Conteúdo sobre games
nome_arquivo: login.js
nome_exercicio: Situação de Aprendizagem 02 - Sistema Game Over (login, perfil e consulta)
nome_aluno: Nicolas Safra Gazige
email_aluno: nicolas.gazige@aluno.cps.sp.gov.br
turma: WEBI-ISW028-A
*/

// =====================================================
// Tela de Login
// Como o projeto é só front-end, a conta de teste fica
// aqui no JS. Num sistema real, isso seria validado no servidor.
// =====================================================

const CONTA_TESTE = {
    email: "jogador@gameover.com",
    senha: "gameover123"
};

const formLogin = document.getElementById("form-login");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const campoLembrar = document.getElementById("lembrar");
const btnVerSenha = document.getElementById("btn-ver-senha");
const alertaLogin = document.getElementById("alerta-login");

// Se já estiver logado, vai direto para o perfil
if (localStorage.getItem("usuarioLogado") || sessionStorage.getItem("usuarioLogado")) {
    window.location.replace("pages/perfil.html");
}

// Mostrar / esconder senha
btnVerSenha.addEventListener("click", function () {
    const escondida = campoSenha.type === "password";

    campoSenha.type = escondida ? "text" : "password";
    btnVerSenha.textContent = escondida ? "Ocultar" : "Mostrar";
    btnVerSenha.setAttribute("aria-label", escondida ? "Ocultar senha" : "Mostrar senha");
    btnVerSenha.setAttribute("aria-pressed", escondida ? "true" : "false");
});

// Marca o campo como válido/inválido usando as classes do Bootstrap
function validarCampo(campo) {
    const valido = campo.checkValidity();
    campo.classList.toggle("is-invalid", !valido);
    return valido;
}

// Tira o erro enquanto o usuário corrige
[campoEmail, campoSenha].forEach(function (campo) {
    campo.addEventListener("input", function () {
        if (campo.classList.contains("is-invalid")) {
            validarCampo(campo);
        }
        alertaLogin.classList.add("d-none");
    });
});

formLogin.onsubmit = function (event) {
    event.preventDefault();

    const emailOk = validarCampo(campoEmail);
    const senhaOk = validarCampo(campoSenha);

    if (!emailOk || !senhaOk) {
        // Leva o foco para o primeiro campo com erro
        (emailOk ? campoSenha : campoEmail).focus();
        return;
    }

    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (email !== CONTA_TESTE.email || senha !== CONTA_TESTE.senha) {
        alertaLogin.textContent = "E-mail ou senha incorretos. Confira os dados e tente novamente.";
        alertaLogin.classList.remove("d-none");
        campoSenha.value = "";
        campoSenha.focus();
        return;
    }

    // Login certo: guarda quem entrou
    const memoria = campoLembrar.checked ? localStorage : sessionStorage;
    memoria.setItem("usuarioLogado", email);

    window.location.href = "pages/perfil.html";
};
