/*
Descricao: Projeto integrador - Blog de Conteúdo sobre games
nome_arquivo: perfil.js
nome_exercicio: Situação de Aprendizagem 02 - Sistema Game Over (login, perfil e consulta)
nome_aluno: Nicolas Safra Gazige
email_aluno: nicolas.gazige@aluno.cps.sp.gov.br
turma: WEBI-ISW028-A
*/

// =====================================================
// Tela de Perfil
// Mostra os dados do jogador e permite editar.
// As alterações ficam salvas no localStorage.
// =====================================================

const PERFIL_PADRAO = {
    nome: "Nicolas Safra",
    usuario: "nicolas.go",
    email: "jogador@gameover.com",
    plataforma: "PlayStation",
    bio: "Não sei planejar, só sei dar Flash + R na hora certa. Às vezes na hora errada também. DEMACIA!"
};

const formPerfil = document.getElementById("form-perfil");
const alertaPerfil = document.getElementById("alerta-perfil");
const campoBio = document.getElementById("campo-bio");
const contadorBio = document.getElementById("contador-bio");

const campos = {
    nome: document.getElementById("campo-nome"),
    usuario: document.getElementById("campo-usuario"),
    email: document.getElementById("campo-email"),
    plataforma: document.getElementById("campo-plataforma"),
    bio: campoBio
};

// Lê o perfil salvo (ou usa o padrão)
function carregarPerfil() {
    const salvo = localStorage.getItem("perfil");
    return salvo ? JSON.parse(salvo) : { ...PERFIL_PADRAO };
}

// Atualiza o cartão da esquerda
function mostrarPerfil(perfil) {
    document.getElementById("perfil-nome").textContent = perfil.nome;
    document.getElementById("perfil-usuario").textContent = "@" + perfil.usuario;
    document.getElementById("perfil-email").textContent = perfil.email;
    document.getElementById("perfil-plataforma").textContent = perfil.plataforma;
    document.getElementById("perfil-bio").textContent = perfil.bio || "Sem descrição.";
}

// Coloca os dados dentro do formulário
function preencherFormulario(perfil) {
    for (const chave in campos) {
        campos[chave].value = perfil[chave];
    }
    atualizarContador();
}

function atualizarContador() {
    const restante = campoBio.maxLength - campoBio.value.length;
    contadorBio.textContent = restante + " caracteres restantes";
}

campoBio.addEventListener("input", atualizarContador);

// Remove o erro do campo assim que o usuário corrige
Object.values(campos).forEach(function (campo) {
    campo.addEventListener("input", function () {
        if (campo.classList.contains("is-invalid")) {
            campo.classList.toggle("is-invalid", !campo.checkValidity());
        }
        alertaPerfil.classList.add("d-none");
    });
});

formPerfil.onsubmit = function (event) {
    event.preventDefault();

    // Validação antes de salvar
    let primeiroErro = null;
    Object.values(campos).forEach(function (campo) {
        const valido = campo.checkValidity();
        campo.classList.toggle("is-invalid", !valido);
        if (!valido && !primeiroErro) {
            primeiroErro = campo;
        }
    });

    if (primeiroErro) {
        primeiroErro.focus();
        return;
    }

    const perfil = {
        nome: campos.nome.value.trim(),
        usuario: campos.usuario.value.trim(),
        email: campos.email.value.trim(),
        plataforma: campos.plataforma.value,
        bio: campos.bio.value.trim()
    };

    localStorage.setItem("perfil", JSON.stringify(perfil));
    mostrarPerfil(perfil);
    alertaPerfil.classList.remove("d-none");
};

// Botão "Desfazer": volta para os dados salvos
formPerfil.addEventListener("reset", function (event) {
    event.preventDefault();
    preencherFormulario(carregarPerfil());
    Object.values(campos).forEach(function (campo) {
        campo.classList.remove("is-invalid");
    });
    alertaPerfil.classList.add("d-none");
});

// Estatísticas calculadas a partir da estante (js/jogos.js)
const estatisticas = calcularEstatisticas(carregarJogos());
document.getElementById("qtd-zerados").textContent = estatisticas.zerados;
document.getElementById("qtd-jogando").textContent = estatisticas.jogando;
document.getElementById("qtd-online").textContent = estatisticas.online;
document.getElementById("qtd-fila").textContent = estatisticas.fila;
document.getElementById("nota-media").textContent = estatisticas.media;

// Ao abrir a página
const perfilAtual = carregarPerfil();
mostrarPerfil(perfilAtual);
preencherFormulario(perfilAtual);
