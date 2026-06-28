import { useState } from "react"
import type { Editor as TiptapEditor } from "@tiptap/core"

import { Editor } from "@/components/maily"

export function App() {
  const [json, setJson] = useState<unknown>(null)

  return (
    <div className="min-h-svh bg-muted/30 p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <header>
          <h1 className="text-lg font-medium">Maily playground</h1>
          <p className="text-sm text-muted-foreground">
            Installed via{" "}
            <code className="font-mono text-xs">shadcn add @maily/maily</code>{" "}
            from the local registry.
          </p>
        </header>

        <Editor
          contentJson={{ type: "doc", content: [{ type: "paragraph" }] }}
          onUpdate={(editor: TiptapEditor) => setJson(editor.getJSON())}
        />

        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">
            Editor JSON
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-background p-3">
            {JSON.stringify(json, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}

export default App
