#!/usr/bin/env bash

# 🎓 Sistema de Quiz Interativo - Startup Script
# Este script oferece menu interativo para usar o quiz

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     🎓 SISTEMA DE QUIZ COM FEEDBACK DINÂMICO 🎓            ║"
echo "║                                                            ║"
echo "║                    Versão 1.0.0                           ║"
echo "║                    Dezembro 2025                          ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✨ Bem-vindo ao Sistema de Quiz Interativo!"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Menu
show_menu() {
    echo "${BLUE}═══════════════════════════════════════${NC}"
    echo "📋 MENU PRINCIPAL"
    echo "${BLUE}═══════════════════════════════════════${NC}"
    echo ""
    echo "  1️⃣  Abrir Quiz no Navegador (Recomendado)"
    echo "  2️⃣  Ver Documentação"
    echo "  3️⃣  Iniciar Servidor Local (Python)"
    echo "  4️⃣  Verificar Arquivos"
    echo "  5️⃣  Informações do Projeto"
    echo "  6️⃣  Abrir Quiz Compacto"
    echo "  7️⃣  Ver Exemplos de Perguntas"
    echo "  8️⃣  Sair"
    echo ""
    echo "${BLUE}═══════════════════════════════════════${NC}"
    read -p "Escolha uma opção (1-8): " choice
}

# Funções
open_quiz() {
    echo ""
    echo "🚀 Abrindo Quiz no navegador..."
    echo ""
    if command -v xdg-open &> /dev/null; then
        xdg-open index.html &
    elif command -v open &> /dev/null; then
        open index.html &
    else
        echo "❌ Não foi possível abrir automaticamente."
        echo "📝 Abra manualmente o arquivo: $(pwd)/index.html"
    fi
    echo ""
}

show_docs() {
    echo ""
    echo "📚 DOCUMENTAÇÃO DISPONÍVEL:"
    echo ""
    echo "  📖 README.md                 - Guia de uso"
    echo "  📋 GUIDE.md                  - Guia completo com FAQ"
    echo "  ⚙️  TECHNICAL.md              - Documentação técnica"
    echo "  🎨 CUSTOMIZATION.md          - Como customizar"
    echo "  🚀 DEPLOY.md                 - Como fazer deploy"
    echo "  🧪 TESTING.md                - Testes e validação"
    echo "  📊 PROJECT_SUMMARY.md        - Resumo do projeto"
    echo "  📄 docs.html                 - Página de documentação (HTML)"
    echo ""
    read -p "Deseja abrir um arquivo? (s/n): " resp
    if [[ $resp == "s" ]] || [[ $resp == "S" ]]; then
        read -p "Digite o nome do arquivo (sem extensão): " filename
        if [ -f "${filename}.md" ]; then
            less "${filename}.md"
        elif [ -f "${filename}.html" ]; then
            if command -v xdg-open &> /dev/null; then
                xdg-open "${filename}.html" &
            elif command -v open &> /dev/null; then
                open "${filename}.html" &
            fi
        else
            echo "❌ Arquivo não encontrado"
        fi
    fi
    echo ""
}

start_server() {
    echo ""
    echo "🔧 Iniciando servidor local..."
    echo ""
    if command -v python3 &> /dev/null; then
        echo "✅ Servidor iniciado!"
        echo "🌐 Acesse: ${GREEN}http://localhost:8000${NC}"
        echo ""
        echo "Pressione Ctrl+C para parar o servidor"
        echo ""
        python3 -m http.server 8000 2>/dev/null
    elif command -v python &> /dev/null; then
        echo "✅ Servidor iniciado!"
        echo "🌐 Acesse: ${GREEN}http://localhost:8000${NC}"
        echo ""
        echo "Pressione Ctrl+C para parar o servidor"
        echo ""
        python -m http.server 8000 2>/dev/null
    else
        echo "❌ Python não encontrado"
        echo "⚠️  Instale Python ou use um servidor diferente"
    fi
    echo ""
}

check_files() {
    echo ""
    echo "📁 VERIFICANDO ARQUIVOS..."
    echo ""
    
    files=(
        "index.html"
        "styles.css"
        "quiz.js"
        "questions.json"
        "README.md"
    )
    
    missing=0
    found=0
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            size=$(ls -lh "$file" | awk '{print $5}')
            echo "  ${GREEN}✓${NC} $file ($size)"
            ((found++))
        else
            echo "  ${YELLOW}✗${NC} $file (FALTANDO)"
            ((missing++))
        fi
    done
    
    echo ""
    echo "📊 Resumo: ${GREEN}$found encontrados${NC}"
    
    if [ $missing -gt 0 ]; then
        echo "⚠️  ${YELLOW}$missing arquivo(s) faltando${NC}"
    else
        echo "${GREEN}✅ Todos os arquivos necessários estão presentes!${NC}"
    fi
    echo ""
}

