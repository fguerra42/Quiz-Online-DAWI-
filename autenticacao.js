/* ═══════════════════════════════════════════════════════════════════ */
/* Sistema de Autenticação de Usuários                                */
/* Gerencia login, registro e sessões de usuários                    */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Classe para gerenciar dados de usuário
 */
class GerenciadorUsuario {
    constructor() {
        // Chave para armazenar dados no localStorage
        this.chaveUsuarios = 'quiz_usuarios';
        this.chaveUsuarioLogado = 'quiz_usuario_logado';
    }

    /**
     * Obtém lista de todos os usuários registrados
     * @returns {Array} Array com todos os usuários
     */
    obterTodosUsuarios() {
        const dados = localStorage.getItem(this.chaveUsuarios);
        return dados ? JSON.parse(dados) : [];
    }

    /**
     * Salva a lista de usuários no localStorage
     * @param {Array} usuarios - Array de usuários
     */
    salvarUsuarios(usuarios) {
        localStorage.setItem(this.chaveUsuarios, JSON.stringify(usuarios));
    }

    /**
     * Registra um novo usuário
     * @param {Object} dados - Objeto com nome, email, senha
     * @returns {Object} Resultado do registro {sucesso, mensagem}
     */
    registrarUsuario(dados) {
        const usuarios = this.obterTodosUsuarios();

        // Validar se email já existe
        if (usuarios.some(u => u.email === dados.email)) {
            return {
                sucesso: false,
                mensagem: 'Este email já está registrado. Tente fazer login.'
            };
        }

        // Criar novo usuário
        const novoUsuario = {
            id: Date.now(),
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha, // Em produção, usar hash!
            dataCriacao: new Date().toISOString(),
            pontuacao: 0,
            recorde: 0,
            historico: []
        };

        usuarios.push(novoUsuario);
        this.salvarUsuarios(usuarios);

        return {
            sucesso: true,
            mensagem: 'Conta criada com sucesso! Faça login para continuar.'
        };
    }

    /**
     * Verifica credenciais e faz login
     * @param {string} email - Email do usuário
     * @param {string} senha - Senha do usuário
     * @returns {Object} Resultado do login {sucesso, usuario, mensagem}
     */
    fazerLogin(email, senha) {
        const usuarios = this.obterTodosUsuarios();
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);

        if (!usuario) {
            return {
                sucesso: false,
                mensagem: 'Email ou senha inválidos.'
            };
        }

        // Salvar usuário logado
        localStorage.setItem(this.chaveUsuarioLogado, JSON.stringify(usuario));

        return {
            sucesso: true,
            usuario: usuario,
            mensagem: `Bem-vindo, ${usuario.nome}!`
        };
    }

    /**
     * Obtém dados do usuário atualmente logado
     * @returns {Object|null} Dados do usuário ou null se não logado
     */
    obterUsuarioLogado() {
        const dados = localStorage.getItem(this.chaveUsuarioLogado);
        return dados ? JSON.parse(dados) : null;
    }

    /**
     * Faz logout do usuário
     */
    fazerLogout() {
        localStorage.removeItem(this.chaveUsuarioLogado);
    }

    /**
     * Verifica se há usuário logado
     * @returns {boolean} true se há usuário logado
     */
    temUsuarioLogado() {
        return this.obterUsuarioLogado() !== null;
    }

    /**
     * Atualiza pontuação e recorde do usuário
     * @param {number} pontuacao - Pontuação obtida neste quiz
     */
    atualizarPontuacao(pontuacao) {
        const usuarioLogado = this.obterUsuarioLogado();
        if (!usuarioLogado) return false;

        const usuarios = this.obterTodosUsuarios();
        const indice = usuarios.findIndex(u => u.id === usuarioLogado.id);

        if (indice !== -1) {
            // Atualizar pontuação total
            usuarios[indice].pontuacao += pontuacao;

            // Verificar se é novo recorde
            if (pontuacao > usuarios[indice].recorde) {
                usuarios[indice].recorde = pontuacao;
            }

            // Adicionar ao histórico
            usuarios[indice].historico.push({
                data: new Date().toISOString(),
                pontos: pontuacao
            });

            // Atualizar localStorage
            this.salvarUsuarios(usuarios);
            localStorage.setItem(this.chaveUsuarioLogado, JSON.stringify(usuarios[indice]));

            return true;
        }

        return false;
    }
}

// Instância global do gerenciador
const gerenciador = new GerenciadorUsuario();

/**
 * Processa o formulário de login
 * @param {Event} evento - Evento do formulário
 */
