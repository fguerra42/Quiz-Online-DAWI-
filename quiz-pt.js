/* ─────────────────────────────────────────────────────────────────── */
/*  1. VARIÁVEL GLOBAL - Estado do Quiz                                */
/* ─────────────────────────────────────────────────────────────────── */

// Armazena todas as informações sobre o quiz em andamento
const estadoQuiz = {
    perguntas: [],              // Lista de todas as perguntas
    perguntaAtual: 0,           // Qual pergunta está sendo mostrada (0 a 9)
    pontuacao: 0,               // Pontos acumulados (10 pts por acerto)
    respostas: [],              // Respostas do usuário (null se não respondeu)
    tempoInicio: null,          // Hora que o quiz começou
    tempoDecorrido: 0,          // Quantos segundos já passaram
    concluido: false,           // Quiz terminou?
    usuarioLogado: null,        // Dados do usuário que está fazendo o quiz
    tempoRestantePergunta: 15,  // Tempo restante para responder (15 segundos)
    intervaoCronometroPergunта: null, // ID do intervalo do timer por pergunta
    respostasNoTempo: []        // Flag para saber se respondeu no tempo (true/false por pergunta)
};

/* ─────────────────────────────────────────────────────────────────── */
/*  2. FUNÇÃO: Resetar Estado do Quiz                                  */
/* ─────────────────────────────────────────────────────────────────── */

