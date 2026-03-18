import fs from "fs"
import path from "path"
import matter from "gray-matter"

const articlesDirectory = path.join(process.cwd(), "data/articles")
const casesDirectory = path.join(process.cwd(), "data/cases")
const outputDirectory = path.join(process.cwd(), "lib/generated")

interface ArticleMetadata {
  title: string
  description: string
  author: string
  authorAvatar?: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  views?: number
  likes?: number
}

interface Article extends ArticleMetadata {
  id: string
  content: string
}

interface CaseMetadata {
  title: string
  description: string
  thumbnail: string
  category: string
  tags: string[]
  author: string
  authorAvatar?: string
  publishedAt: string
  likes?: number
  views?: number
  demoUrl?: string
  githubUrl?: string
  difficulty: "初级" | "中级" | "高级"
  techStack: string[]
}

interface CaseStudy extends CaseMetadata {
  id: string
  content: string
}

function buildArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    console.log("No articles directory found")
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  const articles = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "")
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        id,
        content,
        ...(data as ArticleMetadata),
      }
    })
    .sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1))

  return articles
}

function buildCases(): CaseStudy[] {
  if (!fs.existsSync(casesDirectory)) {
    console.log("No cases directory found")
    return []
  }

  const fileNames = fs.readdirSync(casesDirectory)
  const cases = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "")
      const fullPath = path.join(casesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        id,
        content,
        ...(data as CaseMetadata),
      }
    })
    .sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1))

  return cases
}

function main() {
  console.log("Building content...")

  // Ensure output directory exists
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true })
  }

  // Build articles
  const articles = buildArticles()
  const articlesOutput = `// This file is auto-generated. Do not edit manually.
// Run 'npm run build:content' to regenerate.

import type { Article } from "./types"

export const articles: Article[] = ${JSON.stringify(articles, null, 2)}
`
  fs.writeFileSync(path.join(outputDirectory, "articles.ts"), articlesOutput)
  console.log(`Built ${articles.length} articles`)

  // Build cases
  const cases = buildCases()
  const casesOutput = `// This file is auto-generated. Do not edit manually.
// Run 'npm run build:content' to regenerate.

import type { CaseStudy } from "./types"

export const cases: CaseStudy[] = ${JSON.stringify(cases, null, 2)}
`
  fs.writeFileSync(path.join(outputDirectory, "cases.ts"), casesOutput)
  console.log(`Built ${cases.length} cases`)

  // Generate types file
  const typesOutput = `// Content types for Edge Runtime compatibility

export interface ArticleMetadata {
  title: string
  description: string
  author: string
  authorAvatar?: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  views?: number
  likes?: number
}

export interface Article extends ArticleMetadata {
  id: string
  content: string
}

export interface CaseMetadata {
  title: string
  description: string
  thumbnail: string
  category: string
  tags: string[]
  author: string
  authorAvatar?: string
  publishedAt: string
  likes?: number
  views?: number
  demoUrl?: string
  githubUrl?: string
  difficulty: "初级" | "中级" | "高级"
  techStack: string[]
}

export interface CaseStudy extends CaseMetadata {
  id: string
  content: string
}
`
  fs.writeFileSync(path.join(outputDirectory, "types.ts"), typesOutput)

  // Generate index file
  const indexOutput = `// Auto-generated content index
// This module is Edge Runtime compatible

export * from "./types"
export { articles } from "./articles"
export { cases } from "./cases"

import { articles } from "./articles"
import { cases } from "./cases"
import type { Article, CaseStudy } from "./types"

// Get all articles
export function getAllArticles(): Article[] {
  return articles
}

// Get article by ID
export function getArticleById(id: string): Article | null {
  return articles.find((article) => article.id === id) || null
}

// Get unique categories from articles
export function getArticleCategories(): string[] {
  const categories = new Set(articles.map((article) => article.category))
  return ["全部", ...Array.from(categories)]
}

// Get all cases
export function getAllCases(): CaseStudy[] {
  return cases
}

// Get case by ID
export function getCaseById(id: string): CaseStudy | null {
  return cases.find((caseStudy) => caseStudy.id === id) || null
}

// Get unique categories from cases
export function getCaseCategories(): string[] {
  const categories = new Set(cases.map((caseStudy) => caseStudy.category))
  return ["全部", ...Array.from(categories)]
}
`
  fs.writeFileSync(path.join(outputDirectory, "index.ts"), indexOutput)

  console.log("Content build complete!")
}

main()
