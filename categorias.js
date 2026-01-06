/* ═══════════════════════════════════════════════════════════════════ */
/*              PÁGINA DE SELEÇÃO DE CATEGORIAS                        */
/*               (Escolher Tema do Quiz)                               */
/*                                                                       */
/* Este arquivo gerencia:                                              */
/* - Verificação de autenticação                                       */
/* - Seleção de categoria                                              */
/* - Salvamento da categoria escolhida                                */
/* - Redirecionamento para quiz                                        */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  INICIALIZAÇÃO DA PÁGINA                                            */
/* ─────────────────────────────────────────────────────────────────── */

// Quando a página carrega, verifica se o usuário está logado
document.addEventListener('DOMContentLoaded', verificarAutenticacao);

// Esta função garante que apenas usuários logados podem acessar esta página
function verificarAutenticacao() {
    // PASSO 1: Obter dados do usuário logado
    const usuarioLogado = gerenciador.obterUsuarioLogado();

    // PASSO 2: Se não está logado, redirecionar para login
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    // PASSO 3: Se está logado, a página carrega normalmente
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FUNÇÕES DE SELEÇÃO E NAVEGAÇÃO                                     */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 1: Selecionar Categoria                                    */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função:
// 1. Recebe a categoria escolhida pelo usuário
// 2. Guarda no localStorage para o quiz saber qual categoria usar
// 3. Redireciona para a página do quiz
function selecionarCategoria(categoriaId) {
    // PASSO 1: Guardar a categoria escolhida no localStorage
    // Assim o quiz saberá qual categoria usar
    localStorage.setItem('quiz_categoria_selecionada', categoriaId);

    // PASSO 2: Redirecionar para a página do quiz
    window.location.href = 'index.html';
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 2: Voltar para Menu                                        */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função redireciona o usuário de volta para o menu principal
function voltarMenu() {
    window.location.href = 'menu.html';
}
