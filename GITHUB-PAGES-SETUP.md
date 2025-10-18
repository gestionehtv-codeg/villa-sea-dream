# 🚀 Configurazione GitHub Pages

## ⚠️ IMPORTANTE: Configurazione Base Path

Per pubblicare correttamente su GitHub Pages, devi configurare il **base path** in base al tipo di repository:

### Opzione 1: Repository Utente/Organizzazione (CONSIGLIATO)
Se il tuo repository si chiama `username.github.io`:
- ✅ Il sito è già configurato correttamente
- URL finale: `https://username.github.io/`
- Non servono modifiche

### Opzione 2: Repository di Progetto
Se il repository ha un nome diverso (es. `villa-mare`):

1. **Apri `vite.config.ts`**
2. **Modifica la riga 8** da:
   ```typescript
   base: "/",
   ```
   a:
   ```typescript
   base: "/nome-del-tuo-repository/",
   ```
   Esempio: se il repo si chiama `villa-mare`:
   ```typescript
   base: "/villa-mare/",
   ```

3. **Salva e fai push**

## 📝 Passi per Deploy su GitHub Pages

1. **Assicurati che il codice sia su GitHub**
   ```bash
   git add .
   git commit -m "Deploy configuration"
   git push
   ```

2. **Vai nelle Settings del Repository**
   - Apri il tuo repository su GitHub
   - Vai in `Settings` > `Pages`

3. **Configura GitHub Pages**
   - **Source**: Seleziona `GitHub Actions`
   
4. **Crea GitHub Action**
   - Crea il file `.github/workflows/deploy.yml` con il contenuto qui sotto

5. **Fai Push e Attendi**
   - Il deploy parte automaticamente
   - Controlla il tab `Actions` per vedere il progresso
   - Il sito sarà disponibile in 2-3 minuti

## 📄 File GitHub Action

Crea il file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔍 Risoluzione Problemi

### Pagina Bianca / Errore 404
1. ✅ Verifica che il `base` in `vite.config.ts` sia corretto
2. ✅ Controlla che la GitHub Action sia completata con successo
3. ✅ Assicurati che `HashRouter` sia usato (già configurato)
4. ✅ Verifica che i file `.nojekyll` e `404.html` siano in `/public`

### Gli Stili non Caricano
- Verifica il base path in `vite.config.ts`
- Controlla la console del browser per errori 404

### Il Routing non Funziona
- Già risolto con `HashRouter` e `404.html`
- Le URL saranno tipo: `https://tuosito.github.io/#/gallery`

## 🎉 Tutto Fatto!

Una volta completato, il sito sarà disponibile a:
- `https://username.github.io/` (repo utente)
- `https://username.github.io/nome-repo/` (repo progetto)

## 🔐 Backend e Database

Il sito usa Lovable Cloud (Supabase) per:
- ✅ Autenticazione admin
- ✅ Database prenotazioni
- ✅ Calendario disponibilità

Le variabili d'ambiente sono già configurate in `.env` (non commitare questo file su GitHub pubblico se vuoi mantenere le chiavi private).

Per produzione, configura i segreti in:
`Settings` > `Secrets and variables` > `Actions` > `New repository secret`
