import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, Heart, Share2, Bookmark, ArrowLeft, ExternalLink, Github } from "lucide-react"
import { getCaseById, getAllCases } from "@/lib/generated"
import ReactMarkdown from "react-markdown"

export const runtime = "edge"

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const caseStudy = getCaseById(id)

  if (!caseStudy) {
    notFound()
  }

  const allCases = getAllCases()
  const relatedCases = allCases.filter((c) => c.id !== id && c.category === caseStudy.category).slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <div className="border-b border-border bg-background px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回案例列表
            </Link>
          </Button>
        </div>
      </div>

      {/* Case Header */}
      <article className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <Badge variant="secondary">{caseStudy.category}</Badge>
            <Badge variant="outline">{caseStudy.difficulty}</Badge>
            <span className="text-sm text-muted-foreground">{caseStudy.publishedAt}</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {caseStudy.title}
          </h1>

          <p className="mt-6 text-pretty text-xl text-muted-foreground">{caseStudy.description}</p>

          {/* Author Info and Actions */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={caseStudy.authorAvatar || "/placeholder.svg"} alt={caseStudy.author} />
                <AvatarFallback>{caseStudy.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-foreground">{caseStudy.author}</div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {caseStudy.views !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {caseStudy.views}
                    </div>
                  )}
                  {caseStudy.likes !== undefined && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {caseStudy.likes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {caseStudy.demoUrl && (
                <Button asChild>
                  <Link href={caseStudy.demoUrl} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    查看演示
                  </Link>
                </Button>
              )}
              {caseStudy.githubUrl && (
                <Button variant="outline" asChild>
                  <Link href={caseStudy.githubUrl} target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    源代码
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="relative mt-8 aspect-video overflow-hidden rounded-lg border border-border">
            <Image
              src={caseStudy.thumbnail || "/placeholder.svg"}
              alt={caseStudy.title}
              fill
              className="object-cover"
            />
          </div>

          <Separator className="my-8" />

          {/* Tech Stack */}
          <div>
            <h2 className="text-xl font-semibold text-foreground">技术栈</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {caseStudy.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Case Content */}
          <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-li:text-foreground">
            <ReactMarkdown>{caseStudy.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {caseStudy.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Engagement Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" />
                点赞 {caseStudy.likes !== undefined && `(${caseStudy.likes})`}
              </Button>
              <Button variant="outline">
                <Bookmark className="mr-2 h-4 w-4" />
                收藏
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                分享
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Cases */}
      {relatedCases.length > 0 && (
        <section className="bg-muted/50 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-foreground">相关案例</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCases.map((relatedCase) => (
                <Link key={relatedCase.id} href={`/cases/${relatedCase.id}`}>
                  <Card className="h-full overflow-hidden border-border transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={relatedCase.thumbnail || "/placeholder.svg"}
                        alt={relatedCase.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {relatedCase.category}
                      </Badge>
                      <h3 className="line-clamp-2 font-semibold text-foreground">{relatedCase.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{relatedCase.description}</p>
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
