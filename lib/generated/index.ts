// Auto-generated content index
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
