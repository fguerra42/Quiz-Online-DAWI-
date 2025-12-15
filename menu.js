/* ═══════════════════════════════════════════════════════════════════ */
/* Script da Página de Menu Principal                                 */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Inicializar página do menu
 */
document.addEventListener('DOMContentLoaded', inicializarMenu);

function inicializarMenu() {
    console.log('=== INICIALIZANDO MENU ===');

    // Verificar se usuário está logado
    const usuarioLogado = gerenciador.obterUsuarioLogado();

    if (!usuarioLogado) {
        console.log('❌ Usuário não autenticado. Redirecionando para login...');
        window.location.href = 'login.html';
        return;
    }

    console.log('✅ Usuário autenticado:', usuarioLogado.nome);

    // Carregar dados do usuário
    carregarDadosUsuario(usuarioLogado);
}

/**
 * Carrega e exibe dados do usuário no cabeçalho
 * @param {Object} usuario - Dados do usuário
 */
function carregarDadosUsuario(usuario) {
    console.log('📥 Carregando dados do usuário...');

    // Atualizar nome
    const nomeElement = document.getElementById('nomeUsuarioMenu');
    if (nomeElement) {
        nomeElement.textContent = usuario.nome.split(' ')[0]; // Apenas primeiro nome
    }

    // Atualizar pontuação
    const pontuacaoElement = document.getElementById('pontuacaoUsuarioMenu');
    if (pontuacaoElement) {
        pontuacaoElement.textContent = `${usuario.pontuacao} pontos`;
    }

    // Atualizar mensagem de boas-vindas
    const mensagemElement = document.getElementById('mensagemBemVindo');
    if (mensagemElement) {
        const hora = new Date().getHours();
        let saudacao = 'Bem-vindo';

        if (hora < 12) {
            saudacao = 'Bom dia';
        } else if (hora < 18) {
            saudacao = 'Boa tarde';
        } else {
            saudacao = 'Boa noite';
        }

        mensagemElement.textContent = `${saudacao}, ${usuario.nome.split(' ')[0]}!`;
    }

    console.log('✅ Dados do usuário carregados');
}

/**
 * Redireciona para a página de seleção de categorias
 */
function irParaQuiz() {
    console.log('🎮 Redirecionando para seleção de categorias...');
    window.location.href = 'categorias.html';
}

/**
 * Exibe modal com histórico de tentativas
 */
function mostrarHistorico() {
    console.log('📊 Abrindo histórico...');

    const usuarioLogado = gerenciador.obterUsuarioLogado();
    const modal = document.getElementById('modalHistorico');
    const conteudo = document.getElementById('conteudoHistorico');

    if (!usuarioLogado || !usuarioLogado.historico) {
        conteudo.innerHTML = '<div class="historicoVazio">📭 Nenhuma tentativa registrada ainda.</div>';
        abrirModal('modalHistorico');
        return;
    }

    if (usuarioLogado.historico.length === 0) {
        conteudo.innerHTML = '<div class="historicoVazio">📭 Nenhuma tentativa registrada ainda.</div>';
        abrirModal('modalHistorico');
        return;
    }

    // Construir histórico (ordem reversa - mais recente primeiro)
    let html = '';
    const historicoOrdenado = [...usuarioLogado.historico].reverse();

    historicoOrdenado.forEach((tentativa, indice) => {
        const data = new Date(tentativa.data);
        const dataFormatada = data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        html += `
            <div class="itemHistorico">
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Tentativa #${historicoOrdenado.length - indice}</div>
                    <div class="dataHistorico">${dataFormatada}</div>
                </div>
                <div class="pontoHistorico">${tentativa.pontos}/100</div>
            </div>
        `;
    });

    conteudo.innerHTML = html;
    abrirModal('modalHistorico');
}

/**
 * Exibe modal com perfil do usuário
 */
