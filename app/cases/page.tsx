import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Heart, ExternalLink, Github, Upload } from "lucide-react"
import { getAllCases, getCaseCategories } from "@/lib/generated"

export const runtime = "edge"

export default function CasesPage() {
  const cases = getAllCases()
  const caseCategories = getCaseCategories()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">案例展示</h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              探索使用 v0.app 构建的真实项目案例，获取灵感和学习经验
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索案例..." className="pl-10" />
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6 text-center">
            <Button asChild>
              <Link href="/join#contribute">
                <Upload className="mr-2 h-4 w-4" />
                提交你的案例
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border bg-background px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2">
            {caseCategories.map((category) => (
              <Button key={category} variant={category === "全部" ? "default" : "outline"} size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {cases.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">暂无案例，欢迎提交第一个案例！</p>
              <Button asChild className="mt-4">
                <Link href="/join#contribute">了解如何贡献</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((caseStudy) => (
                  <Card
                    key={caseStudy.id}
                    className="group overflow-hidden border-border transition-shadow hover:shadow-lg"
                  >
                    <Link href={`/cases/${caseStudy.id}`}>
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <Image
                          src={caseStudy.thumbnail || "/placeholder.svg"}
                          alt={caseStudy.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute right-2 top-2">
                          <Badge variant="secondary">{caseStudy.difficulty}</Badge>
                        </div>
                      </div>
                    </Link>
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline">{caseStudy.category}</Badge>
                        <span className="text-xs text-muted-foreground">{caseStudy.publishedAt}</span>
                      </div>
                      <Link href={`/cases/${caseStudy.id}`}>
                        <CardTitle className="line-clamp-2 text-xl transition-colors hover:text-primary">
                          {caseStudy.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="line-clamp-2 text-muted-foreground">
                        {caseStudy.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={caseStudy.authorAvatar || "/placeholder.svg"} alt={caseStudy.author} />
                            <AvatarFallback>{caseStudy.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{caseStudy.author}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
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

                      <div className="mt-4 flex flex-wrap gap-2">
                        {caseStudy.techStack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {caseStudy.techStack.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{caseStudy.techStack.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        {caseStudy.demoUrl && (
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <Link href={caseStudy.demoUrl} target="_blank">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              演示
                            </Link>
                          </Button>
                        )}
                        {caseStudy.githubUrl && (
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <Link href={caseStudy.githubUrl} target="_blank">
                              <Github className="mr-1 h-3 w-3" />
                              代码
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More - Hidden for now as we show all cases */}
              {cases.length > 9 && (
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg">
                    加载更多案例
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
