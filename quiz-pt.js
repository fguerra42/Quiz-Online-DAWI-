/* ═══════════════════════════════════════════════════════════════════ */
/* SISTEMA DE QUIZ INTERATIVO - VERSÃO PORTUGUESA                   */
/* Lógica completa do quiz com gerenciamento de usuários            */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Estado Global do Quiz
 * Armazena todas as informações sobre o quiz em execução
 */
const estadoQuiz = {
    perguntas: [],                    // Array com as perguntas carregadas
    perguntaAtual: 0,                 // Índice da pergunta em exibição
    pontuacao: 0,                     // Pontuação obtida (10 pts por acerto)
    respostas: [],                    // Array com respostas do usuário
    tempoInicio: null,                // Timestamp de início
    tempoDecorrido: 0,                // Tempo em segundos
    concluido: false,                 // Se quiz foi finalizado
    usuarioLogado: null               // Dados do usuário autenticado
};

/**
 * Reseta o estado do quiz para valores iniciais
 */
function resetarEstadoQuiz() {
    estadoQuiz.perguntas = [];
    estadoQuiz.perguntaAtual = 0;
    estadoQuiz.pontuacao = 0;
    estadoQuiz.respostas = [];
    estadoQuiz.tempoInicio = null;
    estadoQuiz.tempoDecorrido = 0;
    estadoQuiz.concluido = false;
    estadoQuiz.usuarioLogado = null;

    // Limpar cronômetro se existir
    if (window.intervaloCronometro) {
        clearInterval(window.intervaloCronometro);
    }
}

/**
 * Inicializa o quiz
 * Carrega perguntas do JSON de acordo com a categoria selecionada
 */
async function inicializarQuiz() {
    try {
        // Resetar estado anterior
        resetarEstadoQuiz();

        // Verificar se há usuário logado
        estadoQuiz.usuarioLogado = gerenciador.obterUsuarioLogado();

        // Atualizar interface de acordo com autenticação
        atualizarInterfaceUsuario();

        // Obter categoria selecionada do localStorage
        const categoriaId = localStorage.getItem('quiz_categoria_selecionada') || 'tecnologia';
        console.log(`📚 Carregando quiz da categoria: ${categoriaId}`);

        // Carregar perguntas do arquivo JSON de categorias
        const resposta = await fetch('questions-categorias.json');
        const dados = await resposta.json();

        // Procurar a categoria selecionada
        const categoria = dados.categorias.find(c => c.id === categoriaId);

        if (!categoria) {
            throw new Error(`Categoria "${categoriaId}" não encontrada`);
        }

        // Pegar perguntas da categoria
        estadoQuiz.perguntas = categoria.perguntas;
        estadoQuiz.respostas = new Array(estadoQuiz.perguntas.length).fill(null);
        estadoQuiz.tempoInicio = Date.now();

        console.log(`✅ ${estadoQuiz.perguntas.length} perguntas carregadas da categoria ${categoria.nome}`);

        // Iniciar cronômetro
        iniciarCronometro();

        // Renderizar primeira pergunta
        renderizarPergunta();
    } catch (erro) {
        console.error('Erro ao carregar perguntas:', erro);
        exibirMensagemErro('Erro ao carregar o quiz. Tente recarregar a página.');
    }
}

/**
 * Atualiza a interface para mostrar ou ocultar informações de usuário
 */
function atualizarInterfaceUsuario() {
    const secaoUsuario = document.getElementById('secaoUsuario');
    const botoesBemVindo = document.getElementById('botoesBemVindo');
    const infoUsuario = document.getElementById('infoUsuario');

    if (estadoQuiz.usuarioLogado) {
        // Usuário logado - mostrar informações
        botoesBemVindo.style.display = 'none';
        infoUsuario.style.display = 'flex';

        // Preencher informações do usuário
        document.getElementById('nomeUsuario').textContent = `👤 ${estadoQuiz.usuarioLogado.nome}`;
        document.getElementById('pontosTotais').textContent = estadoQuiz.usuarioLogado.pontuacao;
        document.getElementById('recordeUsuario').textContent = estadoQuiz.usuarioLogado.recorde;
    } else {
        // Usuário não logado - mostrar botões
        botoesBemVindo.style.display = 'flex';
        infoUsuario.style.display = 'none';
    }
}

