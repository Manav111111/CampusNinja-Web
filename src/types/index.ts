export interface Branch {
  id: string;
  name: string;
  is_active?: boolean;
}

export interface Semester {
  id: string;
  number: number;
  branch_id?: string;
  is_active?: boolean;
}

export interface SubjectCounts {
  total: number;
  notes: number;
  pyqs: number;
  videos: number;
}

export interface Subject {
  id: string;
  name: string;
  title?: string;
  short_name?: string;
  course?: string;
  branch?: string;
  semester?: string;
  branch_id?: string;
  semester_id?: string;
  icon_name?: string;
  theme_color?: string;
  sort_order?: number;
  is_active?: boolean;
  counts?: SubjectCounts;
}

export interface Resource {
  id: string;
  subject_id: string;
  title: string;
  type: 'notes' | 'pyq' | 'video' | 'syllabus' | 'important_questions' | 'ai_resources' | string;
  storage_type?: 'supabase' | 'drive' | 'youtube' | 'external';
  file_url?: string;
  drive_url?: string;
  youtube_url?: string;
  external_url?: string;
  description?: string;
  is_popular?: boolean;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  subjects?: {
    name?: string;
    short_name?: string;
    theme_color?: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  icon_name?: string;
  theme_color?: string;
  difficulty_level?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface SkillResource {
  id: string;
  skill_id: string;
  title: string;
  type: string;
  url: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  thumbnail_url?: string;
  image_url?: string;
  category?: string;
  badge?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Order {
  id?: string;
  product_id: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  requirement?: string | null;
  college_name?: string | null;
  address?: string | null;
  payment_method?: string;
  file_url?: string | null;
  instructions?: string | null;
  status?: string;
  created_at?: string;
  products?: {
    title?: string;
    price?: number | string;
    thumbnail_url?: string;
  };
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  screen_name?: string;
  priority?: number;
  is_active?: boolean;
}

export interface CommunityLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon_name?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface SocialLink {
  id: string;
  platform: 'whatsapp' | 'youtube' | 'instagram' | string;
  title: string;
  url: string;
  icon_name?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface SearchResults {
  subjects: (Subject & { _source: 'subject' })[];
  resources: (Resource & { _source: 'resource' })[];
  skills: (Skill & { _source: 'skill' })[];
  services: (Product & { _source: 'service' })[];
}
