import fs from "node:fs"
import path from "node:path"

const root = process.cwd()

const sourceDir = path.join(root, "packages/core/src")
const outDir = path.join(root, "registry/default/maily-core")
const registryPath = path.join(root, "registry.json")
const corePackagePath = path.join(root, "packages/core/package.json")

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
  ".json",
  ".md",
])

function toPosix(value) {
  return value.split(path.sep).join("/")
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return walk(fullPath)
    }

    return [fullPath]
  })
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function rewriteAliasImports(filePath, content) {
  const ext = path.extname(filePath)

  if (![".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
    return content
  }

  return content.replace(/(["'])@\/([^"']+)\1/g, (match, quote, aliasTarget) => {
    const absoluteTarget = path.join(outDir, aliasTarget)
    let relativeTarget = toPosix(path.relative(path.dirname(filePath), absoluteTarget))

    if (!relativeTarget.startsWith(".")) {
      relativeTarget = `./${relativeTarget}`
    }

    return `${quote}${relativeTarget}${quote}`
  })
}

function copyCoreSource() {
  fs.rmSync(outDir, { recursive: true, force: true })
  ensureDir(outDir)

  const sourceFiles = walk(sourceDir)

  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(sourceDir, sourceFile)
    const targetFile = path.join(outDir, relativePath)
    const ext = path.extname(sourceFile)

    ensureDir(path.dirname(targetFile))

    if (textExtensions.has(ext)) {
      const source = fs.readFileSync(sourceFile, "utf8")
      const rewritten = rewriteAliasImports(targetFile, source)
      fs.writeFileSync(targetFile, rewritten)
    } else {
      fs.copyFileSync(sourceFile, targetFile)
    }
  }
}

function dependencyList(deps = {}) {
  return Object.entries(deps).map(([name, version]) => `${name}@${version}`)
}

function buildRegistryJson() {
  const corePackage = JSON.parse(fs.readFileSync(corePackagePath, "utf8"))

  const files = walk(outDir).map((file) => {
    const relativeToRoot = toPosix(path.relative(root, file))
    const relativeToItem = toPosix(path.relative(outDir, file))

    return {
      path: relativeToRoot,
      type: "registry:file",
      target: `@components/maily/${relativeToItem}`,
    }
  })

  const requiredCssDevDeps = [
    "@tailwindcss/typography",
    "tailwind-scrollbar",
    "tw-animate-css",
  ]

  const devDependencies = Object.fromEntries(
    Object.entries(corePackage.devDependencies ?? {}).filter(([name]) =>
      requiredCssDevDeps.includes(name)
    )
  )

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "maily-prod-ready",
    homepage: "https://github.com/brokeboiflex/maily.to-prod-ready",
    items: [
      {
        name: "maily-core",
        type: "registry:block",
        title: "Maily Core",
        description:
          "A local, shadcn-installable copy of Maily Core for building email editors.",
        dependencies: dependencyList(corePackage.dependencies),
        devDependencies: dependencyList(devDependencies),
        files,
        docs: [
          "Import the editor from your configured components path, for example:",
          "",
          "import { Editor } from '@/components/maily'",
          "import '@/components/maily/styles/index.css'",
          "",
          "If your project does not use the @ alias, use the import alias configured in components.json.",
        ].join("\n"),
      },
    ],
  }

  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)
}

copyCoreSource()
buildRegistryJson()

console.log("Generated registry/default/maily-core and registry.json")