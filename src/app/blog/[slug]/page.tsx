export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Blog Post</h1>
      <p className="mt-4 text-gray-600">Post slug: {params.slug}</p>
      <p className="mt-2 text-gray-600">Individual blog post - Coming Soon</p>
    </div>
  )
}
