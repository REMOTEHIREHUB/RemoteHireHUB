import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code, 
  Palette, 
  TrendingUp, 
  Headphones, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Calculator,
  FileText,
  CheckSquare,
  Users,
  LucideIcon
} from 'lucide-react'
import type { Category } from '@/types/category'

interface CategoryCardProps {
  category: Category
}

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  'Code': Code,
  'Palette': Palette,
  'TrendingUp': TrendingUp,
  'Headphones': Headphones,
  'DollarSign': DollarSign,
  'BarChart3': BarChart3,
  'Settings': Settings,
  'Calculator': Calculator,
  'FileText': FileText,
  'CheckSquare': CheckSquare,
  'Users': Users,
}

// Gradient colors for each category
const gradientMap: Record<string, string> = {
  'Code': 'from-blue-500 to-cyan-500',
  'Palette': 'from-purple-500 to-pink-500',
  'TrendingUp': 'from-green-500 to-emerald-500',
  'Headphones': 'from-orange-500 to-amber-500',
  'DollarSign': 'from-emerald-500 to-teal-500',
  'BarChart3': 'from-indigo-500 to-blue-500',
  'Settings': 'from-gray-600 to-slate-600',
  'Calculator': 'from-violet-500 to-purple-500',
  'FileText': 'from-yellow-500 to-orange-500',
  'CheckSquare': 'from-teal-500 to-cyan-500',
  'Users': 'from-rose-500 to-pink-500',
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Safe icon lookup with fallback
  const iconName = category.icon || 'Code'
  const IconComponent = iconMap[iconName] || Code
  const gradient = gradientMap[iconName] || 'from-blue-500 to-cyan-500'
  
  return (
    <Link href={`/${category.slug}-jobs`} className="block group">
      <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full bg-white group-hover:scale-105">
        {/* Gradient background on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        
        <CardHeader className="pb-4 pt-6 relative">
          {/* Icon with gradient background */}
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
              <IconComponent className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
          </div>
          
          <CardTitle className="text-center text-base sm:text-lg font-bold leading-tight text-gray-900 group-hover:text-gray-700 transition-colors">
            {category.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0 pb-6 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <span className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {category.job_count}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {category.job_count === 1 ? 'job' : 'jobs'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}