/* ═══════════════════════════════════════════════════════════════════ */
/*                 PÁGINA DE MENU PRINCIPAL                            */
/*                  (Navegação e Informações)                          */
/*                                                                       */
/* Este arquivo gerencia:                                              */
/* - Exibição do menu principal                                        */
/* - Informações do usuário logado                                    */
/* - Acesso ao histórico e perfil                                     */
/* - Modais de informações e sobre                                    */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  INICIALIZAÇÃO DA PÁGINA                                            */
/* ─────────────────────────────────────────────────────────────────── */

// Quando a página carrega, executa a função inicializarMenu
document.addEventListener('DOMContentLoaded', inicializarMenu);

// Esta função:
// 1. Verifica se o usuário está logado
// 2. Se não está, redireciona para login
// 3. Se está, carrega seus dados na página
function inicializarMenu() {
    // PASSO 1: Obter dados do usuário logado
    const usuarioLogado = gerenciador.obterUsuarioLogado();

    // PASSO 2: Se não está logado, redirecionar para login
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    // PASSO 3: Se está logado, carregar dados do usuário
    carregarDadosUsuario(usuarioLogado);
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 1: Carregar Dados do Usuário                               */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função exibe os dados do usuário no cabeçalho e mensagem de boas-vindas
function carregarDadosUsuario(usuario) {
    // PASSO 1: Atualizar nome do usuário
    // Mostra apenas o primeiro nome na página
    const nomeElement = document.getElementById('nomeUsuarioMenu');
    if (nomeElement) {
        nomeElement.textContent = usuario.nome.split(' ')[0];
    }

    // PASSO 2: Atualizar pontuação
    // Exibe total de pontos conseguidos até agora
    const pontuacaoElement = document.getElementById('pontuacaoUsuarioMenu');
    if (pontuacaoElement) {
        pontuacaoElement.textContent = `${usuario.pontuacao} pontos`;
    }

    // PASSO 3: Atualizar mensagem de boas-vindas
    // Muda a mensagem de acordo com a hora do dia
    const mensagemElement = document.getElementById('mensagemBemVindo');
    if (mensagemElement) {
        const hora = new Date().getHours();
        let saudacao = 'Bem-vindo';

        // Se for de manhã (antes de 12:00)
        if (hora < 12) {
            saudacao = 'Bom dia';
        }
        // Se for de tarde (entre 12:00 e 18:00)
        else if (hora < 18) {
            saudacao = 'Boa tarde';
        }
        // Se for de noite (depois de 18:00)
        else {
            saudacao = 'Boa noite';
        }

        mensagemElement.textContent = `${saudacao}, ${usuario.nome.split(' ')[0]}!`;
    }
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FUNÇÕES DE NAVEGAÇÃO                                               */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 2: Ir Para Quiz                                            */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função redireciona para a página de seleção de categorias
function irParaQuiz() {
    window.location.href = 'categorias.html';
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FUNÇÕES DE MODAIS (Janelas de Informação)                          */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 3: Mostrar Histórico                                       */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função mostra uma janela com todas as tentativas do usuário
function mostrarHistorico() {
    // PASSO 1: Obter dados do usuário logado
    const usuarioLogado = gerenciador.obterUsuarioLogado();
    const conteudo = document.getElementById('conteudoHistorico');

    // PASSO 2: Se não tem histórico, mostrar mensagem vazia
    if (!usuarioLogado || !usuarioLogado.historico || usuarioLogado.historico.length === 0) {
        conteudo.innerHTML = '<div class="historicoVazio">📭 Nenhuma tentativa registrada ainda.</div>';
        abrirModal('modalHistorico');
        return;
    }

    // PASSO 3: Criar HTML do histórico (ordem reversa - mais recente primeiro)
    let html = '';
    // Inverter o array para mostrar as tentativas mais recentes primeiro
    const historicoOrdenado = [...usuarioLogado.historico].reverse();

    // Para cada tentativa, criar uma linha com data e pontos
    historicoOrdenado.forEach((tentativa, indice) => {
        // Formatar a data para o formato brasileiro (DD/MM/YYYY HH:MM)
        const data = new Date(tentativa.data);
        const dataFormatada = data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Adicionar linha ao HTML
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

    // PASSO 4: Colocar HTML no modal e abrir
    conteudo.innerHTML = html;
    abrirModal('modalHistorico');
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 4: Mostrar Perfil                                          */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função mostra uma janela com dados completos do usuário e estatísticas
function mostrarPerfil() {
    // PASSO 1: Obter dados do usuário logado
    const usuarioLogado = gerenciador.obterUsuarioLogado();
    const conteudo = document.getElementById('conteudoPerfil');

    // PASSO 2: Se erro, mostrar mensagem de erro
    if (!usuarioLogado) {
        conteudo.innerHTML = '<p>Erro ao carregar perfil.</p>';
        abrirModal('modalPerfil');
        return;
    }

    // PASSO 3: Calcular estatísticas do usuário
    // Número total de tentativas
    const totalTentativas = usuarioLogado.historico ? usuarioLogado.historico.length : 0;

    // Pontuação média (somar todos os pontos e dividir pelo total)
    const pontuacaoMedia = totalTentativas > 0
        ? Math.round(usuarioLogado.historico.reduce((sum, t) => sum + t.pontos, 0) / totalTentativas)
        : 0;

    // Formatar data de criação da conta
    const dataCriacao = new Date(usuarioLogado.dataCriacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // PASSO 4: Construir HTML do perfil com informações e estatísticas
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

    // PASSO 5: Colocar HTML no modal e abrir
    conteudo.innerHTML = html;
    abrirModal('modalPerfil');
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 5: Mostrar Sobre                                           */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função mostra uma janela com informações sobre a aplicação
function mostrarSobre() {
    const conteudo = document.getElementById('conteudoSobre');

    // Construir HTML com informações sobre o projeto
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
                <div class="cargoChef">Desenvolvedor Web </div>
            </div>

            <div class="criador">
                <div class="nomeChef">🔹 Panzo Rafael Chiló</div>
                <div class="cargoChef">Desenvolvedor Web </div>
            </div>
        </div>

        <div class="versao">
            <strong>Quiz Master v1.0.0</strong><br>
            Desenvolvido com ❤️ para educação<br>
            © 2025 | Todos os direitos reservados
        </div>
    `;

    // Colocar HTML no modal e abrir
    conteudo.innerHTML = html;
    abrirModal('modalSobre');
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FUNÇÕES DE CONTROLE DE MODAIS                                      */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 6: Abrir Modal                                             */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função mostra um modal (janela) adicionando a classe "mostrar"
function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.add('mostrar');  // Deixa visível
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 7: Fechar Modal                                            */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função esconde um modal removendo a classe "mostrar"
function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.remove('mostrar');  // Fica invisível
    }
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  EVENT LISTENERS PARA FECHAR MODAIS                                 */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FECHAR MODAL AO CLICAR FORA DO CONTEÚDO                           */
/* ─────────────────────────────────────────────────────────────────── */

// Quando o usuário clica fora do modal (no fundo escuro), ele fecha
document.addEventListener('click', function (evento) {
    // Encontra todos os modais que estão abertos
    const modals = document.querySelectorAll('.modal.mostrar');

    // Para cada modal aberto
    modals.forEach(modal => {
        // Se o clique foi no fundo do modal (não no conteúdo)
        if (evento.target === modal) {
            // Fechar esse modal
            modal.classList.remove('mostrar');
        }
    });
});

/* ─────────────────────────────────────────────────────────────────── */
/*  FECHAR MODAL AO PRESSIONAR TECLA ESC                              */
/* ─────────────────────────────────────────────────────────────────── */

// Quando o usuário pressiona a tecla ESC (Escape)
document.addEventListener('keydown', function (evento) {
    // Se a tecla pressionada é ESC
    if (evento.key === 'Escape') {
        // Encontra todos os modais abertos
        const modals = document.querySelectorAll('.modal.mostrar');

        // Para cada modal aberto, fechar
        modals.forEach(modal => {
            modal.classList.remove('mostrar');
        });
    }
});
