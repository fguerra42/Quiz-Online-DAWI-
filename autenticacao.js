/* ═══════════════════════════════════════════════════════════════════ */
/*                   SISTEMA DE AUTENTICAÇÃO                           */
/*                      (Login e Registro)                             */
/*                                                                       */
/* Este arquivo gerencia:                                              */
/* - Registro de novos usuários                                        */
/* - Login com validação                                              */
/* - Sessões de usuários logados                                      */
/* - Pontuação e recordes                                             */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  CLASSE: Gerenciador de Usuários                                   */
/* ─────────────────────────────────────────────────────────────────── */

class GerenciadorUsuario {
    constructor() {
        // Locais no localStorage para guardar dados
        this.chaveUsuarios = 'quiz_usuarios';              // Lista de todos os usuários
        this.chaveUsuarioLogado = 'quiz_usuario_logado';   // Usuário logado agora
    }

    /* ─────────────────────────────────────────────────────────────────── */
    /*  MÉTODO 1: Obter Todos Usuários                                  */
    /* ─────────────────────────────────────────────────────────────────── */
    obterTodosUsuarios() {
        // Pega a lista de usuários guardada no localStorage
        // Se não existir, retorna uma lista vazia []
        const dados = localStorage.getItem(this.chaveUsuarios);
        return dados ? JSON.parse(dados) : [];
    }

    /* ─────────────────────────────────────────────────────────────────── */
    /*  MÉTODO 2: Salvar Usuários                                        */
    /* ─────────────────────────────────────────────────────────────────── */
    salvarUsuarios(usuarios) {
        // Guarda toda a lista de usuários no localStorage
        // Os dados são convertidos para texto (JSON) antes de guardar
        localStorage.setItem(this.chaveUsuarios, JSON.stringify(usuarios));
    }

    /* ─────────────────────────────────────────────────────────────────── */
    /*  MÉTODO 3: Registrar Novo Usuário                                */
    /* ─────────────────────────────────────────────────────────────────── */
    registrarUsuario(dados) {
        // Etapa 1: Obter todos os usuários registrados
        const usuarios = this.obterTodosUsuarios();

        // Etapa 2: Verificar se o email já foi registrado
        // Se sim, retornar erro (não pode usar email existente)
        if (usuarios.some(u => u.email === dados.email)) {
            return {
                sucesso: false,
                mensagem: 'Este email já está registrado. Tente fazer login.'
            };
        }

        // Etapa 3: Criar novo usuário com todos os dados necessários
        const novoUsuario = {
            id: Date.now(),                                      // ID único baseado no tempo
            nome: dados.nome,                                    // Nome do usuário
            email: dados.email,                                  // Email (usado no login)
            senha: dados.senha,                                  // Senha (em produção, usar hash!)
            dataCriacao: new Date().toISOString(),              // Quando foi criado
            pontuacao: 0,                                        // Total de pontos
            recorde: 0,                                          // Maior pontuação obtida
            historico: []                                        // Histórico de quizzes
        };

        // Etapa 4: Adicionar novo usuário à lista
        usuarios.push(novoUsuario);

        // Etapa 5: Guardar lista atualizada
        this.salvarUsuarios(usuarios);

        // Etapa 6: Retornar sucesso
        return {
            sucesso: true,
            mensagem: 'Conta criada com sucesso! Faça login para continuar.'
        };
    }

    /* ─────────────────────────────────────────────────────────────────── */
    /*  MÉTODO 4: Fazer Login (Validar Email e Senha)                 */
    /* ─────────────────────────────────────────────────────────────────── */
    fazerLogin(email, senha) {
        // PASSO 1: Obter todos os usuários guardados
        const usuarios = this.obterTodosUsuarios();

        // PASSO 2: Procurar um usuário com email e senha iguais aos dados digitados
        const usuario = usuarios.find(u => {
            return u.email === email && u.senha === senha;
        });

        // PASSO 3: Se não encontrou, retornar erro
        if (!usuario) {
            return {
                sucesso: false,
                mensagem: 'Email ou senha inválidos.'
            };
        }

        // PASSO 4: Se encontrou, guardar o usuário como "logado" no localStorage
        localStorage.setItem(this.chaveUsuarioLogado, JSON.stringify(usuario));

        // PASSO 5: Retornar sucesso com os dados do usuário
        return {
            sucesso: true,
            usuario: usuario,
            mensagem: `Bem-vindo, ${usuario.nome}!`
        };
    }