/**
 * Renderiza a pergunta atual na tela
 */
function renderizarPergunta() {
    const containerQuiz = document.getElementById('containerQuiz');
    const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];

    if (!perguntaAtual) return;

    // Atualizar barra de progresso
    atualizarBarraProgresso();

    // Criar HTML da pergunta
    containerQuiz.innerHTML = `
        <div class="perguntaQuiz">
            <div class="numeroPergunта">Pergunta ${estadoQuiz.perguntaAtual + 1} de ${estadoQuiz.perguntas.length}</div>
            <h2 class="textoPergunta">${escaparHTML(perguntaAtual.pergunta)}</h2>
            
            <div class="containerOpcoes">
                ${perguntaAtual.opcoes.map((opcao, indice) => `
                    <label class="opcao ${estadoQuiz.respostas[estadoQuiz.perguntaAtual] !== null ? 'respondida' : ''} ${obterClasseOpcao(indice)}">
                        <input 
                            type="radio" 
                            name="resposta" 
                            value="${indice}"
                            ${estadoQuiz.respostas[estadoQuiz.perguntaAtual] === indice ? 'checked' : ''}
                            ${estadoQuiz.respostas[estadoQuiz.perguntaAtual] !== null ? 'disabled' : ''}
                            onchange="selecionarResposta(${indice})"
                        >
                        <span class="textoOpcao">${escaparHTML(opcao)}</span>
                        <span class="feedbackOpcao">${obterFeedbackOpcao(indice)}</span>
                    </label>
                `).join('')}
            </div>

            <div class="containerBotoes">
                <button class="botao botaoSecundario" onclick="perguntaAnterior()" ${estadoQuiz.perguntaAtual === 0 ? 'disabled' : ''}>
                    ← Anterior
                </button>
                <button class="botao botaoPrimario" onclick="proximaPergunta()" ${estadoQuiz.respostas[estadoQuiz.perguntaAtual] === null ? 'disabled' : ''}>
                    Próxima →
                </button>
            </div>
        </div>
    `;

    // Rolar suavemente para a pergunta
    document.querySelector('.perguntaQuiz').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Obtém a classe CSS para uma opção (para feedback visual)
 * @param {number} indice - Índice da opção
 * @returns {string} Classe CSS apropriada
 */
function obterClasseOpcao(indice) {
    const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];

    if (estadoQuiz.respostas[estadoQuiz.perguntaAtual] === null) {
        return '';
    }

    const eCorreta = indice === perguntaAtual.respostaCorreta;
    const eSelecionada = indice === estadoQuiz.respostas[estadoQuiz.perguntaAtual];

    if (eCorreta) return 'correta';
    if (eSelecionada && !eCorreta) return 'incorreta';

    return '';
}

/**
 * Obtém feedback visual (ícone) para uma opção
 * @param {number} indice - Índice da opção
 * @returns {string} Ícone ou string vazia
 */
function obterFeedbackOpcao(indice) {
    const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];

    if (estadoQuiz.respostas[estadoQuiz.perguntaAtual] === null) {
        return '';
    }

    const eCorreta = indice === perguntaAtual.respostaCorreta;
    const eSelecionada = indice === estadoQuiz.respostas[estadoQuiz.perguntaAtual];

    if (eCorreta) return '✓';
    if (eSelecionada && !eCorreta) return '✗';

    return '';
}

/**
 * Processa a seleção de uma resposta
 * @param {number} indice - Índice da opção selecionada
 */
function selecionarResposta(indice) {
    const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];

    estadoQuiz.respostas[estadoQuiz.perguntaAtual] = indice;

    // Verificar se acertou (10 pontos por acerto)
    if (indice === perguntaAtual.respostaCorreta) {
        estadoQuiz.pontuacao += 10;
    }

    // Atualizar exibição de pontuação
    atualizarExibicaoPontuacao();

    // Re-renderizar para mostrar feedback
    renderizarPergunta();
}

