export interface Job {
  id: string
  job_id: string
  title: string
  company: string
  company_logo_url?: string
  location: string
  location_restriction?: string
  timezone_requirement?: string
  job_type: string
  experience_level?: string
  category_id?: string
  salary_min?: number
  salary_max?: number
  salary_currency?: string
  description: string
  requirements?: string
  
  // NEW FIELDS - Added for JobDetail component
  responsibilities?: string
  benefits?: string
  has_health_insurance?: boolean
  has_401k?: boolean
  offers_visa_sponsorship?: boolean
  offers_relocation?: boolean
  home_office_stipend?: boolean
  
  source_platform: string
  source_url: string
  is_remote: boolean
  is_featured: boolean
  posted_date: string
  created_at: string
  slug: string
   
  // ADD THESE TWO FIELDS:
  meta_title?: string
  meta_description?: string
}