show_info() {
    echo ""
    echo "ℹ️  INFORMAÇÕES DO PROJETO"
    echo ""
    echo "Nome: Sistema de Quiz com Progresso e Feedback Dinâmico"
    echo "Versão: 1.0.0"
    echo "Data: Dezembro 2025"
    echo "Status: ✅ Completo e Funcional"
    echo ""
    echo "Tecnologias:"
    echo "  • HTML5"
    echo "  • CSS3"
    echo "  • JavaScript ES6+"
    echo "  • JSON"
    echo ""
    echo "Funcionalidades:"
    echo "  ✅ Perguntas dinâmicas (JSON)"
    echo "  ✅ Barra de progresso visual"
    echo "  ✅ Feedback imediato (correto/incorreto)"
    echo "  ✅ Cálculo de pontuação automático"
    echo "  ✅ Mensagens personalizadas por desempenho"
    echo "  ✅ Revisão completa de respostas"
    echo "  ✅ Cronômetro"
    echo "  ✅ Responsivo (mobile/tablet/desktop)"
    echo "  ✅ Segurança contra XSS"
    echo "  ✅ Reinício de quiz"
    echo ""
    echo "Arquivos principais:"
    echo "  • index.html (3 KB) - Página principal"
    echo "  • styles.css (15 KB) - Estilos e responsividade"
    echo "  • quiz.js (11 KB) - Lógica JavaScript"
    echo "  • questions.json (3.6 KB) - 10 perguntas"
    echo ""
    echo "Documentação:"
    echo "  • README.md - Guia de uso geral"
    echo "  • GUIDE.md - Guia completo com FAQ"
    echo "  • TECHNICAL.md - Documentação técnica"
    echo "  • CUSTOMIZATION.md - Como customizar"
    echo "  • DEPLOY.md - Como fazer deploy"
    echo "  • TESTING.md - Testes"
    echo ""
    echo "Tamanho total: ~164 KB"
    echo "Compatibilidade: Chrome, Firefox, Safari, Edge"
    echo ""
}

open_compact() {
    echo ""
    echo "📱 Abrindo Quiz Compacto (versão mobile)..."
    echo ""
    if command -v xdg-open &> /dev/null; then
        xdg-open index-compact.html &
    elif command -v open &> /dev/null; then
        open index-compact.html &
    else
        echo "❌ Não foi possível abrir automaticamente."
        echo "📝 Abra manualmente: $(pwd)/index-compact.html"
    fi
    echo ""
}

show_examples() {
    echo ""
    echo "📚 EXEMPLOS DE PERGUNTAS DISPONÍVEIS:"
    echo ""
    echo "  1. questions.json (Padrão)"
    echo "     → 10 perguntas sobre JavaScript"
    echo ""
    echo "  2. questions-extended.json"
    echo "     → 30 perguntas em 3 categorias:"
    echo "       • JavaScript Avançado"
    echo "       • HTML e Semântica Web"
    echo "       • CSS3 Avançado"
    echo ""
    echo "  3. questions-examples.json"
    echo "     → 6 quizzes diferentes:"
    echo "       • História do Brasil"
    echo "       • Ciência - Biologia"
    echo "       • Geografia"
    echo "       • Literatura Brasileira"
    echo "       • Matemática Básica"
    echo "       • Inglês Básico"
    echo ""
    echo "💡 Dica: Para usar um arquivo diferente, edite a função"
    echo "   'initQuiz()' em quiz.js e mude o arquivo JSON."
    echo ""
}

# Loop principal
while true; do
    show_menu
    
    case $choice in
        1)
            open_quiz
            ;;
        2)
            show_docs
            ;;
        3)
            start_server
            break
            ;;
        4)
            check_files
            ;;
        5)
            show_info
            ;;
        6)
            open_compact
            ;;
        7)
            show_examples
            ;;
        8)
            echo ""
            echo "👋 Até logo! Divirta-se com o quiz! 🎉"
            echo ""
            exit 0
            ;;
        *)
            echo ""
            echo "❌ Opção inválida! Tente novamente."
            echo ""
            ;;
    esac
done
