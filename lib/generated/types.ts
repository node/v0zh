// Content types for Edge Runtime compatibility

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
