# Landing Page MESTTI

Landing page recriada exatamente conforme o site mestti.com.br

## 📐 Estrutura da Página (5 Dobras)

1. **Hero Section** - Header azul escuro, título sobre apontamento inteligente, botões e hardware
2. **Funcionalidades com Depoimentos** - Carrossel com 4 cards (Monitoramento, Apontamento, Auditoria, Controle)
3. **Personas** - 3 cards com fotos profissionais (Gerente, Supervisor, Analista)
4. **Features Grid** - Grid 3x2 com 6 funcionalidades principais
5. **CTA Final** - Formulário escuro à esquerda, dashboard à direita

## 🖼️ Imagens Necessárias

Adicione as seguintes imagens na pasta `images/`:

### Hero Section
- **hardware-mestti.jpg** - Foto do dispositivo MESTTI (dispositivo cinza com logo, LEDs verdes, cabos)

### Funcionalidades com Depoimentos
- **monitoramento.jpg** - Profissionais em escritório olhando dashboard na parede
- **apontamento.jpg** - Operador em fábrica usando tablet e painel touchscreen
- **auditoria.jpg** - Screenshot de interface com tabela e checkmarks
- **controle.jpg** - Screenshot de dashboard com módulos e percentuais

### Personas
- **gerente-industrial.jpg** - Homem com capacete e colete laranja apontando para telas
- **supervisor-producao.jpg** - Homem com colete azul/cinza segurando tablet em frente a máquina
- **analista-melhoria.jpg** - Mulher com colete azul sentada em escritório olhando monitor

### CTA Final
- **dashboard-preview.jpg** - Screenshot completo do dashboard MESTTI (interface branca com gráficos, tabelas, métricas)

## 🎨 Cores Utilizadas

- **Azul Escuro (Header)**: `#1a365d`
- **Azul Primário**: `#0066cc`
- **Fundo Escuro (CTA)**: `#0f172a`
- **Verde (Botão Submit)**: `#10b981`
- **Branco**: `#ffffff`
- **Cinzas**: Variações de `#fafafa` a `#171717`

## ✨ Funcionalidades

- ✅ Header fixo azul escuro
- ✅ Hero section com layout 2 colunas
- ✅ Carrossel de depoimentos com navegação
- ✅ Grid de personas responsivo
- ✅ Features grid 3x2
- ✅ Formulário completo com selects
- ✅ Dashboard preview ao lado do formulário
- ✅ Totalmente responsivo
- ✅ Animações suaves

## 🚀 Como rodar o repositório

O site usa rotas como `/contato/` e `/atuacao/`; por isso é preciso servir a pasta por **HTTP** (abrir o `index.html` direto no disco com `file://` quebra essas páginas).

### Com Node.js (recomendado)

1. Instale dependências (uma vez):

   ```bash
   npm install
   ```

2. Sobe o servidor de desenvolvimento com **live-server**:

   ```bash
   npm run dev
   ```

3. O navegador abre em **`http://127.0.0.1:5500/`** (porta e script estão em `package.json`).

**URLs principais:**

| Caminho | Conteúdo |
|--------|----------|
| `/` ou `/index.html` | Home |
| `/contato/` | Contato |
| `/atuacao/` | Catálogo de sensores |
| `/empresa/` | Sobre a empresa |

### Sem instalar dependências (alternativa)

Na pasta do projeto, com Python 3:

```bash
python -m http.server 8080
```

Acesse **`http://127.0.0.1:8080/`**. (A porta pode ser outra; use sempre a URL completa com barra final em `/contato/` e `/atuacao/` quando o servidor pedir.)

Outra opção, sem `package.json`:

```bash
npx --yes live-server --port=8080 --host=127.0.0.1
```

### Imagens e assets

Adicione as imagens listadas na seção **Imagens Necessárias** na pasta `images/` antes de revisar o layout completo.

## 📝 Personalização

### Textos
Todos os textos podem ser editados diretamente no `index.html`.

### Formulário
O formulário atualmente mostra feedback visual. Para integrar com backend, modifique a função de submit em `script.js`.

### Cores
Edite as variáveis CSS no início de `styles.css`:

```css
:root {
    --primary-dark: #1a365d;
    --primary-blue: #0066cc;
    --dark-bg: #0f172a;
    /* Ajuste conforme necessário */
}
```

## 📱 Responsividade

- **Desktop**: Layout completo conforme imagens
- **Tablet**: Grids adaptam para 2 colunas
- **Mobile**: Layout em coluna única, menu hamburger

## 🔧 Tecnologias

- HTML5 semântico
- CSS3 (Grid, Flexbox, Variáveis)
- JavaScript vanilla (sem dependências)
- Google Fonts (Inter)
