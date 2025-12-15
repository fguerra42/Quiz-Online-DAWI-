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
        console.log('Usuários no localStorage:', usuarios);
        console.log('Procurando por:', email, senha);

        const usuario = usuarios.find(u => {
            console.log(`Comparando ${u.email} === ${email} e senha`);
            return u.email === email && u.senha === senha;
        });

        if (!usuario) {
            console.log('Usuário não encontrado ou senha incorreta');
            return {
                sucesso: false,
                mensagem: 'Email ou senha inválidos.'
            };
        }

        // Salvar usuário logado
        console.log('Usuário encontrado, salvando sessão:', usuario);
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
        console.log('GerenciadorUsuario.fazerLogout() chamado');
        console.log('Removendo chave:', this.chaveUsuarioLogado);
        localStorage.removeItem(this.chaveUsuarioLogado);
        console.log('Logout concluído');
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
    console.log('=== INICIANDO LOGIN ===');

    // Obter valores do formulário
    const email = document.getElementById('emailLogin').value.trim();
    const senha = document.getElementById('senhaLogin').value.trim();

    console.log('Email digitado:', email);
    console.log('Senha digitada:', senha);

    // Limpar mensagens de erro anteriores
    limparErros();

    // Validar campos
    if (!validarEmail(email)) {
        console.log('Email inválido');
        mostrarErro('erroEmailLogin', 'Email inválido');
        return;
    }

    if (senha.length === 0) {
        console.log('Senha vazia');
        mostrarErro('erroSenhaLogin', 'Digite sua senha');
        return;
    }

    // Fazer login
    console.log('Chamando gerenciador.fazerLogin()...');
    const resultado = gerenciador.fazerLogin(email, senha);

    console.log('Resultado do login:', resultado);

    if (resultado.sucesso) {
        console.log('Login bem-sucedido, redirecionando para menu...');
        // Aguardar um momento e depois redirecionar para o menu principal
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 300);
    } else {
        console.log('Login falhou:', resultado.mensagem);
        mostrarMensagemErroLogin(resultado.mensagem);
    }
}

/**
 * Processa o formulário de registro
 * @param {Event} evento - Evento do formulário
 */
function processarRegistro(evento) {
    evento.preventDefault();
    console.log('=== INICIANDO REGISTRO ===');

    // Obter valores do formulário
    const nome = document.getElementById('nomeRegistro').value.trim();
    const email = document.getElementById('emailRegistro').value.trim();
    const senha = document.getElementById('senhaRegistro').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

    // Limpar mensagens anteriores
    limparErros();
    limparMensagens();

    // ✅ VALIDAÇÃO 1: Verificar se nome está preenchido
    if (!nome || nome.length === 0) {
        console.log('❌ Erro: Nome vazio');
        mostrarErro('erroNomeRegistro', 'Digite seu nome');
        return; // PARAR AQUI - não continuar
    }

    if (nome.length < 3) {
        console.log('❌ Erro: Nome muito curto');
        mostrarErro('erroNomeRegistro', 'Nome deve ter no mínimo 3 caracteres');
        return; // PARAR AQUI - não continuar
    }

    // ✅ VALIDAÇÃO 2: Verificar email vazio
    if (!email || email.length === 0) {
        console.log('❌ Erro: Email vazio');
        mostrarErro('erroEmailRegistro', 'Digite seu email');
        return; // PARAR AQUI - não continuar
    }

    // ✅ VALIDAÇÃO 3: Validar formato de email
    if (!validarEmail(email)) {
        console.log('❌ Erro: Email inválido');
        mostrarErro('erroEmailRegistro', 'Email inválido');
        return; // PARAR AQUI - não continuar
    }

    // ✅ VALIDAÇÃO 4: Verificar se senha está preenchida
    if (!senha || senha.length === 0) {
        console.log('❌ Erro: Senha vazia');
        mostrarErro('erroSenhaRegistro', 'Digite sua senha');
        return; // PARAR AQUI - não continuar
    }

    // ✅ VALIDAÇÃO 5: Verificar tamanho da senha
    if (senha.length < 6) {
        console.log('❌ Erro: Senha muito curta');
        mostrarErro('erroSenhaRegistro', 'Senha deve ter no mínimo 6 caracteres');
        return; // PARAR AQUI - não continuar
    }

    // ✅ VALIDAÇÃO 6: Verificar confirmação de senha vazia
    if (!confirmarSenha || confirmarSenha.length === 0) {
        console.log('❌ Erro: Confirmação de senha vazia');
        mostrarErro('erroConfirmarSenha', 'Confirme sua senha');
        return; // PARAR AQUI - não continuar
    }

    // ✅ VALIDAÇÃO 7: Verificar se as senhas são iguais
    if (senha !== confirmarSenha) {
        console.log('❌ Erro: Senhas não conferem');
        mostrarErro('erroConfirmarSenha', 'As senhas não conferem');
        return; // PARAR AQUI - não continuar
    }

    // ✅ TODAS AS VALIDAÇÕES PASSARAM - Agora registrar usuário
    console.log('✅ Todas as validações OK. Registrando usuário...');

    const resultado = gerenciador.registrarUsuario({
        nome: nome,
        email: email,
        senha: senha
    });

    if (resultado.sucesso) {
        console.log('✅ Registro bem-sucedido!');
        mostrarMensagemSucessoRegistro(resultado.mensagem);
        // Limpar formulário
        document.getElementById('formularioRegistro').reset();
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        console.log('❌ Erro no registro:', resultado.mensagem);
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
    console.log('=== INICIANDO LOGOUT ===');

    try {
        // Resetar estado do quiz se a função existir
        if (typeof resetarEstadoQuiz === 'function') {
            console.log('Resetando estado do quiz...');
            resetarEstadoQuiz();
        }

        // Limpar localStorage apenas do usuário logado
        console.log('Removendo usuário logado do localStorage...');
        localStorage.removeItem('quiz_usuario_logado');

        // Verificar se foi removido corretamente
        const usuarioVerificacao = localStorage.getItem('quiz_usuario_logado');
        console.log('Usuário após logout:', usuarioVerificacao);

        // Limpar UI se estiver em index.html
        if (document.getElementById('containerQuiz')) {
            console.log('Limpando UI do quiz...');
            document.getElementById('containerQuiz').innerHTML = '';
            const telaResultados = document.getElementById('telaResultados');
            const telaRevisao = document.getElementById('telaRevisao');
            if (telaResultados) telaResultados.classList.remove('mostrar');
            if (telaRevisao) telaRevisao.classList.remove('mostrar');
        }

        console.log('Redirecionando para login.html...');

        // Redirecionar de forma síncrona e direta
        window.location.replace('login.html');

    } catch (erro) {
        console.error('Erro ao fazer logout:', erro);
        // Mesmo com erro, tenta redirecionar
        window.location.replace('login.html');
    }
}