    /* ─────────────────────────────────────────────────────────────────── */
    /*  MÉTODO 5: Obter Usuário Logado                                  */
    /* ─────────────────────────────────────────────────────────────────── */
    obterUsuarioLogado() {
        // Tenta pegar os dados do usuário logado do localStorage
        // Se não existir, retorna null (nenhum usuário logado)
        const dados = localStorage.getItem(this.chaveUsuarioLogado);
        return dados ? JSON.parse(dados) : null;
    }

    /* ─────────────────────────────────────────────────────────────────── */
    /*  MÉTODO 6: Fazer Logout                                           */
    /* ─────────────────────────────────────────────────────────────────── */
    fazerLogout() {
        // Remove os dados do usuário logado do localStorage
        // Isso faz o usuário sair da conta
        localStorage.removeItem(this.chaveUsuarioLogado);
    }

    /* ─────────────────────────────────────────────────────────────────── */
    /*  MÉTODO 7: Verificar se Tem Usuário Logado                       */
    /* ─────────────────────────────────────────────────────────────────── */
    temUsuarioLogado() {
        // Retorna true se há um usuário logado, false caso contrário
        return this.obterUsuarioLogado() !== null;
    }

    /* ─────────────────────────────────────────────────────────────────── */
    /*  MÉTODO 8: Atualizar Pontuação do Usuário                        */
    /* ─────────────────────────────────────────────────────────────────── */
    atualizarPontuacao(pontuacao) {
        // PASSO 1: Obter usuário logado agora
        const usuarioLogado = this.obterUsuarioLogado();
        if (!usuarioLogado) return false;  // Se não tem usuário, parar aqui

        // PASSO 2: Obter lista de todos os usuários
        const usuarios = this.obterTodosUsuarios();

        // PASSO 3: Encontrar índice do usuário logado na lista
        const indice = usuarios.findIndex(u => u.id === usuarioLogado.id);

        // PASSO 4: Se encontrou o usuário, atualizar dados
        if (indice !== -1) {
            // Somar pontuação nova com pontuação total
            usuarios[indice].pontuacao += pontuacao;

            // Verificar se essa pontuação é um novo recorde
            if (pontuacao > usuarios[indice].recorde) {
                usuarios[indice].recorde = pontuacao;
            }

            // Adicionar ao histórico (para análise posterior)
            usuarios[indice].historico.push({
                data: new Date().toISOString(),
                pontos: pontuacao
            });

            // Atualizar no localStorage
            this.salvarUsuarios(usuarios);
            localStorage.setItem(this.chaveUsuarioLogado, JSON.stringify(usuarios[indice]));

            return true;
        }

        return false;
    }
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  INSTÂNCIA GLOBAL                                                   */
/* ═══════════════════════════════════════════════════════════════════ */

// Cria uma instância global do gerenciador que pode ser usada em todo o projeto
const gerenciador = new GerenciadorUsuario();

/* ═══════════════════════════════════════════════════════════════════ */
/*  FUNÇÕES DE AUTENTICAÇÃO                                            */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 1: Processar Formulário de Login                           */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função:
// 1. Recebe o formulário enviado pelo usuário
// 2. Valida email e senha
// 3. Tenta fazer login
// 4. Redireciona se bem-sucedido ou mostra erro
function processarLogin(evento) {
    // Evitar que o formulário recarregue a página
    evento.preventDefault();

    // PASSO 1: Obter valores digitados no formulário
    const email = document.getElementById('emailLogin').value.trim();
    const senha = document.getElementById('senhaLogin').value.trim();

    // PASSO 2: Limpar mensagens de erro anteriores
    limparErros();

    // PASSO 3: Validar email
    if (!validarEmail(email)) {
        mostrarErro('erroEmailLogin', 'Email inválido');
        return;  // PARAR - não continuar
    }

    // PASSO 4: Validar senha (não pode estar vazia)
    if (senha.length === 0) {
        mostrarErro('erroSenhaLogin', 'Digite sua senha');
        return;  // PARAR - não continuar
    }

    // PASSO 5: Chamar gerenciador para fazer login
    const resultado = gerenciador.fazerLogin(email, senha);

    // PASSO 6: Se login bem-sucedido, redirecionar para menu
    if (resultado.sucesso) {
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 300);
    } else {
        // Se falhou, mostrar mensagem de erro
        mostrarMensagemErroLogin(resultado.mensagem);
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 2: Processar Formulário de Registro                        */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função:
// 1. Recebe o formulário de novo usuário
// 2. Valida todos os campos (7 validações)
// 3. Registra novo usuário
// 4. Redireciona para login
function processarRegistro(evento) {
    // Evitar que o formulário recarregue a página
    evento.preventDefault();

    // PASSO 1: Obter valores digitados no formulário
    const nome = document.getElementById('nomeRegistro').value.trim();
    const email = document.getElementById('emailRegistro').value.trim();
    const senha = document.getElementById('senhaRegistro').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

    // PASSO 2: Limpar mensagens antigas
    limparErros();
    limparMensagens();

    // ✅ VALIDAÇÃO 1: Nome não pode estar vazio
    if (!nome || nome.length === 0) {
        mostrarErro('erroNomeRegistro', 'Digite seu nome');
        return;  // PARAR - não continuar
    }

    // ✅ VALIDAÇÃO 2: Nome deve ter no mínimo 3 caracteres
    if (nome.length < 3) {
        mostrarErro('erroNomeRegistro', 'Nome deve ter no mínimo 3 caracteres');
        return;  // PARAR - não continuar
    }

    // ✅ VALIDAÇÃO 3: Email não pode estar vazio
    if (!email || email.length === 0) {
        mostrarErro('erroEmailRegistro', 'Digite seu email');
        return;  // PARAR - não continuar
    }

    // ✅ VALIDAÇÃO 4: Email deve ter formato válido (exemplo@email.com)
    if (!validarEmail(email)) {
        mostrarErro('erroEmailRegistro', 'Email inválido');
        return;  // PARAR - não continuar
    }

    // ✅ VALIDAÇÃO 5: Senha não pode estar vazia
    if (!senha || senha.length === 0) {
        mostrarErro('erroSenhaRegistro', 'Digite sua senha');
        return;  // PARAR - não continuar
    }

    // ✅ VALIDAÇÃO 6: Senha deve ter no mínimo 6 caracteres
    if (senha.length < 6) {
        mostrarErro('erroSenhaRegistro', 'Senha deve ter no mínimo 6 caracteres');
        return;  // PARAR - não continuar
    }

    // ✅ VALIDAÇÃO 7: Confirmação de senha não pode estar vazia
    if (!confirmarSenha || confirmarSenha.length === 0) {
        mostrarErro('erroConfirmarSenha', 'Confirme sua senha');
        return;  // PARAR - não continuar
    }

    // ✅ VALIDAÇÃO 8: As duas senhas devem ser iguais
    if (senha !== confirmarSenha) {
        mostrarErro('erroConfirmarSenha', 'As senhas não conferem');
        return;  // PARAR - não continuar
    }

    // PASSO 3: Todas as validações passaram - Registrar usuário
    const resultado = gerenciador.registrarUsuario({
        nome: nome,
        email: email,
        senha: senha
    });

    // PASSO 4: Se registro bem-sucedido, redirecionar para login
    if (resultado.sucesso) {
        mostrarMensagemSucessoRegistro(resultado.mensagem);
        // Limpar formulário
        document.getElementById('formularioRegistro').reset();
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        // Se falhou, mostrar mensagem de erro
        mostrarMensagemErroRegistro(resultado.mensagem);
    }
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FUNÇÕES AUXILIARES DE VALIDAÇÃO                                    */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 3: Validar Email                                           */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função verifica se o email tem o formato correto:
// - Deve ter um texto antes do @
// - Deve ter um texto entre @ e .
// - Deve ter um texto após o ponto
// Exemplos: usuario@email.com ✅ | email.errado ❌
function validarEmail(email) {
    // Usa expressão regular para validar o padrão de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 4: Mostrar Erro em Campo                                   */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função coloca uma mensagem de erro embaixo de um campo do formulário
// Exemplo: se email é inválido, mostra "Email inválido" embaixo do campo de email
function mostrarErro(idElemento, mensagem) {
    // Encontra o elemento no HTML com esse ID
    const elemento = document.getElementById(idElemento);
    // Se encontrou, coloca a mensagem de erro
    if (elemento) {
        elemento.textContent = mensagem;
    }
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FUNÇÕES DE EXIBIÇÃO DE MENSAGENS                                   */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 5: Mostrar Mensagem de Erro no Login                       */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função mostra uma caixa com mensagem de erro geral na tela de login
// Exemplo: "Email ou senha inválidos"
function mostrarMensagemErroLogin(mensagem) {
    const elemento = document.getElementById('mensagemErroLogin');
    if (elemento) {
        elemento.textContent = mensagem;
        elemento.classList.add('mostrar');  // Deixa visível
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 6: Mostrar Mensagem de Erro no Registro                    */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função mostra uma caixa com mensagem de erro geral na tela de registro
// Exemplo: "Este email já está registrado"
function mostrarMensagemErroRegistro(mensagem) {
    const elemento = document.getElementById('mensagemErroRegistro');
    if (elemento) {
        elemento.textContent = mensagem;
        elemento.classList.add('mostrar');  // Deixa visível
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 7: Mostrar Mensagem de Sucesso no Registro                 */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função mostra uma caixa com mensagem de sucesso na tela de registro
// Exemplo: "Conta criada com sucesso!"
function mostrarMensagemSucessoRegistro(mensagem) {
    const elemento = document.getElementById('mensagemSucessoRegistro');
    if (elemento) {
        elemento.textContent = mensagem;
        elemento.classList.add('mostrar');  // Deixa visível
    }
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 8: Limpar Mensagens de Erro dos Campos                     */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função apaga todas as mensagens de erro dos campos do formulário
// Usada quando o formulário é aberto novamente
function limparErros() {
    // Encontra todos os elementos com classe "erro" no formulário
    const erros = document.querySelectorAll('.erro');
    // Para cada erro encontrado, apaga o texto
    erros.forEach(erro => {
        erro.textContent = '';
    });
}

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 9: Limpar Mensagens Gerais                                 */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função apaga as mensagens de erro e sucesso da página
// Usada antes de processar um novo formulário
function limparMensagens() {
    // Encontra todas as caixas de mensagem de erro
    const mensagensErro = document.querySelectorAll('.mensagem-erro');
    // Encontra todas as caixas de mensagem de sucesso
    const mensagensSucesso = document.querySelectorAll('.mensagem-sucesso');

    // Remove a classe "mostrar" de cada erro (para esconder)
    mensagensErro.forEach(msg => msg.classList.remove('mostrar'));
    // Remove a classe "mostrar" de cada sucesso (para esconder)
    mensagensSucesso.forEach(msg => msg.classList.remove('mostrar'));
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  FUNÇÃO GLOBAL DE LOGOUT                                            */
/* ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────── */
/*  FUNÇÃO 10: Fazer Logout                                           */
/* ─────────────────────────────────────────────────────────────────── */

// Esta função:
// 1. Limpa os dados do usuário logado
// 2. Reseta o estado do quiz
// 3. Limpa a interface
// 4. Redireciona para a tela de login
function fazerLogout() {
    try {
        // PASSO 1: Resetar estado do quiz se a função existir (importada de quiz-pt.js)
        if (typeof resetarEstadoQuiz === 'function') {
            resetarEstadoQuiz();
        }

        // PASSO 2: Remover usuário logado do localStorage
        localStorage.removeItem('quiz_usuario_logado');

        // PASSO 3: Se está na página do quiz, limpar UI
        if (document.getElementById('containerQuiz')) {
            document.getElementById('containerQuiz').innerHTML = '';
            const telaResultados = document.getElementById('telaResultados');
            const telaRevisao = document.getElementById('telaRevisao');
            if (telaResultados) telaResultados.classList.remove('mostrar');
            if (telaRevisao) telaRevisao.classList.remove('mostrar');
        }

        // PASSO 4: Redirecionar para login
        window.location.replace('login.html');

    } catch (erro) {
        // Se algo deu erro, mesmo assim redireciona para login
        console.error('Erro ao fazer logout:', erro);
        window.location.replace('login.html');
    }
}