# 🎮 Game Over — Sistema Web

Interface de um pequeno sistema web onde o jogador gerencia sua **estante de jogos**: faz login, edita o perfil e consulta os jogos que zerou, está jogando ou quer jogar.

Projeto individual da disciplina de desenvolvimento web — DSM, Cruzeiro do Sul.

## Telas

| Tela | Arquivo | O que tem |
|---|---|---|
| Login | `index.html` | Formulário com validação, mostrar/ocultar senha, "Lembrar de mim" e mensagem de erro |
| Perfil do Usuário | `pages/perfil.html` | Cartão do jogador, estatísticas e formulário para editar os dados |
| Consulta | `pages/consulta.html` | Tabela de jogos com pesquisa e filtros, e opção de adicionar seus jogos (com capa) e remover |

## Como rodar

Não precisa instalar nada: abra o `index.html` no navegador (ou use a extensão **Live Server** do VS Code).

**Conta de teste**

- E-mail: `jogador@gameover.com`
- Senha: `gameover123`

## Estrutura de pastas

```
game-over-sistema/
├── index.html          → tela de login
├── pages/
│   ├── perfil.html     → tela de perfil
│   └── consulta.html   → área de consulta (tabela + pesquisa)
├── css/
│   └── style.css       → toda a estilização do projeto
├── js/
│   ├── auth.js         → protege as páginas internas e faz o "Sair"
│   ├── login.js        → validação e login
│   ├── jogos.js        → dados da estante (lista padrão, salvar e estatísticas)
│   ├── perfil.js       → edição do perfil e estatísticas
│   └── consulta.js     → tabela, filtro, adicionar e remover jogos
├── img/
│   ├── logo.svg
│   ├── capa-vazia.svg  → capa usada quando o jogo não tem imagem
│   ├── avatar.webp
│   ├── login-hero-800.webp
│   ├── login-hero-1400.webp
│   └── capas/          → miniaturas dos jogos (.webp)
└── README.md
```

## Identidade visual

| Elemento | Valor |
|---|---|
| Fundo | `#0d0e1a` |
| Superfície (cartões) | `#171a2e` |
| Borda | `#2a2f4f` |
| Cor primária (roxo) | `#8b5cf6` |
| Destaque (verde neon) | `#22e39a` |
| Erro | `#ff5c7a` |
| Texto / texto suave | `#e7e9f5` / `#9aa0c3` |
| Títulos e logo | Press Start 2P (fonte pixelada, remete a jogos antigos) |
| Textos e formulários | Inter (boa leitura em telas) |

As cores e espaçamentos ficam em variáveis CSS (`:root`) no `style.css`, o que mantém o visual igual em todas as telas.

## Protótipo

🎨 **[Abrir o protótipo no Figma](https://www.figma.com/design/VHGoJt0qafsW2CpwAap7KY/Game-Over---Prot%C3%B3tipo)**

O arquivo tem duas páginas, com as telas de login, perfil e estante em versão desktop e mobile:

- **1. Wireframe:** estrutura das telas em tons de cinza, sem cores nem imagens.
- **2. Mockup:** visual final, com navegação entre as telas (Entrar → Perfil, Minha estante → Estante, Sair → Login). Para testar, abra a página e clique em ▶ (Present).

## Decisões técnicas

- **Bootstrap 5** para o grid responsivo, o menu que vira "hambúrguer" no celular e a tabela com rolagem lateral (`table-responsive`). O visual próprio fica todo no CSS externo `css/style.css`: nenhuma página usa `style=""` ou `<style>`.
- **Formulários com boas práticas:** todo campo tem `<label for>`, os tipos certos (`email`, `password`, `search`), `autocomplete`, `required`, mensagens de erro ligadas ao campo por `aria-describedby` e foco levado para o primeiro campo com erro.
- **Validação antes do envio:** os formulários usam `onsubmit` com `event.preventDefault()` e checam os campos com `checkValidity()` antes de seguir.
- **Acessibilidade:** `lang="pt-BR"`, textos alternativos nas imagens, `aria-live` nas mensagens, `<caption>` e `scope` na tabela, e contorno de foco visível para quem navega pelo teclado.
- **Login simulado:** como o projeto é só front-end, a conta de teste fica no JavaScript. O usuário logado é salvo no `sessionStorage` (ou no `localStorage` com "Lembrar de mim"). Sem login, as páginas internas voltam para a tela de login.
- **Filtro da tabela:** ignora maiúsculas e acentos (pesquisar "simulacao" encontra "Simulação") e mostra o total de resultados.
- **Estante salva no navegador:** a lista de jogos fica no `localStorage`. Jogos adicionados ou removidos continuam lá ao recarregar, e o perfil calcula as estatísticas (zerados, jogando, na fila, nota média) a partir dela.
- **Segurança ao exibir dados:** a tabela é montada com `createElement` e `textContent`, e não com `innerHTML`, para que um texto digitado pelo usuário nunca seja interpretado como HTML.

## Otimização de imagens

| Imagem | Formato | Dimensões | Tamanho |
|---|---|---|---|
| Logo | SVG | vetorial | < 1 KB |
| Avatar | WebP | 256×256 | ~2 KB |
| Capas dos jogos | WebP | 120×160 | ~3–7 KB cada (as 14 originais somavam 6,4 MB; convertidas, 66 KB) |
| Fundo do login | WebP | 800×600 e 1400×1050 | ~31 KB e ~62 KB |

- **WebP** no lugar de PNG/JPG: arquivos bem menores com a mesma qualidade visual.
- **SVG** no logo: fica nítido em qualquer tamanho e pesa quase nada.
- **`srcset` + `sizes`** na imagem do login: o celular baixa a versão de 800px e o computador a de 1400px.
- **`loading="lazy"`** nas capas da tabela: só carregam quando aparecem na tela.
- **`width` e `height`** em todas as imagens: evita que a página "pule" enquanto carrega.
- **Capas enviadas pelo usuário:** o JavaScript recorta a imagem para 120×160 com `<canvas>` e converte para WebP antes de salvar. Uma foto de 150 KB vira uma capa de ~2 KB.

## Tecnologias

HTML5 · CSS3 · JavaScript · Bootstrap 5.3 · Git e GitHub
