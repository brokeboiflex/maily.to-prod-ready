import fs from "node:fs"
import path from "node:path"

const root = process.cwd()

const registryRoot = path.join(root, "registry/default")
const itemRoot = path.join(registryRoot, "maily")
const registryPath = path.join(root, "registry.json")

const coreSourceDir = path.join(root, "packages/core/src")
const renderSourceDir = path.join(root, "packages/render/src")
const sharedSourceDir = path.join(root, "packages/shared/src")

const coreOutDir = path.join(itemRoot, "components/maily")
const renderOutDir = path.join(itemRoot, "lib/maily-render")
const sharedOutDir = path.join(renderOutDir, "shared")

const corePackagePath = path.join(root, "packages/core/package.json")
const renderPackagePath = path.join(root, "packages/render/package.json")
const sharedPackagePath = path.join(root, "packages/shared/package.json")

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

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function makeRelativeImport(fromFile, toPath) {
  let relativePath = toPosix(path.relative(path.dirname(fromFile), toPath))

  if (!relativePath.startsWith(".")) {
    relativePath = `./${relativePath}`
  }

  return relativePath
}

function rewriteCoreImports(filePath, content) {
  const ext = path.extname(filePath)

  if (![".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
    return content
  }

  return content.replace(/(["'])@\/([^"']+)\1/g, (_match, quote, aliasTarget) => {
    const absoluteTarget = path.join(coreOutDir, aliasTarget)
    const relativeTarget = makeRelativeImport(filePath, absoluteTarget)

    return `${quote}${relativeTarget}${quote}`
  })
}

function rewriteRenderImports(filePath, content) {
  const ext = path.extname(filePath)

  if (![".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
    return content
  }

  return content.replace(
    /(["'])@maily-to\/shared(?:\/([^"']+))?\1/g,
    (_match, quote, subPath = "") => {
      const absoluteTarget = path.join(sharedOutDir, subPath)
      const relativeTarget = makeRelativeImport(filePath, absoluteTarget)

      return `${quote}${relativeTarget}${quote}`
    }
  )
}

function copySource(sourceDir, outDir, rewrite) {
  const sourceFiles = walk(sourceDir)

  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(sourceDir, sourceFile)
    const targetFile = path.join(outDir, relativePath)
    const ext = path.extname(sourceFile)

    ensureDir(path.dirname(targetFile))

    if (textExtensions.has(ext)) {
      const source = fs.readFileSync(sourceFile, "utf8")
      fs.writeFileSync(targetFile, rewrite(targetFile, source))
    } else {
      fs.copyFileSync(sourceFile, targetFile)
    }
  }
}

function addDeps(map, deps = {}) {
  for (const [name, version] of Object.entries(deps)) {
    if (name.startsWith("@maily-to/")) continue
    if (name === "tsconfig") continue
    if (name === "typescript") continue
    if (name.startsWith("@types/")) continue

    map.set(name, version)
  }
}

function dependencyList(map) {
  return [...map.entries()].map(([name, version]) => `${name}@${version}`)
}

function registryFiles() {
  const files = []

  for (const file of walk(coreOutDir)) {
    const relativeToRoot = toPosix(path.relative(root, file))
    const relativeToCore = toPosix(path.relative(coreOutDir, file))

    files.push({
      path: relativeToRoot,
      type: "registry:file",
      target: `@components/maily/${relativeToCore}`,
    })
  }

  for (const file of walk(renderOutDir)) {
    const relativeToRoot = toPosix(path.relative(root, file))
    const relativeToRender = toPosix(path.relative(renderOutDir, file))

    files.push({
      path: relativeToRoot,
      type: "registry:file",
      target: `@lib/maily-render/${relativeToRender}`,
    })
  }

  return files
}

function buildRegistryJson() {
  const corePackage = readJson(corePackagePath)
  const renderPackage = readJson(renderPackagePath)
  const sharedPackage = readJson(sharedPackagePath)

  const dependencies = new Map()
  const devDependencies = new Map()

  addDeps(dependencies, corePackage.dependencies)
  addDeps(dependencies, renderPackage.dependencies)
  addDeps(dependencies, sharedPackage.dependencies)

  // packages/render/src imports this at runtime even though the package lists it as devDependency.
  if (renderPackage.devDependencies?.["@antfu/utils"]) {
    dependencies.set("@antfu/utils", renderPackage.devDependencies["@antfu/utils"])
  }

  const cssBuildDeps = [
    "@tailwindcss/typography",
    "tailwind-scrollbar",
    "tw-animate-css",
  ]

  for (const name of cssBuildDeps) {
    const version = corePackage.devDependencies?.[name]
    if (version) {
      devDependencies.set(name, version)
    }
  }

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "maily-prod-ready",
    homepage: "https://github.com/brokeboiflex/maily.to-prod-ready",
    items: [
      {
        name: "maily",
        type: "registry:block",
        title: "Maily",
        description:
          "A local, shadcn-installable Maily email editor with HTML email rendering.",
        dependencies: dependencyList(dependencies),
        devDependencies: dependencyList(devDependencies),
        files: registryFiles(),
        docs: [
          "Editor usage:",
          "",
          "import { Editor } from '@/components/maily'",
          "import '@/components/maily/styles/index.css'",
          "",
          "Renderer usage:",
          "",
          "import { render } from '@/lib/maily-render'",
          "",
          "const html = await render(editorJson)",
        ].join("\n"),
      },
    ],
  }

  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)
}

fs.rmSync(registryRoot, { recursive: true, force: true })
ensureDir(itemRoot)

copySource(coreSourceDir, coreOutDir, rewriteCoreImports)
copySource(sharedSourceDir, sharedOutDir, (_filePath, content) => content)
copySource(renderSourceDir, renderOutDir, rewriteRenderImports)

buildRegistryJson()

console.log("Generated registry/default/maily and registry.json")