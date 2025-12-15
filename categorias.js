/* ═══════════════════════════════════════════════════════════════════ */
/* Script da Página de Categorias                                     */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Verificar autenticação ao carregar página
 */
document.addEventListener('DOMContentLoaded', verificarAutenticacao);

function verificarAutenticacao() {
    console.log('=== VERIFICANDO AUTENTICAÇÃO ===');

    const usuarioLogado = gerenciador.obterUsuarioLogado();

    if (!usuarioLogado) {
        console.log('❌ Usuário não autenticado. Redirecionando para login...');
        window.location.href = 'login.html';
        return;
    }

    console.log('✅ Usuário autenticado:', usuarioLogado.nome);
}

/**
 * Selecionar uma categoria e ir para o quiz
 * @param {string} categoriaId - ID da categoria selecionada
 */
function selecionarCategoria(categoriaId) {
    console.log(`📚 Categoria selecionada: ${categoriaId}`);

    // Salvar categoria selecionada no localStorage
    localStorage.setItem('quiz_categoria_selecionada', categoriaId);

    // Redirecionar para a página do quiz
    console.log('🔄 Redirecionando para quiz...');
    window.location.href = 'index.html';
}

/**
 * Voltar para o menu principal
 */
function voltarMenu() {
    console.log('🔙 Voltando para menu...');
    window.location.href = 'menu.html';
}
