// =====================================================
// Dados da estante (usado pela Consulta e pelo Perfil)
// A estante fica salva no localStorage do navegador.
// Na primeira vez, começa com a lista padrão abaixo.
// =====================================================

const JOGOS_PADRAO = [
    { id: 1, nome: "Cyberpunk 2077", plataformas: ["PC"], genero: "RPG", ano: 2020, status: "Jogando", nota: 9.5, capa: "../img/capas/cyberpunk-2077.webp" },
    { id: 15, nome: "League of Legends", plataformas: ["PC"], genero: "MOBA", ano: 2009, status: "Online", nota: 10, capa: "../img/capas/league-of-legends.webp" },
    { id: 13, nome: "Dead by Daylight", plataformas: ["PC", "PlayStation", "Xbox"], genero: "Terror", ano: 2016, status: "Online", nota: 8.3, capa: "../img/capas/dead-by-daylight.webp" },
    { id: 2, nome: "Elden Ring", plataformas: ["Xbox", "PlayStation", "PC"], genero: "RPG", ano: 2022, status: "Zerado", nota: 10, capa: "../img/capas/elden-ring.webp" },
    { id: 3, nome: "Red Dead Redemption 2", plataformas: ["PlayStation"], genero: "Ação", ano: 2018, status: "Zerado", nota: 10, capa: "../img/capas/red-dead-2.webp" },
    { id: 4, nome: "Marvel's Spider-Man", plataformas: ["PlayStation"], genero: "Ação", ano: 2018, status: "Zerado", nota: 10, capa: "../img/capas/spider-man.webp" },
    { id: 5, nome: "Resident Evil 2", plataformas: ["PlayStation"], genero: "Terror", ano: 2019, status: "Zerado", nota: 9.7, capa: "../img/capas/resident-evil-2.webp" },
    { id: 6, nome: "Resident Evil Requiem", plataformas: ["PC"], genero: "Terror", ano: 2026, status: "Zerado", nota: 9.3, capa: "../img/capas/resident-evil-requiem.webp" },
    { id: 7, nome: "Star Wars Jedi: Survivor", plataformas: ["PlayStation"], genero: "Ação", ano: 2023, status: "Zerado", nota: 9.1, capa: "../img/capas/jedi-survivor.webp" },
    { id: 8, nome: "Resident Evil 4", plataformas: ["PlayStation"], genero: "Terror", ano: 2023, status: "Zerado", nota: 9.1, capa: "../img/capas/resident-evil-4.webp" },
    { id: 9, nome: "Marvel's Spider-Man 2", plataformas: ["PlayStation"], genero: "Ação", ano: 2023, status: "Zerado", nota: 9.1, capa: "../img/capas/spider-man-2.webp" },
    { id: 10, nome: "Dark Souls III", plataformas: ["PC"], genero: "RPG", ano: 2016, status: "Zerado", nota: 9.0, capa: "../img/capas/dark-souls-3.webp" },
    { id: 11, nome: "Star Wars Jedi: Fallen Order", plataformas: ["PlayStation"], genero: "Ação", ano: 2019, status: "Zerado", nota: 8.8, capa: "../img/capas/jedi-fallen-order.webp" },
    { id: 12, nome: "Assassin's Creed Unity", plataformas: ["PlayStation"], genero: "Ação", ano: 2014, status: "Zerado", nota: 8.5, capa: "../img/capas/assassins-creed-unity.webp" },
    { id: 14, nome: "Marvel's Spider-Man: Miles Morales", plataformas: ["PlayStation"], genero: "Ação", ano: 2020, status: "Zerado", nota: 8.0, capa: "../img/capas/spider-man-miles-morales.webp" }
];

// O número muda quando a lista padrão muda, para ninguém ficar com a lista antiga salva
const CHAVE_ESTANTE = "estante-v3";

// Lê a estante salva. Se não tiver nada salvo, usa a lista padrão.
function carregarJogos() {
    const salva = localStorage.getItem(CHAVE_ESTANTE);
    return salva ? JSON.parse(salva) : JOGOS_PADRAO.slice();
}

// Salva a estante. Devolve false se o navegador não tiver espaço.
function salvarJogos(jogos) {
    try {
        localStorage.setItem(CHAVE_ESTANTE, JSON.stringify(jogos));
        return true;
    } catch (erro) {
        return false;
    }
}

// Um jogo pode ter mais de uma plataforma (ex.: Elden Ring)
function plataformasDe(jogo) {
    return jogo.plataformas || [jogo.plataforma];
}

// Formata a nota no padrão brasileiro: 9.5 -> "9,5"
function formatarNota(nota) {
    return nota.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Conta os jogos por status e calcula a nota média
function calcularEstatisticas(jogos) {
    const comNota = jogos.filter(function (jogo) {
        return jogo.nota !== null;
    });
    const soma = comNota.reduce(function (total, jogo) {
        return total + jogo.nota;
    }, 0);

    return {
        zerados: jogos.filter(function (jogo) { return jogo.status === "Zerado"; }).length,
        jogando: jogos.filter(function (jogo) { return jogo.status === "Jogando"; }).length,
        fila: jogos.filter(function (jogo) { return jogo.status === "Na fila"; }).length,
        online: jogos.filter(function (jogo) { return jogo.status === "Online"; }).length,
        media: comNota.length > 0 ? formatarNota(soma / comNota.length) : "—"
    };
}
