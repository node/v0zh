import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Eye, Heart, Share2, Bookmark, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getArticleById, getAllArticles } from "@/lib/generated"
import ReactMarkdown from "react-markdown"

export const runtime = "edge"

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = getArticleById(id)

  if (!article) {
    notFound()
  }

  const allArticles = getAllArticles()
  const relatedArticles = allArticles.filter((a) => a.id !== id && a.category === article.category).slice(0, 2)

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <div className="border-b border-border bg-background px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回文章列表
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <article className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-2">
            <Badge variant="secondary">{article.category}</Badge>
            <span className="text-sm text-muted-foreground">{article.publishedAt}</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-6 text-pretty text-xl text-muted-foreground">{article.description}</p>

          {/* Author Info */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.authorAvatar || "/placeholder.svg"} alt={article.author} />
                <AvatarFallback>{article.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-foreground">{article.author}</div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </div>
                  {article.views !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Article Content */}
          <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-li:text-foreground">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Engagement Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" />
                点赞 {article.likes !== undefined && `(${article.likes})`}
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                分享
              </Button>
            </div>
            {article.views !== undefined && <div className="text-sm text-muted-foreground">{article.views} 次阅读</div>}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-muted/50 px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground">相关文章</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/articles/${relatedArticle.id}`}>
                  <Card className="h-full border-border transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-2">
                        {relatedArticle.category}
                      </Badge>
                      <h3 className="line-clamp-2 font-semibold text-foreground">{relatedArticle.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{relatedArticle.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
