# Caderno Nutricional

App de cálculo nutricional baseado em referências TACO/TBCA, com medidas caseiras,
divisão por refeições e exportação de relatório para PDF.

## Como colocar no GitHub Pages

1. **Crie um repositório novo no GitHub** (pode ser público ou privado, mas o GitHub
   Pages gratuito exige repositório público, a menos que você tenha GitHub Pro/Team).

2. **Ajuste o `vite.config.js`**: troque `NOME-DO-REPOSITORIO` pelo nome exato do
   repositório que você criou. Exemplo: se a URL do repo for
   `github.com/seu-usuario/plano-alimentar`, o valor deve ser `"/plano-alimentar/"`.

3. **Suba os arquivos para o repositório**, pela interface do GitHub (arrastar e
   soltar os arquivos) ou por linha de comando:
   ```bash
   git init
   git add .
   git commit -m "primeira versão"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   git push -u origin main
   ```

4. **Ative o GitHub Pages via GitHub Actions**:
   - No repositório, vá em **Settings → Pages**
   - Em "Build and deployment" → "Source", escolha **GitHub Actions**
   - Isso é tudo — o workflow em `.github/workflows/deploy.yml` já está pronto
     e roda automaticamente a cada `git push` na branch `main`

5. **Aguarde o deploy**: na aba **Actions** do repositório, acompanhe o workflow
   "Deploy to GitHub Pages" rodando. Quando terminar (ícone verde ✓), o link do site
   aparece em Settings → Pages, algo como:
   ```
   https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
   ```

## Rodar localmente antes de subir (opcional, requer Node.js instalado)

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Estrutura

- `src/App.jsx` — o app inteiro (catálogo de alimentos, refeições, rótulo
  nutricional, geração do relatório para PDF)
- `src/main.jsx` — ponto de entrada que monta o app na página
- `vite.config.js` — configuração do build (⚠️ contém o caminho do GitHub Pages,
  precisa ser ajustado antes do primeiro deploy)
- `.github/workflows/deploy.yml` — automação que publica o site a cada push
