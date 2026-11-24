// =====================================================
// Tela de Consulta
// - monta a tabela a partir da estante salva (js/jogos.js)
// - filtro visual (pesquisa, plataforma e status)
// - adicionar jogo com capa e remover jogo
// =====================================================

const corpoTabela = document.getElementById("corpo-tabela");
const campoPesquisa = document.getElementById("pesquisa");
const filtroPlataforma = document.getElementById("filtro-plataforma");
const filtroStatus = document.getElementById("filtro-status");
const formFiltros = document.getElementById("form-filtros");
const contadorResultados = document.getElementById("contador-resultados");
const semResultados = document.getElementById("sem-resultados");

let jogos = carregarJogos();


// ---------- Montar a tabela ----------

// Cria uma célula <td> com texto (textContent evita que o
// texto digitado pelo usuário seja lido como HTML)
function criarCelula(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function criarLinha(jogo) {
    const tr = document.createElement("tr");
    tr.dataset.id = jogo.id;
    tr.dataset.plataformas = plataformasDe(jogo).join("|");
    tr.dataset.status = jogo.status;

    // Capa + nome
    const tdJogo = document.createElement("td");
    const divJogo = document.createElement("div");
    divJogo.className = "jogo";

    const img = document.createElement("img");
    img.src = jogo.capa || "../img/capa-vazia.svg";
    img.alt = "";
    img.width = 40;
    img.height = 53;
    img.loading = "lazy";

    const nome = document.createElement("span");
    nome.textContent = jogo.nome;

    divJogo.appendChild(img);
    divJogo.appendChild(nome);
    tdJogo.appendChild(divJogo);
    tr.appendChild(tdJogo);

    tr.appendChild(criarCelula(plataformasDe(jogo).join(", ")));
    tr.appendChild(criarCelula(jogo.genero));
    tr.appendChild(criarCelula(jogo.ano));

    // Selo de status
    const classesStatus = { "Zerado": "status-zerado", "Jogando": "status-jogando", "Online": "status-online", "Na fila": "status-fila" };
    const tdStatus = document.createElement("td");
    const selo = document.createElement("span");
    selo.className = "selo " + classesStatus[jogo.status];
    selo.textContent = jogo.status;
    tdStatus.appendChild(selo);
    tr.appendChild(tdStatus);

    // Nota
    const tdNota = document.createElement("td");
    tdNota.className = "text-end";
    const nota = document.createElement("span");
    if (jogo.nota !== null) {
        nota.className = "nota";
        nota.textContent = formatarNota(jogo.nota);
    } else {
        nota.className = "texto-suave";
        nota.textContent = "—";
        nota.setAttribute("aria-label", "Sem nota");
    }
    tdNota.appendChild(nota);
    tr.appendChild(tdNota);

    // Botão remover
    const tdAcoes = document.createElement("td");
    tdAcoes.className = "text-end";
    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.className = "btn-remover";
    btnRemover.textContent = "✕";
    btnRemover.setAttribute("aria-label", "Remover " + jogo.nome + " da estante");
    btnRemover.title = "Remover da estante";
    btnRemover.addEventListener("click", function () {
        removerJogo(jogo.id);
    });
    tdAcoes.appendChild(btnRemover);
    tr.appendChild(tdAcoes);

    return tr;
}

function montarTabela() {
    corpoTabela.innerHTML = "";
    jogos.forEach(function (jogo) {
        corpoTabela.appendChild(criarLinha(jogo));
    });
    filtrarTabela();
}


// ---------- Filtro visual ----------

// Tira acentos e deixa minúsculo, para "acao" achar "Ação"
function normalizar(texto) {
    return String(texto).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function filtrarTabela() {
    const termo = normalizar(campoPesquisa.value);
    const plataforma = filtroPlataforma.value;
    const status = filtroStatus.value;
    let visiveis = 0;

    corpoTabela.querySelectorAll("tr").forEach(function (linha) {
        const combinaTexto = normalizar(linha.textContent).includes(termo);
        const combinaPlataforma = plataforma === "" || linha.dataset.plataformas.split("|").includes(plataforma);
        const combinaStatus = status === "" || linha.dataset.status === status;

        const mostrar = combinaTexto && combinaPlataforma && combinaStatus;
        linha.classList.toggle("d-none", !mostrar);
        if (mostrar) {
            visiveis++;
        }
    });

    contadorResultados.textContent = visiveis + (visiveis === 1 ? " jogo" : " jogos");
    semResultados.textContent = jogos.length === 0
        ? "Sua estante está vazia. Clique em \"+ Adicionar jogo\" para começar."
        : "Nenhum jogo encontrado com esses filtros.";
    semResultados.classList.toggle("d-none", visiveis > 0);
}

campoPesquisa.addEventListener("input", filtrarTabela);
filtroPlataforma.addEventListener("change", filtrarTabela);
filtroStatus.addEventListener("change", filtrarTabela);

formFiltros.onsubmit = function (event) {
    event.preventDefault(); // Enter na pesquisa não recarrega a página
};


// ---------- Remover jogo ----------

function removerJogo(id) {
    const jogo = jogos.find(function (j) { return j.id === id; });
    if (!jogo || !confirm("Remover \"" + jogo.nome + "\" da sua estante?")) {
        return;
    }

    jogos = jogos.filter(function (j) { return j.id !== id; });
    salvarJogos(jogos);
    montarTabela();
}


// ---------- Adicionar jogo ----------

const modalJogo = document.getElementById("modal-jogo");
const formJogo = document.getElementById("form-jogo");
const alertaJogo = document.getElementById("alerta-jogo");
const campoCapa = document.getElementById("campo-capa");
const previaCapa = document.getElementById("previa-capa");
const campoStatus = document.getElementById("campo-status");
const campoNota = document.getElementById("campo-nota");
const CAPA_VAZIA = "../img/capa-vazia.svg";
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5 MB

let capaConvertida = null; // imagem já reduzida, em WebP

const camposJogo = [
    document.getElementById("campo-nome-jogo"),
    document.getElementById("campo-plataforma-jogo"),
    document.getElementById("campo-genero"),
    document.getElementById("campo-ano"),
    campoNota
];

// Reduz a imagem para 120x160 (recortando o excesso) e converte para WebP.
// Assim cada capa fica com poucos KB, em vez de vários MB.
function otimizarImagem(arquivo) {
    return new Promise(function (resolver, rejeitar) {
        const leitor = new FileReader();

        leitor.onload = function () {
            const imagem = new Image();

            imagem.onload = function () {
                const largura = 120;
                const altura = 160;
                const canvas = document.createElement("canvas");
                canvas.width = largura;
                canvas.height = altura;

                // Recorta o centro mantendo a proporção 3:4
                const escala = Math.max(largura / imagem.width, altura / imagem.height);
                const w = imagem.width * escala;
                const h = imagem.height * escala;
                const contexto = canvas.getContext("2d");
                contexto.drawImage(imagem, (largura - w) / 2, (altura - h) / 2, w, h);

                resolver(canvas.toDataURL("image/webp", 0.8));
            };

            imagem.onerror = rejeitar;
            imagem.src = leitor.result;
        };

        leitor.onerror = rejeitar;
        leitor.readAsDataURL(arquivo);
    });
}

function mostrarErro(mensagem) {
    alertaJogo.textContent = mensagem;
    alertaJogo.classList.remove("d-none");
}

campoCapa.addEventListener("change", function () {
    const arquivo = campoCapa.files[0];
    alertaJogo.classList.add("d-none");
    capaConvertida = null;
    previaCapa.src = CAPA_VAZIA;

    if (!arquivo) {
        return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(arquivo.type)) {
        mostrarErro("Escolha uma imagem PNG, JPG ou WebP.");
        campoCapa.value = "";
        return;
    }

    if (arquivo.size > TAMANHO_MAXIMO) {
        mostrarErro("A imagem passa de 5 MB. Escolha uma menor.");
        campoCapa.value = "";
        return;
    }

    otimizarImagem(arquivo)
        .then(function (resultado) {
            capaConvertida = resultado;
            previaCapa.src = resultado;
        })
        .catch(function () {
            mostrarErro("Não foi possível ler essa imagem. Tente outra.");
            campoCapa.value = "";
        });
});

// "Na fila" ainda não foi jogado, então não tem nota
campoStatus.addEventListener("change", function () {
    const naFila = campoStatus.value === "Na fila";
    campoNota.disabled = naFila;
    if (naFila) {
        campoNota.value = "";
        campoNota.classList.remove("is-invalid");
    }
});

// Tira o erro do campo enquanto o usuário corrige
camposJogo.forEach(function (campo) {
    campo.addEventListener("input", function () {
        if (campo.classList.contains("is-invalid")) {
            campo.classList.toggle("is-invalid", !campo.checkValidity());
        }
    });
});

formJogo.onsubmit = function (event) {
    event.preventDefault();

    // Validação antes de adicionar
    let primeiroErro = null;
    camposJogo.forEach(function (campo) {
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

    const novoJogo = {
        id: Date.now(),
        nome: camposJogo[0].value.trim(),
        plataformas: [camposJogo[1].value],
        genero: camposJogo[2].value.trim(),
        ano: Number(camposJogo[3].value),
        status: campoStatus.value,
        nota: campoNota.value === "" ? null : Number(campoNota.value),
        capa: capaConvertida
    };

    const novaLista = [novoJogo].concat(jogos); // o mais novo aparece primeiro

    if (!salvarJogos(novaLista)) {
        mostrarErro("O armazenamento do navegador está cheio. Remova alguns jogos e tente de novo.");
        return;
    }

    jogos = novaLista;
    montarTabela();
    bootstrap.Modal.getInstance(modalJogo).hide();
};

// Limpa o formulário toda vez que a janela fecha
modalJogo.addEventListener("hidden.bs.modal", function () {
    formJogo.reset();
    capaConvertida = null;
    previaCapa.src = CAPA_VAZIA;
    campoNota.disabled = false;
    alertaJogo.classList.add("d-none");
    camposJogo.forEach(function (campo) {
        campo.classList.remove("is-invalid");
    });
});

// Coloca o foco no nome quando a janela abre
modalJogo.addEventListener("shown.bs.modal", function () {
    camposJogo[0].focus();
});


// ---------- Início ----------
montarTabela();
