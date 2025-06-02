"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Save, Home } from "lucide-react"

export default function HomepageManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState({
    hero_title: "",
    hero_subtitle: "",
    mission: "",
    vision: "",
    impact_stat_1: "",
    impact_stat_2: "",
    impact_stat_3: "",
    impact_stat_4: "",
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from("homepage_content").select("*")

      if (error) throw error

      const contentMap: any = {}
      data?.forEach((item) => {
        contentMap[item.section] = item.content || item.title
      })

      setContent({
        hero_title: contentMap.hero || "Empowering Families, Transforming Lives",
        hero_subtitle: contentMap.hero_subtitle || "CKSI is dedicated to improving lives...",
        mission: contentMap.mission || "To empower families and children...",
        vision: contentMap.vision || "A Nigeria where every family...",
        impact_stat_1: contentMap.impact_stat_1 || "5000+",
        impact_stat_2: contentMap.impact_stat_2 || "2500+",
        impact_stat_3: contentMap.impact_stat_3 || "150+",
        impact_stat_4: contentMap.impact_stat_4 || "98%",
      })
    } catch (error) {
      console.error("Error fetching content:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Update or insert homepage content
      const updates = [
        { section: "hero", title: "Hero Title", content: content.hero_title },
        { section: "hero_subtitle", title: "Hero Subtitle", content: content.hero_subtitle },
        { section: "mission", title: "Our Mission", content: content.mission },
        { section: "vision", title: "Our Vision", content: content.vision },
        { section: "impact_stat_1", title: "Children Educated", content: content.impact_stat_1 },
        { section: "impact_stat_2", title: "Families Supported", content: content.impact_stat_2 },
        { section: "impact_stat_3", title: "Communities Reached", content: content.impact_stat_3 },
        { section: "impact_stat_4", title: "Success Rate", content: content.impact_stat_4 },
      ]

      for (const update of updates) {
        await supabase.from("homepage_content").upsert(update, { onConflict: "section" })
      }

      alert("Homepage content updated successfully!")
    } catch (error) {
      console.error("Error updating content:", error)
      alert("Failed to update content")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home className="h-6 w-6" />
          Homepage Content Management
        </h1>
        <p className="text-muted-foreground">Update the content displayed on your homepage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={content.hero_title}
                onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                placeholder="Main headline"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Textarea
                id="hero_subtitle"
                value={content.hero_subtitle}
                onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                placeholder="Supporting text"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <Card>
          <CardHeader>
            <CardTitle>Mission & Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea
                id="mission"
                value={content.mission}
                onChange={(e) => setContent({ ...content, mission: e.target.value })}
                placeholder="Organization mission"
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="vision">Vision Statement</Label>
              <Textarea
                id="vision"
                value={content.vision}
                onChange={(e) => setContent({ ...content, vision: e.target.value })}
                placeholder="Organization vision"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Impact Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Impact Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="impact_stat_1">Children Educated</Label>
                <Input
                  id="impact_stat_1"
                  value={content.impact_stat_1}
                  onChange={(e) => setContent({ ...content, impact_stat_1: e.target.value })}
                  placeholder="5000+"
                />
              </div>
              <div>
                <Label htmlFor="impact_stat_2">Families Supported</Label>
                <Input
                  id="impact_stat_2"
                  value={content.impact_stat_2}
                  onChange={(e) => setContent({ ...content, impact_stat_2: e.target.value })}
                  placeholder="2500+"
                />
              </div>
              <div>
                <Label htmlFor="impact_stat_3">Communities Reached</Label>
                <Input
                  id="impact_stat_3"
                  value={content.impact_stat_3}
                  onChange={(e) => setContent({ ...content, impact_stat_3: e.target.value })}
                  placeholder="150+"
                />
              </div>
              <div>
                <Label htmlFor="impact_stat_4">Success Rate</Label>
                <Input
                  id="impact_stat_4"
                  value={content.impact_stat_4}
                  onChange={(e) => setContent({ ...content, impact_stat_4: e.target.value })}
                  placeholder="98%"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
