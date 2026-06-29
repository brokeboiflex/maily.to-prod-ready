import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "shadcn-theme-provider"

import "./index.css"
import App from "./App.tsx"

const themes = {
  default: "/themes/default.css",
  corporate: "/themes/corporate.css",
  marshmallow: "/themes/marshmallow.css",
  "neo-brutalism": "/themes/neo-brutalism.css",
  paper: "/themes/paper.css",
  shadcn: "/themes/shadcn.css",
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      themes={themes}
      defaultMode="system"
      defaultPalette="default"
    >
      <App />
    </ThemeProvider>
  </StrictMode>
)