function mostrarPerfil() {
    console.log('👤 Abrindo perfil...');

    const usuarioLogado = gerenciador.obterUsuarioLogado();
    const conteudo = document.getElementById('conteudoPerfil');

    if (!usuarioLogado) {
        conteudo.innerHTML = '<p>Erro ao carregar perfil.</p>';
        abrirModal('modalPerfil');
        return;
    }

    // Calcular estatísticas
    const totalTentativas = usuarioLogado.historico ? usuarioLogado.historico.length : 0;
    const pontuacaoMedia = totalTentativas > 0
        ? Math.round(usuarioLogado.historico.reduce((sum, t) => sum + t.pontos, 0) / totalTentativas)
        : 0;

    const dataCriacao = new Date(usuarioLogado.dataCriacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Construir HTML do perfil
    let html = `
        <div class="cartaoPerfil">
            <div class="linhaInfo">
                <span class="labelInfo">👤 Nome Completo:</span>
                <span class="valorInfo">${usuarioLogado.nome}</span>
            </div>
            <div class="linhaInfo">
                <span class="labelInfo">📧 Email:</span>
                <span class="valorInfo">${usuarioLogado.email}</span>
            </div>
            <div class="linhaInfo">
                <span class="labelInfo">📅 Membro desde:</span>
                <span class="valorInfo">${dataCriacao}</span>
            </div>
        </div>

        <h3 style="color: var(--cor-primaria); margin: 20px 0 15px; font-size: 18px;">📈 Estatísticas</h3>
        <div class="estatisticas">
            <div class="cartaoEstat">
                <h4>Pontos Totais</h4>
                <div class="numero">${usuarioLogado.pontuacao}</div>
            </div>
            <div class="cartaoEstat">
                <h4>Melhor Pontuação</h4>
                <div class="numero">${usuarioLogado.recorde}</div>
            </div>
            <div class="cartaoEstat">
                <h4>Total de Tentativas</h4>
                <div class="numero">${totalTentativas}</div>
            </div>
            <div class="cartaoEstat">
                <h4>Média de Pontos</h4>
                <div class="numero">${pontuacaoMedia}</div>
            </div>
        </div>
    `;

    conteudo.innerHTML = html;
    abrirModal('modalPerfil');
}

/**
 * Exibe modal com informações sobre a aplicação
 */
function mostrarSobre() {
    console.log('ℹ️ Abrindo sobre...');

    const conteudo = document.getElementById('conteudoSobre');

    const html = `
        <div class="secaoSobre">
            <h3>🎓 Quiz Master</h3>
            <p>
                Quiz Master é uma aplicação interativa de educação que permite aos usuários
                testar seus conhecimentos através de um quiz dinâmico com feedback imediato.
            </p>
        </div>

        <div class="secaoSobre">
            <h3>✨ Funcionalidades</h3>
            <ul style="margin-left: 20px; color: var(--cor-texto-claro); line-height: 2;">
                <li>✅ Sistema de autenticação seguro</li>
                <li>✅ 10 perguntas de múltipla escolha</li>
                <li>✅ Feedback imediato (verde/vermelho)</li>
                <li>✅ Pontuação: 10 pontos por resposta correta</li>
                <li>✅ Histórico de tentativas</li>
                <li>✅ Sistema de recordes</li>
                <li>✅ Interface responsiva</li>
                <li>✅ Totalmente em português</li>
            </ul>
        </div>

        <div class="secaoSobre">
            <h3>📱 Tecnologias</h3>
            <p>
                <strong>Frontend:</strong> HTML5, CSS3, JavaScript (Vanilla)<br>
                <strong>Armazenamento:</strong> localStorage (Browser)<br>
                <strong>Compatibilidade:</strong> Todos os navegadores modernos
            </p>
        </div>

        <div class="criadores">
            <h4>👨‍💻 Criadores da Aplicação</h4>

            <div class="criador">
                <div class="nomeChef">🔹 Firmino da Silva Guerra</div>
                <div class="cargoChef">Desenvolvedor Full Stack | Programador Principal</div>
            </div>

            <div class="criador">
                <div class="nomeChef">🔹 Panzo Rafael Chiló</div>
                <div class="cargoChef">Desenvolvedor Full Stack | Colaborador</div>
            </div>
        </div>

        <div class="versao">
            <strong>Quiz Master v1.0.0</strong><br>
            Desenvolvido com ❤️ para educação<br>
            © 2025 | Todos os direitos reservados
        </div>
    `;

    conteudo.innerHTML = html;
    abrirModal('modalSobre');
}

/**
 * Abre um modal
 * @param {string} idModal - ID do modal a abrir
 */
function abrirModal(idModal) {
    console.log(`🔓 Abrindo modal: ${idModal}`);
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.add('mostrar');
    }
}

/**
 * Fecha um modal
 * @param {string} idModal - ID do modal a fechar
 */
function fecharModal(idModal) {
    console.log(`🔒 Fechando modal: ${idModal}`);
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.remove('mostrar');
    }
}

/**
 * Fechar modal ao clicar fora do conteúdo
 */
document.addEventListener('click', function (evento) {
    const modals = document.querySelectorAll('.modal.mostrar');
    modals.forEach(modal => {
        if (evento.target === modal) {
            modal.classList.remove('mostrar');
        }
    });
});

/**
 * Fechar modal ao pressionar ESC
 */
document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.mostrar');
        modals.forEach(modal => {
            modal.classList.remove('mostrar');
        });
    }
});
