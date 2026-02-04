'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter()
  const [postId, setPostId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fetchingPost, setFetchingPost] = useState(true)
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

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params
      setPostId(resolvedParams.id)
      await fetchPost(resolvedParams.id)
    }
    init()
  }, [params])

  const fetchPost = async (id: string) => {
    try {
      setFetchingPost(true)
      const response = await fetch(`/api/admin/blog/${id}`)
      const data = await response.json()
      
      if (data.success && data.post) {
        const post = data.post
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featured_image_url: post.featured_image_url || '',
          featured_image_alt: post.featured_image_alt || '',
          author_name: post.author_name || '',
          author_avatar_url: post.author_avatar_url || '',
          category: post.category || '',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
          status: post.status || 'draft',
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          focus_keyword: post.focus_keyword || '',
          read_time_minutes: post.read_time_minutes?.toString() || '',
        })
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('Error loading post')
    } finally {
      setFetchingPost(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const postData: any = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        read_time_minutes: formData.read_time_minutes ? parseInt(formData.read_time_minutes) : null,
        updated_at: new Date().toISOString(),
      }

      // Set published_at if changing to published and it doesn't exist yet
      if (formData.status === 'published') {
        postData.published_at = postData.published_at || new Date().toISOString()
      }

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (data.success) {
        alert('Post updated successfully!')
        router.push('/admin/blog')
      } else {
        alert('Failed to update post: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Error updating post')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingPost) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-600">Loading post...</p>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-gray-600 mt-1">Update blog post details</p>
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
              {loading ? 'Updating...' : 'Update Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}