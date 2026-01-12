// Quando a página carrega, verifica se o usuário está logado
document.addEventListener('DOMContentLoaded', verificarAutenticacao);

// Esta função garante que apenas usuários logados podem acessar esta página
function verificarAutenticacao() {
    // Obter dados do usuário logado
    const usuarioLogado = gerenciador.obterUsuarioLogado();
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }
}

function selecionarCategoria(categoriaId) {
    localStorage.setItem('quiz_categoria_selecionada', categoriaId);
    window.location.href = 'index.html';
}

function voltarMenu() {
    window.location.href = 'menu.html';
}