function processarLogin(evento) {
    evento.preventDefault();

    // Obter valores do formulário
    const email = document.getElementById('emailLogin').value.trim();
    const senha = document.getElementById('senhaLogin').value.trim();

    // Limpar mensagens de erro anteriores
    limparErros();

    // Validar campos
    if (!validarEmail(email)) {
        mostrarErro('erroEmailLogin', 'Email inválido');
        return;
    }

    if (senha.length === 0) {
        mostrarErro('erroSenhaLogin', 'Digite sua senha');
        return;
    }

    // Fazer login
    const resultado = gerenciador.fazerLogin(email, senha);

    if (resultado.sucesso) {
        // Armazenar que veio de login para redirecionar
        localStorage.setItem('vemDoLogin', 'true');
        // Redirecionar para página principal
        window.location.href = 'index.html';
    } else {
        mostrarMensagemErroLogin(resultado.mensagem);
    }
}

/**
 * Processa o formulário de registro
 * @param {Event} evento - Evento do formulário
 */
function processarRegistro(evento) {
    evento.preventDefault();

    // Obter valores do formulário
    const nome = document.getElementById('nomeRegistro').value.trim();
    const email = document.getElementById('emailRegistro').value.trim();
    const senha = document.getElementById('senhaRegistro').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

    // Limpar mensagens anteriores
    limparErros();
    limparMensagens();

    // Validações
    if (nome.length < 3) {
        mostrarErro('erroNomeRegistro', 'Nome deve ter no mínimo 3 caracteres');
        return;
    }

    if (!validarEmail(email)) {
        mostrarErro('erroEmailRegistro', 'Email inválido');
        return;
    }

    if (senha.length < 6) {
        mostrarErro('erroSenhaRegistro', 'Senha deve ter no mínimo 6 caracteres');
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarErro('erroConfirmarSenha', 'As senhas não conferem');
        return;
    }

    // Registrar usuário
    const resultado = gerenciador.registrarUsuario({
        nome: nome,
        email: email,
        senha: senha
    });

    if (resultado.sucesso) {
        mostrarMensagemSucessoRegistro(resultado.mensagem);
        // Limpar formulário
        document.getElementById('formularioRegistro').reset();
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        mostrarMensagemErroRegistro(resultado.mensagem);
    }
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} true se email é válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Mostra erro em um campo específico
 * @param {string} idElemento - ID do elemento de erro
 * @param {string} mensagem - Mensagem de erro
 */
function mostrarErro(idElemento, mensagem) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.textContent = mensagem;
    }
}

/**
 * Mostra mensagem de erro geral no login
 * @param {string} mensagem - Mensagem a exibir
 */
function mostrarMensagemErroLogin(mensagem) {
    const elemento = document.getElementById('mensagemErroLogin');
    if (elemento) {
        elemento.textContent = mensagem;
        elemento.classList.add('mostrar');
    }
}

/**
 * Mostra mensagem de erro no registro
 * @param {string} mensagem - Mensagem a exibir
 */
function mostrarMensagemErroRegistro(mensagem) {
    const elemento = document.getElementById('mensagemErroRegistro');
    if (elemento) {
        elemento.textContent = mensagem;
        elemento.classList.add('mostrar');
    }
}

/**
 * Mostra mensagem de sucesso no registro
 * @param {string} mensagem - Mensagem a exibir
 */
function mostrarMensagemSucessoRegistro(mensagem) {
    const elemento = document.getElementById('mensagemSucessoRegistro');
    if (elemento) {
        elemento.textContent = mensagem;
        elemento.classList.add('mostrar');
    }
}

/**
 * Limpa todos os erros dos campos
 */
function limparErros() {
    const erros = document.querySelectorAll('.erro');
    erros.forEach(erro => {
        erro.textContent = '';
    });
}

/**
 * Limpa mensagens gerais
 */
function limparMensagens() {
    const mensagensErro = document.querySelectorAll('.mensagem-erro');
    const mensagensSucesso = document.querySelectorAll('.mensagem-sucesso');

    mensagensErro.forEach(msg => msg.classList.remove('mostrar'));
    mensagensSucesso.forEach(msg => msg.classList.remove('mostrar'));
}

/**
 * Função global para fazer logout
 */
function fazerLogout() {
    // Resetar estado do quiz se a função existir
    if (typeof resetarEstadoQuiz === 'function') {
        resetarEstadoQuiz();
    }
    
    // Limpar localStorage apenas do usuário logado
    gerenciador.fazerLogout();
    
    // Limpar UI se estiver em index.html
    if (document.getElementById('containerQuiz')) {
        document.getElementById('containerQuiz').innerHTML = '';
        document.getElementById('telaResultados').classList.remove('mostrar');
        document.getElementById('telaRevisao').classList.remove('mostrar');
    }
    
    // Redirecionar para login
    window.location.href = 'login.html';
}
