export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image_url?: string
  author_name: string
  category?: string
  tags?: string[]
  status: 'draft' | 'published' | 'scheduled'
  published_at?: string
  created_at: string
  updated_at: string
}
