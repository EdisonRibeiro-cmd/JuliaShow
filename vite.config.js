import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANTE: troque "NOME-DO-REPOSITORIO" pelo nome exato do seu repositório no GitHub.
// Ex: se o repo é github.com/seu-usuario/plano-alimentar, use base: "/plano-alimentar/"
export default defineConfig({
  plugins: [react()],
  base: "/NOME-DO-REPOSITORIO/",
});
