# 🧪 GUIA DE TESTES - SISTEMA DE LOGIN

## Problema Identificado
O login pode não estar funcionando corretamente devido a:
- Duplicação de event listeners
- Problemas com redirecionamento
- localStorage não sincronizando

## ✅ Solução Implementada

### 1. Remover duplicação de listeners em login.html
- ❌ ANTES: `onsubmit="processarLogin(event); return false;"` + `.addEventListener('submit', processarLogin)`
- ✅ DEPOIS: Apenas `.addEventListener('submit', processarLogin)` no script

### 2. Teste Passo a Passo

#### Passo 1: Limpar localStorage
```javascript
localStorage.clear()
```

#### Passo 2: Registrar novo usuário
1. Ir para http://localhost:8000/registro.html
2. Preencher:
   - Nome: `João Silva`
   - Email: `joao@example.com`
   - Senha: `senha123`
   - Confirmar: `senha123`
3. Verificar console (F12) para logs

#### Passo 3: Fazer Login
1. Ir para http://localhost:8000/login.html
2. Preencher:
   - Email: `joao@example.com`
   - Senha: `senha123`
3. Clicar em "Entrar"
4. Verificar:
   - ✓ Console mostra logs de login
   - ✓ Redireciona para index.html
   - ✓ Header mostra nome do usuário
   - ✓ localStorage contém usuário logado

#### Passo 4: Verificar no Quiz
1. Responder uma questão corretamente
2. Verificar se pontos são atualizados

#### Passo 5: Fazer Logout
1. Clicar em botão "Sair"
2. Verificar:
   - ✓ Redireciona para login.html
   - ✓ Console mostra logs de logout
   - ✓ localStorage foi limpo

#### Passo 6: Tentar fazer login novamente
- Deve funcionar normalmente

## 🔍 Console Debug

### Logs esperados no Login:
```
=== INICIANDO LOGIN ===
Email digitado: joao@example.com
Senha digitada: senha123
Chamando gerenciador.fazerLogin()...
Usuários no localStorage: [...]
Procurando por: joao@example.com senha123
Comparando joao@example.com === joao@example.com e senha
Usuário encontrado, salvando sessão: {...}
Resultado do login: {sucesso: true, ...}
Login bem-sucedido, redirecionando...
```

### Logs esperados no Logout:
```
=== INICIANDO LOGOUT ===
Resetando estado do quiz...
Removendo usuário logado do localStorage...
GerenciadorUsuario.fazerLogout() chamado
Removendo chave: quiz_usuario_logado
Logout concluído
Limpando UI do quiz...
Redirecionando para login...
```

## 📋 Checklist de Funcionamento

- [ ] Registro funciona sem erros
- [ ] Login redireciona para index.html
- [ ] Header mostra nome do usuário após login
- [ ] Pontuation atualiza após responder
- [ ] Logout limpa localStorage
- [ ] Logout redireciona para login
- [ ] Login funciona novamente após logout
- [ ] localStorage está vazio após logout

## 🐛 Se ainda tiver bugs

1. Abrir DevTools (F12)
2. Ir para Application > Local Storage
3. Verificar conteúdo de `quiz_usuarios` e `quiz_usuario_logado`
4. Verificar Console para mensagens de erro
5. Compartilhar erro específico

---

**Arquivo de teste criado**: teste-login.html
Acesse: http://localhost:8000/teste-login.html
