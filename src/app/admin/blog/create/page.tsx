'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    featured_image_alt: '',
    author_name: '',
    author_avatar_url: '',
    category: '',
    tags: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    read_time_minutes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from title
    if (name === 'title' && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({
        ...prev,
        slug: autoSlug
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const postData: any = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        read_time_minutes: formData.read_time_minutes ? parseInt(formData.read_time_minutes) : null,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        view_count: 0,
      }

      const response = await fetch('/api/admin/blog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (data.success) {
        alert('Post created successfully!')
        router.push('/admin/blog')
      } else {
        alert('Failed to create post: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Write New Post</h1>
          <p className="text-gray-600 mt-1">Create a new blog post</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Post Content</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="post-url-slug"
              />
              <p className="text-xs text-gray-500 mt-1">URL: /blog/{formData.slug || 'post-slug'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Brief summary of the post..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                placeholder="Write your post content here... (Supports Markdown)"
              />
              <p className="text-xs text-gray-500 mt-1">Tip: You can use Markdown formatting</p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Featured Image</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="featured_image_url"
                value={formData.featured_image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                name="featured_image_alt"
                value={formData.featured_image_alt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe the image for accessibility"
              />
            </div>

            {formData.featured_image_url && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img 
                  src={formData.featured_image_url} 
                  alt="Preview" 
                  className="max-w-md rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Author Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Avatar URL
                </label>
                <input
                  type="url"
                  name="author_avatar_url"
                  value={formData.author_avatar_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Organization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Remote Work, Career Tips, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="remote, work-from-home, productivity (comma-separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Read Time (minutes)
                </label>
                <input
                  type="number"
                  name="read_time_minutes"
                  value={formData.read_time_minutes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">SEO Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="SEO title (60 characters max)"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.meta_title.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                maxLength={160}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="SEO description (160 characters max)"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus Keyword
              </label>
              <input
                type="text"
                name="focus_keyword"
                value={formData.focus_keyword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="remote jobs"
              />
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Publish Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/blog">Cancel</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}