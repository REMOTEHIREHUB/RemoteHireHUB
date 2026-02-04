'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  CheckCircle,
  Clock,
  XCircle 
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  author_name: string
  category: string
  status: string
  published_at: string | null
  view_count: number
  created_at: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/blog')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id))
        alert('Post deleted successfully!')
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesFilter = 
        filterStatus === 'all' ||
        (filterStatus === 'published' && post.status === 'published') ||
        (filterStatus === 'draft' && post.status === 'draft')
      
      return matchesSearch && matchesFilter
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
            <CheckCircle className="h-4 w-4" />
            Published
          </span>
        )
      case 'draft':
        return (
          <span className="flex items-center gap-1 text-gray-400 font-medium text-sm">
            <XCircle className="h-4 w-4" />
            Draft
          </span>
        )
      case 'scheduled':
        return (
          <span className="flex items-center gap-1 text-blue-600 font-medium text-sm">
            <Clock className="h-4 w-4" />
            Scheduled
          </span>
        )
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600 mt-1">Manage all blog posts</p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/admin/blog/create">
                <Plus className="mr-2 h-4 w-4" />
                Write New Post
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-blue-600">
                {posts.reduce((sum, p) => sum + (p.view_count || 0), 0)}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'published' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('published')}
                  size="sm"
                >
                  Published
                </Button>
                <Button
                  variant={filterStatus === 'draft' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('draft')}
                  size="sm"
                >
                  Drafts
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No posts found</p>
            <Button asChild>
              <Link href="/admin/blog/create">
                <Plus className="mr-2 h-4 w-4" />
                Write Your First Post
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{post.title}</p>
                        {post.excerpt && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {post.excerpt.substring(0, 60)}...
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.author_name || 'Admin'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.category || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.view_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.status === 'published' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}