/**
 * Vai para a próxima pergunta
 */
function proximaPergunta() {
    if (estadoQuiz.respostas[estadoQuiz.perguntaAtual] === null) {
        alert('Por favor, selecione uma resposta!');
        return;
    }

    if (estadoQuiz.perguntaAtual < estadoQuiz.perguntas.length - 1) {
        estadoQuiz.perguntaAtual++;
        renderizarPergunta();
    } else {
        // Quiz finalizado
        finalizarQuiz();
    }
}

/**
 * Volta para a pergunta anterior
 */
function perguntaAnterior() {
    if (estadoQuiz.perguntaAtual > 0) {
        estadoQuiz.perguntaAtual--;
        renderizarPergunta();
    }
}

/**
 * Finaliza o quiz e mostra resultados
 */
function finalizarQuiz() {
    estadoQuiz.concluido = true;
    document.getElementById('containerQuiz').style.display = 'none';

    // Salvar pontuação se houver usuário logado
    if (estadoQuiz.usuarioLogado) {
        gerenciador.atualizarPontuacao(estadoQuiz.pontuacao);

        // Atualizar o estado local com dados atualizados do localStorage
        estadoQuiz.usuarioLogado = gerenciador.obterUsuarioLogado();

        // Atualizar interface com novos pontos
        if (estadoQuiz.usuarioLogado) {
            document.getElementById('pontosTotais').textContent = estadoQuiz.usuarioLogado.pontuacao;
            document.getElementById('recordeUsuario').textContent = estadoQuiz.usuarioLogado.recorde;
        }
    }

    exibirResultados();
}

/**
 * Exibe a tela de resultados finais
 */
function exibirResultados() {
    const telaResultados = document.getElementById('telaResultados');
    const percentual = Math.round((estadoQuiz.pontuacao / (estadoQuiz.perguntas.length * 10)) * 100);

    // Atualizar dados dos resultados
    document.getElementById('percentualPontuacao').textContent = percentual + '%';
    document.getElementById('respostasCorretas').textContent = Math.round(estadoQuiz.pontuacao / 10);
    document.getElementById('totalPerguntas').textContent = estadoQuiz.perguntas.length;

    // Mensagem de desempenho personalizada
    const mensagem = obterMensagemDesempenho(percentual);
    document.getElementById('mensagemDesempenho').textContent = mensagem;

    // Mostrar pontos ganhos
    document.getElementById('pontosGanhos').innerHTML = `Pontos ganhos: <strong>${estadoQuiz.pontuacao}</strong>`;

    // Mostrar tela de resultados
    telaResultados.classList.add('mostrar');
}

/**
 * Obtém mensagem personalizada com base no desempenho
 * @param {number} percentual - Percentual de acertos
 * @returns {string} Mensagem motivadora
 */
function obterMensagemDesempenho(percentual) {
    if (percentual === 100) {
        return '🌟 Excelente! Você é um expert!';
    } else if (percentual >= 80) {
        return '👏 Muito bom! Você domina o assunto!';
    } else if (percentual >= 60) {
        return '✨ Bom! Você tem uma boa base!';
    } else if (percentual >= 40) {
        return '💪 Continue estudando, você está no caminho!';
    } else {
        return '📚 Recomenda-se revisar os conteúdos!';
    }
}

/**
 * Reinicia o quiz
 */
function reiniciarQuiz() {
    // Resetar estado
    estadoQuiz.perguntaAtual = 0;
    estadoQuiz.pontuacao = 0;
    estadoQuiz.respostas = new Array(estadoQuiz.perguntas.length).fill(null);
    estadoQuiz.tempoInicio = Date.now();
    estadoQuiz.tempoDecorrido = 0;
    estadoQuiz.concluido = false;

    // Limpar telas
    document.getElementById('containerQuiz').style.display = 'block';
    document.getElementById('telaResultados').classList.remove('mostrar');
    document.getElementById('telaRevisao').classList.remove('mostrar');

    // Renderizar primeira pergunta
    renderizarPergunta();
    atualizarExibicaoPontuacao();
}

/**
 * Exibe revisão de todas as respostas
 */
