# 🎓 Sistema de Quiz Interativo com Autenticação

Um sistema de quiz dinâmico, responsivo e totalmente funcional desenvolvido em **HTML5**, **CSS3** e **JavaScript Vanilla**, com sistema completo de autenticação de usuários e pontuação em tempo real.

## ✨ Características Principais

### 🔐 Autenticação
- ✅ Registro de novos usuários
- ✅ Login seguro com validação
- ✅ Logout com limpeza completa de estado
- ✅ Dados persistidos em localStorage

### 🎯 Sistema de Quiz
- ✅ 10 perguntas de JavaScript
- ✅ 4 opções de resposta por pergunta
- ✅ Feedback imediato (correto em verde, incorreto em vermelho)
- ✅ Sistema de pontuação: 10 pontos por acerto
- ✅ Barra de progresso visual
- ✅ Cronômetro integrado

### 📊 Pontuação e Recordes
- ✅ Cálculo automático de pontos
- ✅ Rastreamento de recorde (melhor score)
- ✅ Histórico de tentativas
- ✅ Estatísticas de desempenho

### 🎨 Interface
- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Animações suaves
- ✅ Gradientes profissionais
- ✅ Acessibilidade
- ✅ Sem dependências externas

## 📁 Estrutura do Projeto

```
WEB_PROJECT/
├── index.html              # Página principal do quiz
├── login.html              # Página de login
├── registro.html           # Página de registro
├── quiz-pt.js              # Lógica do quiz (português)
├── autenticacao.js         # Sistema de autenticação
├── styles.css              # Estilos gerais
├── autenticacao.css        # Estilos de login/registro
├── questions.json          # Base de dados de perguntas
├── START.sh                # Script de inicialização
└── README.md               # Este arquivo
```

## 🚀 Como Executar

### Opção 1: Servidor Local (Recomendado)
```bash
cd /home/fguerra/WEB_PROJECT
python3 -m http.server 8000
```

Acesse: `http://localhost:8000/login.html`

### Opção 2: Abrir Direto no Navegador
Faça duplo clique em `login.html`

## 📝 Como Usar

### 1️⃣ Registre-se (Primeira Vez)
- Clique em **"Criar Conta"** na página de login
- Preencha:
  - **Nome**: Mínimo 3 caracteres
  - **Email**: Email válido
  - **Senha**: Mínimo 6 caracteres
  - **Confirmar Senha**: Deve ser igual à senha

### 2️⃣ Faça Login
- Insira seu **Email** e **Senha**
- Clique em **"Entrar"**

### 3️⃣ Realize o Quiz
- Responda às 10 perguntas
- Veja feedback imediato
- Acompanhe a barra de progresso
- Cada acerto = 10 pontos

### 4️⃣ Veja os Resultados
- Percentual de acerto
- Total de pontos ganhos
- Mensagem de desempenho personalizada
- Opção de revisar ou reiniciar

### 5️⃣ Faça Logout
- Clique no botão **"Sair"** (canto superior direito)
- Volta para login limpo

## 💾 Dados Armazenados

Todo os dados são salvos localmente no navegador (localStorage):

```json
{
  "quiz_usuarios": [
    {
      "id": 1702414800000,
      "nome": "João Silva",
      "email": "joao@example.com",
      "senha": "123456",
      "dataCriacao": "2025-12-15T15:58:00Z",
      "pontuacao": 80,
      "recorde": 100,
      "historico": [
        {
          "data": "2025-12-15T15:58:00Z",
          "pontos": 80
        }
      ]
    }
  ]
}
```

## 🔒 Segurança

- ✅ Validação de email
- ✅ Validação de senha
- ✅ Escape de HTML para evitar XSS
- ✅ Autenticação baseada em localStorage
- ⚠️ Nota: Em produção, usar backend seguro com hashing de senhas

## 📱 Responsividade

O sistema é totalmente responsivo em:
- 📱 **Mobile**: < 480px
- 📱 **Tablet**: 480px - 768px
- 💻 **Desktop**: > 768px

## 🎨 Tecnologias

- **HTML5**: Semântica e estrutura
- **CSS3**: Flexbox, Grid, Gradientes, Animações
- **JavaScript ES6+**: Classes, Async/Await, Arrow Functions
- **LocalStorage**: Persistência de dados

## 📊 Arquivos JavaScript

### `quiz-pt.js` (~457 linhas)
- Estado global do quiz
- Inicialização e renderização
- Lógica de resposta
- Cálculo de pontuação
- Telas de resultados e revisão

### `autenticacao.js` (~344 linhas)
- Classe `GerenciadorUsuario`
- Registro e login
- Validação de dados
- Gerenciamento de sessão

## 🛠️ Customização

### Adicionar Mais Perguntas
Edite `questions.json` e adicione perguntas ao array:

```json
{
  "id": 11,
  "pergunta": "Sua pergunta aqui?",
  "opcoes": [
    "Opção 1",
    "Opção 2",
    "Opção 3",
    "Opção 4"
  ],
  "respostaCorreta": 0
}
```

### Mudar Cores
Edite as variáveis CSS em `styles.css`:

```css
:root {
    --primary-color: #3498db;
    --success-color: #2ecc71;
    --danger-color: #e74c3c;
    ...
}
```

## 📈 Estatísticas do Projeto

- **Arquivos**: 9
- **Linhas de Código**: ~2,400
- **Tamanho**: ~60 KB
- **Funcionalidades**: 15+

## ✅ Funcionalidades Implementadas

- [x] Login e Registro
- [x] Autenticação de usuários
- [x] Quiz com perguntas dinâmicas
- [x] Sistema de pontuação (10 pts por acerto)
- [x] Recordes e histórico
- [x] Feedback imediato
- [x] Barra de progresso
- [x] Cronômetro
- [x] Revisão de respostas
- [x] Design responsivo
- [x] Validação de dados
- [x] Logout com limpeza

## 🐛 Problemas Conhecidos

Nenhum no momento! Tudo funcionando perfeitamente ✅

## 📝 Notas de Desenvolvimento

- Sem dependências externas (Vanilla JS)
- Código comentado em português
- Estrutura limpa e modular
- Fácil de manter e expandir

## 👨‍💻 Autor

Desenvolvido para aprendizado e educação em 2025

## 📄 Licença

Este projeto é de código aberto e pode ser utilizado livremente.

---

**Desenvolvido com ❤️ para educação**
