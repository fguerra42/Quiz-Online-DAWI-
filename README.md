# 🎓 Sistema de Quiz Interativo

Um sistema completo de quiz com autenticação, 4 categorias diferentes e responsividade total em todos os dispositivos.

## ✨ Funcionalidades Principais

### 🔐 Autenticação
- ✅ Registro de usuários com validação completa
- ✅ Login seguro
- ✅ Logout com limpeza de sessão
- ✅ Dados persistidos em localStorage

### 🎯 Sistema de Quiz
- ✅ 4 categorias temáticas diferentes
- ✅ 10 questões por categoria (40 total)
- ✅ Feedback imediato (verde/vermelho)
- ✅ Pontuação: 10 pontos por acerto
- ✅ Revisão de respostas
- ✅ Cronômetro integrado

### 📊 Gerenciamento de Dados
- ✅ Pontuação em tempo real
- ✅ Sistema de recordes
- ✅ Histórico de tentativas com data/hora
- ✅ Perfil de usuário
- ✅ Estatísticas completas

### 📱 Design Responsivo
- ✅ Mobile (320px - 480px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (1200px+)
- ✅ Rodapés otimizados
- ✅ Sem dependências externas

## 📁 Estrutura do Projeto

```
WEB_PROJECT/
├── index.html                    # Página do quiz
├── login.html                    # Login
├── registro.html                 # Registro
├── menu.html                     # Menu principal
├── categorias.html               # Seleção de categorias
│
├── quiz-pt.js                    # Lógica do quiz
├── autenticacao.js               # Sistema de autenticação
├── menu.js                       # Lógica do menu
├── categorias.js                 # Lógica de categorias
│
├── styles.css                    # Estilos do quiz
├── autenticacao.css              # Estilos de autenticação
├── menu.css                      # Estilos do menu
├── categorias.css                # Estilos de categorias
│
├── questions-categorias.json     # Base de dados (40 perguntas)
├── .gitignore                    # Configuração Git
└── README.md                     # Documentação
```

## 🚀 Como Iniciar

```bash
cd /home/fguerra/WEB_PROJECT
python3 -m http.server 8000
```

Abra no navegador: **http://localhost:8000/login.html**

## 📚 As 4 Categorias

| Categoria | Ícone | Tópicos |
|-----------|-------|---------|
| **Tecnologia** | 💻 | HTML, JavaScript, Cloud, APIs, Git, Databases |
| **Desporto** | ⚽ | Futebol, Ténis, Fórmula 1, Basquetebol |
| **Cultura Geral** | 🌍 | Capitais, História, Geografia, Artes |
| **Matemática** | 🔢 | Aritmética, Geometria, Álgebra, Lógica |

## 🔄 Fluxo da Aplicação

```
Login/Registro
        ↓
   Menu Principal
   ├─ Jogar → Categorias → Quiz (10 questões) → Resultado
   ├─ Histórico (Modal)
   ├─ Perfil (Modal)
   ├─ Sobre (Modal)
   └─ Logout → Volta para Login
```

## 🎨 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Flexbox, Grid, Animações, Media Queries
- **JavaScript ES6+** - Código moderno e limpo
- **localStorage** - Persistência de dados local
- **Sem frameworks** - Código vanilla puro

## 📊 Sistema de Pontuação

- **10 pontos** por resposta correta
- **0 pontos** por resposta errada
- **Máximo**: 100 pontos por quiz
- **Recorde** salvo automaticamente
- **Histórico** de todas as tentativas

## 📱 Responsividade

Totalmente otimizado para todos os tamanhos:

| Dispositivo | Largura | Otimização |
|------------|---------|------------|
| iPhone SE/5 | 320-375px | 1 coluna, font 9px |
| Galaxy S/Moto G | 360-480px | 1 coluna, font 10px |
| iPad Mini | 768px | 2 colunas |
| Tablets | 1024px | Layout completo |
| Desktop | 1200px+ | Layout original |

## ✅ Validações Implementadas

**Registro:**
- Nome obrigatório (mín. 3 caracteres)
- Email válido (formato correto)
- Senha obrigatória
- Confirmação de senha igual
- Email não pode ser duplicado

**Login:**
- Email obrigatório
- Senha obrigatória
- Email deve estar registrado
- Senha deve estar correta

## 💾 Armazenamento de Dados

Dados salvos em `localStorage`:
- `quiz_usuarios` - Lista de usuários registrados
- `quiz_usuario_logado` - Usuário atualmente logado
- `quiz_categoria_selecionada` - Categoria escolhida

## 🎯 Exemplo de Uso

### 1. Registrar-se
- Email: seu@email.com
- Senha: 123456
- Confirmar: 123456

### 2. Fazer Login
- Usar as credenciais acima

### 3. Jogar Quiz
- Clique em "Jogar"
- Escolha uma categoria
- Responda as 10 questões
- Veja sua pontuação

### 4. Ver Histórico
- Clique em "Histórico" para ver todas as tentativas
- Veja seu recorde e estatísticas

## 🔐 Segurança

- Validação de formulários
- Proteção de rotas (acesso apenas com login)
- Logout limpa a sessão completamente
- Dados não são expostos nas URLs

## 🚀 Funcionalidades Adicionais

- ✨ Menu com saudação personalizada
- 📊 Barra de progresso visual
- ⏱️ Cronômetro durante o quiz
- 🔄 Revisão de respostas
- 📈 Estatísticas do usuário
- 🎯 Sistema de categorias

## 📝 Estrutura de Código

**JavaScript:**
- `autenticacao.js` - Gestão de usuários
- `quiz-pt.js` - Lógica do quiz
- `menu.js` - Lógica do menu
- `categorias.js` - Seleção de categorias

**CSS:**
- `autenticacao.css` - Estilos de login/registro
- `styles.css` - Estilos do quiz
- `menu.css` - Estilos do menu
- `categorias.css` - Estilos de categorias

**JSON:**
- `questions-categorias.json` - 40 questões em 4 categorias

## 🌟 Destaques

✨ **100% Responsivo** - Funciona perfeitamente em qualquer dispositivo  
✨ **Sem Dependências** - Código vanilla puro  
✨ **Portuguese Complete** - Interface 100% em português  
✨ **4 Categorias** - 40 questões variadas  
✨ **Pronto para Produção** - Código otimizado e organizado

## 📊 Estatísticas

- **Total de Questões:** 40
- **Categorias:** 4
- **Questões por Categoria:** 10
- **Pontos por Acerto:** 10
- **Pontuação Máxima:** 100
- **Linhas de Código:** ~2.500+

## 👥 Desenvolvido por

**Firmino da Silva Guerra** & **Panzo Rafael Chiló**

---

**Status:** ✅ Completo e Responsivo  
**Versão:** 2.0  
**Data:** 15 de Dezembro de 2025  
**Licença:** Código aberto