// Limpa todas as informações do quiz anterior e deixa tudo zerado
// Isso é necessário quando o usuário quer fazer outro quiz
function resetarEstadoQuiz() {
    estadoQuiz.perguntas = [];          // Sem perguntas
    estadoQuiz.perguntaAtual = 0;       // Começa na primeira
    estadoQuiz.pontuacao = 0;           // Zera pontos
    estadoQuiz.respostas = [];          // Sem respostas anteriores
    estadoQuiz.tempoInicio = null;      // Sem tempo inicial
    estadoQuiz.tempoDecorrido = 0;      // Zera tempo decorrido
    estadoQuiz.concluido = false;       // Quiz não está concluído
    estadoQuiz.usuarioLogado = null;    // Sem usuário
    estadoQuiz.tempoRestantePergunta = 15;  // Reseta tempo da pergunta
    estadoQuiz.respostasNoTempo = [];   // Limpa flag de respostas no tempo

    // Se havia um cronômetro rodando, parar
    if (window.intervaloCronometro) {
        clearInterval(window.intervaloCronometro);
    }

    // Se havia timer da pergunta rodando, parar
    if (estadoQuiz.intervaoCronometroPergunта) {
        clearInterval(estadoQuiz.intervaoCronometroPergunта);
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  3. FUNÇÃO: Inicializar Quiz - Carregar Perguntas                  */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função:
// 1. Reseta o estado do quiz
// 2. Verifica se o usuário está logado
// 3. Carrega as perguntas de acordo com a categoria selecionada
// 4. Mostra a primeira pergunta
// 5. Inicia o cronômetro
async function inicializarQuiz() {
    try {
        //  Limpar quiz anterior
        resetarEstadoQuiz();

        // Obter usuário logado (se existir)
        estadoQuiz.usuarioLogado = gerenciador.obterUsuarioLogado();
        atualizarInterfaceUsuario();

        // Obter categoria que o usuário selecionou
        // Se não houver seleção, usa "tecnologia" como padrão
        const categoriaId = localStorage.getItem('quiz_categoria_selecionada') || 'tecnologia';
        console.log(`📚 Carregando quiz da categoria: ${categoriaId}`);

        // Carregar o arquivo JSON com todas as perguntas
        const resposta = await fetch('questions-categorias.json');
        const dados = await resposta.json();

        // Encontrar a categoria selecionada
        const categoria = dados.categorias.find(c => c.id === categoriaId);
        if (!categoria) {
            throw new Error(`Categoria "${categoriaId}" não encontrada`);
        }

        // Colocar as perguntas no estado do quiz
        estadoQuiz.perguntas = categoria.perguntas;
        estadoQuiz.respostas = new Array(estadoQuiz.perguntas.length).fill(null);
        estadoQuiz.respostasNoTempo = new Array(estadoQuiz.perguntas.length).fill(true); // True = respondeu no tempo
        estadoQuiz.tempoInicio = Date.now();

        console.log(`✅ ${estadoQuiz.perguntas.length} perguntas carregadas`);

        //  Iniciar cronômetro e mostrar primeira pergunta
        iniciarCronometro();
        renderizarPergunta();

    } catch (erro) {
        console.error('Erro ao carregar perguntas:', erro);
        exibirMensagemErro('Erro ao carregar o quiz. Tente recarregar a página.');
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  4. FUNÇÃO: Atualizar Interface do Usuário                          */
/* ─────────────────────────────────────────────────────────────────── */

// Mostra informações do usuário se ele estiver logado
// Se não estiver, mostra botões para fazer login/registro
function atualizarInterfaceUsuario() {
    const secaoUsuario = document.getElementById('secaoUsuario');
    const botoesBemVindo = document.getElementById('botoesBemVindo');
    const infoUsuario = document.getElementById('infoUsuario');

    if (estadoQuiz.usuarioLogado) {
        // USUÁRIO LOGADO: Mostrar nome, pontos e recorde
        botoesBemVindo.style.display = 'none';
        infoUsuario.style.display = 'flex';

        document.getElementById('nomeUsuario').textContent = `👤 ${estadoQuiz.usuarioLogado.nome}`;
        document.getElementById('pontosTotais').textContent = estadoQuiz.usuarioLogado.pontuacao;
        document.getElementById('recordeUsuario').textContent = estadoQuiz.usuarioLogado.recorde;
    } else {
        // USUÁRIO NÃO LOGADO: Mostrar botões de login/registro
        botoesBemVindo.style.display = 'flex';
        infoUsuario.style.display = 'none';
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  5. FUNÇÃO: Renderizar Pergunta - Mostrar na Tela                  */
/* ─────────────────────────────────────────────────────────────────── */

// Mostra a pergunta atual com todas as opções de resposta
// Também exibe botões "Anterior" e "Próxima"
function renderizarPergunta() {
    const containerQuiz = document.getElementById('containerQuiz');
    const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];

    if (!perguntaAtual) return;

    // Atualizar barra de progresso (quanto do quiz já foi feito)
    atualizarBarraProgresso();

    // Resetar tempo da pergunta quando renderiza pergunta nova
    estadoQuiz.tempoRestantePergunta = 15;

    // Se havia timer anterior, limpar
    if (estadoQuiz.intervaoCronometroPergunта) {
        clearInterval(estadoQuiz.intervaoCronometroPergunта);
    }

    // Criar o HTML com a pergunta e opções
    containerQuiz.innerHTML = `
        <div class="perguntaQuiz">
            <div class="containerTempoResposta">
                <div class="numeroPergunта">Pergunta ${estadoQuiz.perguntaAtual + 1} de ${estadoQuiz.perguntas.length}</div>
                <div class="timerPergunta">
                    <div class="circuloTempo ${estadoQuiz.tempoRestantePergunta <= 5 ? 'alerta' : ''}">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" class="circuloFundo"></circle>
                            <circle cx="50" cy="50" r="45" class="circuloProgresso" style="stroke-dashoffset: ${282.7 * (1 - (estadoQuiz.tempoRestantePergunta / 15))}"></circle>
                        </svg>
                        <span class="textoTempo" id="tempoRestante">${estadoQuiz.tempoRestantePergunta}s</span>
                    </div>
                </div>
            </div>
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

    // Rolar suavemente até a pergunta
    document.querySelector('.perguntaQuiz').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Iniciar timer de 15 segundos para essa pergunta
    iniciarTimerPergunta();
}

/* ─────────────────────────────────────────────────────────────────── */
/*  5.5. FUNÇÃO: Timer da Pergunta - Countdown de 15 segundos          */
/* ─────────────────────────────────────────────────────────────────── */

// Inicia o countdown de 15 segundos para responder a pergunta
function iniciarTimerPergunta() {
    // Se a pergunta já foi respondida, não iniciar timer
    if (estadoQuiz.respostas[estadoQuiz.perguntaAtual] !== null) {
        return;
    }

    estadoQuiz.intervaoCronometroPergunта = setInterval(() => {
        estadoQuiz.tempoRestantePergunta--;

        // Atualizar display do tempo
        const elementoTempo = document.getElementById('tempoRestante');
        if (elementoTempo) {
            elementoTempo.textContent = estadoQuiz.tempoRestantePergunta + 's';
        }

        // Atualizar cor do círculo quando estiver na reta final
        const circulo = document.querySelector('.circuloTempo');
        if (circulo) {
            if (estadoQuiz.tempoRestantePergunta <= 5) {
                circulo.classList.add('alerta');
            } else {
                circulo.classList.remove('alerta');
            }
        }

        // Atualizar barra do progresso do tempo
        const circuloProgresso = document.querySelector('.circuloProgresso');
        if (circuloProgresso) {
            const offset = 282.7 * (1 - (estadoQuiz.tempoRestantePergunta / 15));
            circuloProgresso.style.strokeDashoffset = offset;
        }

        // Se acabou o tempo, selecionar a resposta correta automaticamente
        if (estadoQuiz.tempoRestantePergunta <= 0) {
            clearInterval(estadoQuiz.intervaoCronometroPergunта);

            // Se não respondeu, mostrar mensagem e selecionar a resposta correta
            if (estadoQuiz.respostas[estadoQuiz.perguntaAtual] === null) {
                // Marcar como respondido FORA DO TEMPO (sem pontos)
                estadoQuiz.respostasNoTempo[estadoQuiz.perguntaAtual] = false;

                // Mostrar mensagem de tempo esgotado com a resposta correta
                const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];
                mostrarMensagemTempoEsgotado(perguntaAtual);

                // Após 2 segundos, selecionar a resposta correta
                setTimeout(() => {
                    selecionarResposta(perguntaAtual.respostaCorreta);
                }, 2000);
            }
        }
    }, 1000);
}

// Mostra mensagem de tempo esgotado com a resposta correta
function mostrarMensagemTempoEsgotado(pergunta) {
    const containerQuiz = document.getElementById('containerQuiz');

    // Criar elemento da mensagem
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagemTempoEsgotado';
    mensagem.innerHTML = `
        <div class="conteudoMensagemTempo">
            <div class="iconeMensagem">⏰</div>
            <h3>Tempo Esgotado!</h3>
            <p>A resposta correta era:</p>
            <div class="respostaCorretaMensagem">
                <strong>${escaparHTML(pergunta.opcoes[pergunta.respostaCorreta])}</strong>
            </div>
            <p class="avisoSemPontos">⚠️ Você não pontuou nesta pergunta</p>
        </div>
    `;

    containerQuiz.appendChild(mensagem);

    // Remover mensagem após 2 segundos
    setTimeout(() => {
        mensagem.remove();
    }, 2000);
}

/* ─────────────────────────────────────────────────────────────────── */
/*  6. FUNÇÕES AUXILIARES: Obter Classe e Feedback da Opção           */
/* ─────────────────────────────────────────────────────────────────── */

// Retorna a classe CSS para colorir a opção (verde se correta, vermelho se errada)
function obterClasseOpcao(indice) {
    const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];

    // Se não respondeu ainda, não colore nada
    if (estadoQuiz.respostas[estadoQuiz.perguntaAtual] === null) {
        return '';
    }

    const eCorreta = indice === perguntaAtual.respostaCorreta;
    const eSelecionada = indice === estadoQuiz.respostas[estadoQuiz.perguntaAtual];

    if (eCorreta)
        return 'correta';              // Verde ✓
    if (eSelecionada && !eCorreta)
        return 'incorreta';  // Vermelho ✗
    return '';
}

// Retorna um ícone de feedback (✓ ou ✗) para a opção
function obterFeedbackOpcao(indice) {
    const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];

    // Se não respondeu ainda, sem feedback
    if (estadoQuiz.respostas[estadoQuiz.perguntaAtual] === null) {
        return '';
    }

    const eCorreta = indice === perguntaAtual.respostaCorreta;
    const eSelecionada = indice === estadoQuiz.respostas[estadoQuiz.perguntaAtual];

    if (eCorreta)
        return '✓';                   // Resposta correta
    if (eSelecionada && !eCorreta)
        return '✗';  // Resposta errada
    return '';
}

/* ─────────────────────────────────────────────────────────────────── */
/*  7. FUNÇÃO: Selecionar Resposta - Processar Escolha do Usuário     */
/* ─────────────────────────────────────────────────────────────────── */

// Quando o usuário clica numa opção:
// 1. Registra a resposta
// 2. Se acertou E respondeu no tempo, adiciona 10 pontos
// 3. Atualiza a tela para mostrar feedback
function selecionarResposta(indice) {
    const perguntaAtual = estadoQuiz.perguntas[estadoQuiz.perguntaAtual];

    // Registrar qual opção o usuário escolheu
    estadoQuiz.respostas[estadoQuiz.perguntaAtual] = indice;

    // Parar o timer da pergunta quando responde
    if (estadoQuiz.intervaoCronometroPergunта) {
        clearInterval(estadoQuiz.intervaoCronometroPergunта);
    }

    // Verificar se acertou E respondeu no tempo para adicionar pontos (10 por acerto)
    // Se respondeu fora do tempo (respostasNoTempo[perguntaAtual] === false), não ganha pontos
    if (indice === perguntaAtual.respostaCorreta && estadoQuiz.respostasNoTempo[estadoQuiz.perguntaAtual] === true) {
        estadoQuiz.pontuacao += 10;
    }

    // Atualizar a exibição de pontos na tela
    atualizarExibicaoPontuacao();

    // Re-desenhar a pergunta para mostrar se acertou/errou (com cores)
    renderizarPergunta();
}

/* ─────────────────────────────────────────────────────────────────── */
/*  8. FUNÇÕES: Navegação entre Perguntas                             */
/* ─────────────────────────────────────────────────────────────────── */

// Vai para a próxima pergunta
// Se for a última pergunta, finaliza o quiz
function proximaPergunta() {
    // Verificar se respondeu a pergunta atual
    if (estadoQuiz.respostas[estadoQuiz.perguntaAtual] === null) {
        alert('Por favor, selecione uma resposta!');
        return;
    }

    // Se não for a última pergunta, avançar
    if (estadoQuiz.perguntaAtual < estadoQuiz.perguntas.length - 1) {
        estadoQuiz.perguntaAtual++;
        renderizarPergunta();
    } else {
        // Última pergunta respondida: finalizar quiz
        finalizarQuiz();
    }
}

// Volta para a pergunta anterior
function perguntaAnterior() {
    if (estadoQuiz.perguntaAtual > 0) {
        estadoQuiz.perguntaAtual--;
        renderizarPergunta();
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  9. FUNÇÃO: Finalizar Quiz - Salvar Pontos e Mostrar Resultados    */
/* ─────────────────────────────────────────────────────────────────── */

// Finaliza o quiz e mostra os resultados
function finalizarQuiz() {
    estadoQuiz.concluido = true;
    document.getElementById('containerQuiz').style.display = 'none';

    // Mostrar botão de voltar às categorias
    const botaoVoltar = document.querySelector('.botaoVoltarCategorias');
    if (botaoVoltar) {
        botaoVoltar.classList.add('visivel');
    }

    // Se há usuário logado, salvar os pontos dele
    if (estadoQuiz.usuarioLogado) {
        gerenciador.atualizarPontuacao(estadoQuiz.pontuacao);

        // Atualizar dados do usuário com informações atualizadas
        estadoQuiz.usuarioLogado = gerenciador.obterUsuarioLogado();

        // Atualizar exibição de pontos e recorde
        if (estadoQuiz.usuarioLogado) {
            document.getElementById('pontosTotais').textContent = estadoQuiz.usuarioLogado.pontuacao;
            document.getElementById('recordeUsuario').textContent = estadoQuiz.usuarioLogado.recorde;
        }
    }

    // Mostrar tela de resultados
    exibirResultados();
}

/* ─────────────────────────────────────────────────────────────────── */
/*  10. FUNÇÃO: Exibir Resultados - Mostrar Tela Final                */
/* ─────────────────────────────────────────────────────────────────── */

// Mostra a tela com os resultados do quiz
function exibirResultados() {
    const telaResultados = document.getElementById('telaResultados');

    // Calcular percentual de acertos
    const percentual = Math.round((estadoQuiz.pontuacao / (estadoQuiz.perguntas.length * 10)) * 100);

    // Preencher a tela com os dados
    document.getElementById('percentualPontuacao').textContent = percentual + '%';
    document.getElementById('respostasCorretas').textContent = Math.round(estadoQuiz.pontuacao / 10);
    document.getElementById('totalPerguntas').textContent = estadoQuiz.perguntas.length;

    // Mensagem motivadora baseada no desempenho
    const mensagem = obterMensagemDesempenho(percentual);
    document.getElementById('mensagemDesempenho').textContent = mensagem;

    // Mostrar pontos ganhos neste quiz
    document.getElementById('pontosGanhos').innerHTML = `Pontos ganhos: <strong>${estadoQuiz.pontuacao}</strong>`;

    // Mostrar a tela de resultados
    telaResultados.classList.add('mostrar');
}

// Retorna mensagem motivadora baseada no desempenho
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

/* ─────────────────────────────────────────────────────────────────── */
/*  11. FUNÇÕES: Reiniciar Quiz e Revisar Respostas                   */
/* ─────────────────────────────────────────────────────────────────── */

// Zera o quiz e recomeça do início
function reiniciarQuiz() {
    // Resetar contadores
    estadoQuiz.perguntaAtual = 0;
    estadoQuiz.pontuacao = 0;
    estadoQuiz.respostas = new Array(estadoQuiz.perguntas.length).fill(null);
    estadoQuiz.tempoInicio = Date.now();
    estadoQuiz.tempoDecorrido = 0;
    estadoQuiz.concluido = false;

    // Ocultar botão de voltar às categorias
    const botaoVoltar = document.querySelector('.botaoVoltarCategorias');
    if (botaoVoltar) {
        botaoVoltar.classList.remove('visivel');
    }

    // Mostrar quiz, esconder resultados e revisão
    document.getElementById('containerQuiz').style.display = 'block';
    document.getElementById('telaResultados').classList.remove('mostrar');
    document.getElementById('telaRevisao').classList.remove('mostrar');

    // Mostrar primeira pergunta
    renderizarPergunta();
    atualizarExibicaoPontuacao();
}

// Mostra uma revisão de todas as respostas do usuário
function revisarRespostas() {
    const conteudoRevisao = document.getElementById('conteudoRevisao');

    let htmlRevisao = '';

    // Para cada pergunta, mostrar a resposta do usuário e a correta (se errou)
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

    // Esconder resultados, mostrar revisão
    document.getElementById('telaResultados').classList.remove('mostrar');
    document.getElementById('telaRevisao').classList.add('mostrar');
}

// Volta da revisão para os resultados
function voltarResultados() {
    document.getElementById('telaRevisao').classList.remove('mostrar');
    document.getElementById('telaResultados').classList.add('mostrar');
}

/* ─────────────────────────────────────────────────────────────────── */
/*  12. FUNÇÕES AUXILIARES: Atualizar Interface                       */
/* ─────────────────────────────────────────────────────────────────── */

// Atualiza a barra de progresso (a barrinha que mostra quanto falta)
function atualizarBarraProgresso() {
    const progresso = ((estadoQuiz.perguntaAtual + 1) / estadoQuiz.perguntas.length) * 100;
    document.getElementById('preenchimentoProgresso').style.width = progresso + '%';
    document.getElementById('textoProgresso').textContent =
        `Pergunta ${estadoQuiz.perguntaAtual + 1} de ${estadoQuiz.perguntas.length}`;
}

// Atualiza a exibição de pontos na tela
function atualizarExibicaoPontuacao() {
    const acertos = Math.round(estadoQuiz.pontuacao / 10);
    document.getElementById('pontuacaoAtual').textContent = estadoQuiz.pontuacao;
    document.getElementById('totalPontuacao').textContent = estadoQuiz.perguntas.length * 10;
}

// Inicia o cronômetro (conta quanto tempo o usuário leva)
function iniciarCronometro() {
    setInterval(() => {
        if (!estadoQuiz.concluido) {
            const decorrido = Math.floor((Date.now() - estadoQuiz.tempoInicio) / 1000);
            estadoQuiz.tempoDecorrido = decorrido;

            // Formatar tempo: "1m 30s" ou "45s"
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

/* ─────────────────────────────────────────────────────────────────── */
/*  12.5. FUNÇÃO: Voltar para Categorias                              */
/* ─────────────────────────────────────────────────────────────────── */

// Permite o usuário voltar para escolher outra categoria
function voltarParaCategorias() {
    // Parar cronômetro do quiz
    if (window.intervaloCronometro) {
        clearInterval(window.intervaloCronometro);
    }

    // Parar timer da pergunta
    if (estadoQuiz.intervaoCronometroPergunта) {
        clearInterval(estadoQuiz.intervaoCronometroPergunта);
    }

    // Resetar estado do quiz
    resetarEstadoQuiz();

    // Redirecionar para página de categorias
    window.location.href = 'categorias.html';
}

/* ─────────────────────────────────────────────────────────────────── */
/*  13. FUNÇÕES UTILITÁRIAS: Escapar HTML e Exibir Erros              */
/* ─────────────────────────────────────────────────────────────────── */

// Converte caracteres especiais em HTML seguro
// Exemplo: "<script>" vira "&lt;script&gt;" (para evitar XSS)
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Mostra uma mensagem de erro na tela
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

/* ─────────────────────────────────────────────────────────────────── */
/*  14. EVENT LISTENER: Inicializar Quiz quando a Página Carregar     */
/* ─────────────────────────────────────────────────────────────────── */

// Quando a página HTML termina de carregar, executar isso:
document.addEventListener('DOMContentLoaded', () => {
    // Limpar qualquer flag de login anterior
    localStorage.removeItem('vemDoLogin');

    // Carregar perguntas e mostrar a primeira
    inicializarQuiz();
});
