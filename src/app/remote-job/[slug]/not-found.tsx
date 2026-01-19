import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Home, AlertCircle } from 'lucide-react'

export default function JobNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-2">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="mb-6">
            <AlertCircle className="h-20 w-20 mx-auto text-gray-400" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Job Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the job you're looking for. It may have been filled or is no longer available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Link href="/remote-jobs">
                <Search className="mr-2 h-4 w-4" />
                Browse Jobs
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="border-2 hover:border-blue-600 hover:text-blue-600"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}