function revisarRespostas() {
    const conteudoRevisao = document.getElementById('conteudoRevisao');

    let htmlRevisao = '';
    estadoQuiz.perguntas.forEach((pergunta, indice) => {
        const respostaUsuario = estadoQuiz.respostas[indice];
        const respostaCorreta = pergunta.respostaCorreta;
        const acertou = respostaUsuario === respostaCorreta;

        htmlRevisao += `
            <div class="itemRevisao ${acertou ? 'correta' : 'incorreta'}">
                <div class="perguntaRevisao">
                    ${indice + 1}. ${escaparHTML(pergunta.pergunta)}
                </div>
                <div class="itemRespostaRevisao respostaUsuario ${!acertou ? 'incorreta' : ''}">
                    <strong>Sua resposta:</strong> ${escaparHTML(pergunta.opcoes[respostaUsuario])}
                </div>
                ${!acertou ? `
                    <div class="itemRespostaRevisao respostaCorreta">
                        <strong>Resposta correta:</strong> ${escaparHTML(pergunta.opcoes[respostaCorreta])}
                    </div>
                ` : ''}
            </div>
        `;
    });

    conteudoRevisao.innerHTML = htmlRevisao;
    document.getElementById('telaResultados').classList.remove('mostrar');
    document.getElementById('telaRevisao').classList.add('mostrar');
}

/**
 * Volta para a tela de resultados
 */
function voltarResultados() {
    document.getElementById('telaRevisao').classList.remove('mostrar');
    document.getElementById('telaResultados').classList.add('mostrar');
}

/**
 * Atualiza a barra de progresso
 */
function atualizarBarraProgresso() {
    const progresso = ((estadoQuiz.perguntaAtual + 1) / estadoQuiz.perguntas.length) * 100;
    document.getElementById('preenchimentoProgresso').style.width = progresso + '%';
    document.getElementById('textoProgresso').textContent =
        `Pergunta ${estadoQuiz.perguntaAtual + 1} de ${estadoQuiz.perguntas.length}`;
}

/**
 * Atualiza a exibição de pontuação
 */
function atualizarExibicaoPontuacao() {
    const acertos = Math.round(estadoQuiz.pontuacao / 10);
    document.getElementById('pontuacaoAtual').textContent = estadoQuiz.pontuacao;
    document.getElementById('totalPontuacao').textContent = estadoQuiz.perguntas.length * 10;
}

/**
 * Inicia o cronômetro
 */
function iniciarCronometro() {
    setInterval(() => {
        if (!estadoQuiz.concluido) {
            const decorrido = Math.floor((Date.now() - estadoQuiz.tempoInicio) / 1000);
            estadoQuiz.tempoDecorrido = decorrido;

            let exibicao;
            if (decorrido < 60) {
                exibicao = decorrido + 's';
            } else {
                const minutos = Math.floor(decorrido / 60);
                const segundos = decorrido % 60;
                exibicao = minutos + 'm ' + segundos + 's';
            }

            document.getElementById('cronometroDisplay').textContent = exibicao;
        }
    }, 100);
}

/**
 * Função utilitária para escapar HTML (segurança contra XSS)
 * @param {string} texto - Texto a escapar
 * @returns {string} Texto escapado
 */
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Exibe mensagem de erro
 * @param {string} mensagem - Mensagem a exibir
 */
function exibirMensagemErro(mensagem) {
    document.getElementById('containerQuiz').innerHTML = `
        <div style="text-align: center; padding: 40px; color: #e74c3c;">
            <h2>Erro ao Carregar o Quiz</h2>
            <p>${mensagem}</p>
            <button class="botao botaoPrimario" onclick="location.reload()">Tentar Novamente</button>
        </div>
    `;
}

/**
 * Faz logout do usuário
 */
// DELETADO: Função fazerLogout foi movida para autenticacao.js
// A função correta está em autenticacao.js linha 361

/**
 * Inicializar quiz quando a página carregar
 */
document.addEventListener('DOMContentLoaded', () => {
    // Limpar flag de login se existir
    localStorage.removeItem('vemDoLogin');

    // Inicializar quiz
    inicializarQuiz();
});
