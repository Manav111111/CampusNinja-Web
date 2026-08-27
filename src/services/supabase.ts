import { createClient } from '@supabase/supabase-js';
import {
  Branch,
  Semester,
  Subject,
  Resource,
  Skill,
  SkillResource,
  Product,
  Order,
  Banner,
  CommunityLink,
  SocialLink,
  SearchResults,
  Syllabus,
  SubjectSyllabus,
  SyllabusUnit,
  SyllabusTopic,
  SyllabusSavePayload
} from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

const isValidUUID = (uuid?: string): boolean => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof uuid === 'string' && regex.test(uuid);
};

// ============================================================
// ACADEMIC HIERARCHY
// ============================================================

export const getBranches = async (): Promise<Branch[]> => {
  const { data, error } = await supabase
    .from('branches')
    .select('id, name')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
  return data || [];
};

export const getSemesters = async (branchId: string): Promise<Semester[]> => {
  if (!isValidUUID(branchId)) {
    console.warn(`getSemesters: invalid branchId UUID: "${branchId}"`);
    return Array.from({ length: 8 }, (_, index) => ({
      id: `s-${index + 1}`,
      branch_id: branchId || 'all',
      number: index + 1,
    }));
  }

  const { data, error } = await supabase
    .from('semesters')
    .select('id, number')
    .eq('branch_id', branchId)
    .eq('is_active', true)
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching semesters:', error);
  }

  const raw = data || [];
  const seenNumbers = new Set<number>();
  const uniqueSemesters: Semester[] = [];

  for (const sem of raw) {
    if (sem && typeof sem.number === 'number' && !seenNumbers.has(sem.number)) {
      seenNumbers.add(sem.number);
      uniqueSemesters.push(sem);
    }
  }

  // Ensure B.Tech always has semesters 1 through 8
  for (let i = 1; i <= 8; i++) {
    if (!seenNumbers.has(i)) {
      uniqueSemesters.push({
        id: `s-${i}`,
        branch_id: branchId,
        number: i,
      });
    }
  }

  uniqueSemesters.sort((a, b) => a.number - b.number);
  return uniqueSemesters;
};

// ============================================================
// SUBJECTS
// ============================================================

export const getSubjects = async (branchId: string, semesterId: string): Promise<Subject[]> => {
  if (!branchId || !semesterId) {
    return [];
  }

  if (!isValidUUID(branchId) || !isValidUUID(semesterId)) {
    console.warn(`getSubjects: invalid branchId or semesterId UUID: branchId="${branchId}", semesterId="${semesterId}"`);
    return [];
  }

  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('branch_id', branchId)
    .eq('semester_id', semesterId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }

  if (!subjects || subjects.length === 0) return [];

  try {
    const subjectNames = subjects.map(s => (s.name || s.title || '').trim()).filter(Boolean);
    if (subjectNames.length > 0) {
      const { data: matchingSubs } = await supabase
        .from('subjects')
        .select('id, name')
        .in('name', subjectNames);

      if (matchingSubs && matchingSubs.length > 0) {
        const subIdToName: Record<string, string> = {};
        matchingSubs.forEach(m => {
          if (m.name) subIdToName[m.id] = m.name.trim().toLowerCase();
        });
        const allMatchingIds = matchingSubs.map(m => m.id);

        const { data: resources } = await supabase
          .from('resources')
          .select('subject_id, type')
          .in('subject_id', allMatchingIds)
          .eq('is_active', true);

        const countsByName: Record<string, { total: number; notes: number; pyqs: number; videos: number }> = {};
        if (resources) {
          resources.forEach(r => {
            const nameKey = subIdToName[r.subject_id];
            if (nameKey) {
              if (!countsByName[nameKey]) {
                countsByName[nameKey] = { total: 0, notes: 0, pyqs: 0, videos: 0 };
              }
              countsByName[nameKey].total += 1;
              const t = (r.type || '').toLowerCase();
              if (t === 'notes' || t === 'note') countsByName[nameKey].notes += 1;
              else if (t === 'pyqs' || t === 'pyq') countsByName[nameKey].pyqs += 1;
              else if (t === 'video' || t === 'videos') countsByName[nameKey].videos += 1;
            }
          });
        }

        return subjects.map(s => {
          const key = (s.name || s.title || '').trim().toLowerCase();
          return {
            ...s,
            counts: countsByName[key] || { total: 0, notes: 0, pyqs: 0, videos: 0 }
          };
        });
      }
    }
  } catch (err) {
    console.warn('Could not fetch resource counts for subjects:', err);
  }

  return subjects.map(s => ({
    ...s,
    counts: { total: 0, notes: 0, pyqs: 0, videos: 0 }
  }));
};

export const getAllSubjects = async (): Promise<Subject[]> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all subjects:', error);
    throw error;
  }
  return data || [];
};

// ============================================================
// BANNERS
// ============================================================

export const getBanners = async (screenName = 'home'): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .eq('screen_name', screenName)
    .order('priority', { ascending: false });

  if (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
  return data || [];
};

// ============================================================
// RESOURCES
// ============================================================

export const getResources = async (subjectId: string): Promise<Resource[]> => {
  if (!isValidUUID(subjectId)) {
    return [];
  }

  const { data: currentSub } = await supabase
    .from('subjects')
    .select('name, semester_id')
    .eq('id', subjectId)
    .single();

  let subjectIds = [subjectId];
  if (currentSub && currentSub.name) {
    const { data: matchingSubs } = await supabase
      .from('subjects')
      .select('id')
      .ilike('name', currentSub.name.trim());

    if (matchingSubs && matchingSubs.length > 0) {
      subjectIds = matchingSubs.map(s => s.id);
    }
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .in('subject_id', subjectIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }

  const seen = new Set();
  return (data || []).filter(item => {
    const key = `${item.title?.trim().toLowerCase()}_${item.type}_${item.file_url || item.drive_url || item.youtube_url || item.external_url || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getResourcesByType = async (subjectId: string, type: string): Promise<Resource[]> => {
  if (!isValidUUID(subjectId)) {
    return [];
  }

  const { data: currentSub } = await supabase
    .from('subjects')
    .select('name, semester_id')
    .eq('id', subjectId)
    .single();

  let subjectIds = [subjectId];
  if (currentSub && currentSub.name) {
    const { data: matchingSubs } = await supabase
      .from('subjects')
      .select('id')
      .ilike('name', currentSub.name.trim());

    if (matchingSubs && matchingSubs.length > 0) {
      subjectIds = matchingSubs.map(s => s.id);
    }
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .in('subject_id', subjectIds)
    .eq('type', type)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${type} resources:`, error);
    throw error;
  }

  const seen = new Set();
  return (data || []).filter(item => {
    const key = `${item.title?.trim().toLowerCase()}_${item.type}_${item.file_url || item.drive_url || item.youtube_url || item.external_url || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getPopularResources = async (limit = 10): Promise<Resource[]> => {
  const { data, error } = await supabase
    .from('resources')
    .select('*, subjects(name, short_name, theme_color)')
    .eq('is_popular', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular resources:', error);
    throw error;
  }
  return data || [];
};

// ============================================================
// SKILLS
// ============================================================

export const getSkills = async (): Promise<Skill[]> => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
  return data || [];
};

export const getSkillResources = async (skillId: string): Promise<SkillResource[]> => {
  if (!isValidUUID(skillId)) {
    return [];
  }

  const { data, error } = await supabase
    .from('skill_resources')
    .select('*')
    .eq('skill_id', skillId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching skill resources:', error);
    throw error;
  }
  return data || [];
};

// ============================================================
// MARKETPLACE
// ============================================================

export const getMarketplaceServices = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching marketplace services:', error);
    throw error;
  }
  return data || [];
};

export const getDeliverySettings = async (): Promise<{ deliveryFee: number; freeDeliveryThreshold: number }> => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['delivery_fee', 'free_delivery_threshold']);

    let deliveryFee = 49;
    let freeDeliveryThreshold = 499;

    if (data && data.length > 0) {
      data.forEach(item => {
        if (item.key === 'delivery_fee') deliveryFee = parseInt(item.value, 10) ?? 49;
        if (item.key === 'free_delivery_threshold') freeDeliveryThreshold = parseInt(item.value, 10) ?? 499;
      });
    }
    return { deliveryFee, freeDeliveryThreshold };
  } catch (err) {
    console.log('Using default delivery settings:', err);
    return { deliveryFee: 49, freeDeliveryThreshold: 499 };
  }
};

export const uploadOrderFileWeb = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop() || 'pdf';
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `orders/${uniqueName}`;

  const { error } = await supabase.storage
    .from('order-files')
    .upload(filePath, file, {
      upsert: false,
    });

  if (error) {
    console.error('Error uploading order file:', error);
    throw new Error(`File upload failed: ${error.message || 'Please verify file size and permissions.'}`);
  }

  const { data: urlData } = supabase.storage
    .from('order-files')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

export const createOrder = async (orderData: Order): Promise<Order> => {
  if (!isValidUUID(orderData?.product_id)) {
    throw new Error(`createOrder: invalid product_id UUID: "${orderData?.product_id}"`);
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      product_id: orderData.product_id,
      user_id: orderData.user_id || null,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email,
      requirement: orderData.requirement || null,
      college_name: orderData.college_name || null,
      address: orderData.address || null,
      payment_method: orderData.payment_method || 'cod',
      payment_status: orderData.payment_status || 'cod_pending',
      razorpay_order_id: orderData.razorpay_order_id || null,
      razorpay_payment_id: orderData.razorpay_payment_id || null,
      razorpay_signature: orderData.razorpay_signature || null,
      transaction_time: orderData.transaction_time || null,
      file_url: orderData.file_url || null,
      instructions: orderData.instructions || null,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw new Error(error.message || 'Order creation failed.');
  }
  return data;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  if (!isValidUUID(userId)) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, products(title, price, thumbnail_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
  return data || [];
};

// ============================================================
// COMMUNITY & SOCIAL
// ============================================================

export const getCommunityLinks = async (): Promise<CommunityLink[]> => {
  const { data, error } = await supabase
    .from('community_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching community links:', error);
    throw error;
  }
  return data || [];
};

export const getSocialLinks = async (platform: string | null = null): Promise<SocialLink[]> => {
  let query = supabase
    .from('social_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (platform) {
    query = query.eq('platform', platform);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching social links:', error);
    return [];
  }
  return data || [];
};

// ============================================================
// SEARCH
// ============================================================

export const searchAll = async (query: string): Promise<SearchResults> => {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { subjects: [], resources: [], skills: [], services: [] };
  }

  // Split multi-word query into tokens (e.g. "electric science" -> ["electric", "science"])
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);

  const subjectsOr = tokens.map(w => `name.ilike.%${w}%,title.ilike.%${w}%,short_name.ilike.%${w}%,course.ilike.%${w}%,branch.ilike.%${w}%`).join(',');
  const resourcesOr = tokens.map(w => `title.ilike.%${w}%,type.ilike.%${w}%`).join(',');
  const skillsOr = tokens.map(w => `name.ilike.%${w}%`).join(',');
  const servicesOr = tokens.map(w => `title.ilike.%${w}%,category.ilike.%${w}%,description.ilike.%${w}%`).join(',');

  const [subjectsRes, resourcesRes, skillsRes, servicesRes] = await Promise.all([
    supabase
      .from('subjects')
      .select('id, name, title, short_name, course, branch, semester, icon_name, theme_color')
      .or(subjectsOr)
      .eq('is_active', true)
      .limit(20),

    supabase
      .from('resources')
      .select('id, subject_id, title, type, storage_type, file_url, drive_url, youtube_url, subjects(name, short_name)')
      .or(resourcesOr)
      .eq('is_active', true)
      .limit(20),

    supabase
      .from('skills')
      .select('id, name, icon_name, theme_color, difficulty_level')
      .or(skillsOr)
      .eq('is_active', true)
      .limit(20),

    supabase
      .from('products')
      .select('id, title, description, price, thumbnail_url, category')
      .or(servicesOr)
      .eq('is_active', true)
      .limit(20),
  ]);

  return {
    subjects: ((subjectsRes.data || []) as Subject[]).map(item => ({ ...item, _source: 'subject' as const })),
    resources: ((resourcesRes.data || []) as Resource[]).map(item => ({ ...item, _source: 'resource' as const })),
    skills: ((skillsRes.data || []) as Skill[]).map(item => ({ ...item, _source: 'skill' as const })),
    services: ((servicesRes.data || []) as Product[]).map(item => ({ ...item, _source: 'service' as const })),
  };
};

export const getStorageUrl = (path: string): string => {
  const { data } = supabase.storage.from('resources').getPublicUrl(path);
  return data.publicUrl;
};

// ============================================================
// DYNAMIC SYLLABUS SERVICES
// ============================================================

/**
 * Standard Curated Fallbacks for initial development / offline fallback
 */
const DEFAULT_SYLLABUS_MAP: Record<string, { fileName: string; units: { title: string; topics: string[] }[] }> = {
  'applied-mathematics-1': {
    fileName: 'Applied_Mathematics_1_Syllabus.pdf',
    units: [
      {
        title: 'Matrices',
        topics: [
          'Definition of matrix and types of matrices',
          'Elementary row and column operations',
          'Echelon form and Normal form of a matrix',
          'Rank of a matrix and nullity',
          'Linear dependence and independence of vectors',
        ],
      },
      {
        title: 'Determinants',
        topics: [
          'Properties of determinants & algebraic evaluation',
          'Minors, cofactors, and adjoint matrices',
          'Inverse of a non-singular matrix',
          'Cramer’s rule for solving linear systems',
        ],
      },
      {
        title: 'System of Linear Equations',
        topics: [
          'Consistency and inconsistency of linear systems',
          'Homogeneous and non-homogeneous systems',
          'Gauss elimination method and Gauss-Jordan method',
          'Eigenvalues, Eigenvectors, and Cayley-Hamilton Theorem',
        ],
      },
      {
        title: 'Vector Algebra',
        topics: [
          'Vectors in 2D & 3D coordinate geometry',
          'Scalar (dot) product and Vector (cross) product',
          'Scalar triple product and Vector triple product',
          'Geometrical and physical applications of vectors',
        ],
      },
      {
        title: 'Differential Calculus',
        topics: [
          'Successive differentiation and Leibnitz’s Theorem',
          'Partial derivatives and Total derivative',
          'Euler’s Theorem on homogeneous functions',
          'Taylor’s and Maclaurin’s series for two variables',
        ],
      },
      {
        title: 'Integral Calculus',
        topics: [
          'Definite integrals and Reduction formulae',
          'Double and Triple integrals evaluation',
          'Change of order of integration',
          'Applications to areas, volumes, and center of gravity',
        ],
      },
      {
        title: 'Applications of Calculus',
        topics: [
          'Tangents, Normals, and Asymptotes',
          'Curvature, Radius of curvature, and Evolutes',
          'Maxima and Minima of functions of two variables',
          'Lagrange’s method of undetermined multipliers',
        ],
      },
    ],
  },
  'environmental-science': {
    fileName: 'Environmental_Science_Syllabus.pdf',
    units: [
      {
        title: 'Ecosystems & Biodiversity',
        topics: [
          'Concept of an ecosystem, structure and function',
          'Producers, consumers, and decomposers in food chains',
          'Biodiversity at global, national, and local levels',
          'Threats to biodiversity: habitat loss and conservation',
        ],
      },
      {
        title: 'Natural Resources & Management',
        topics: [
          'Forest resources: Use, over-exploitation, deforestation',
          'Water resources: Surface and groundwater management',
          'Renewable and non-renewable energy resources',
        ],
      },
      {
        title: 'Environmental Pollution & Control',
        topics: [
          'Air, Water, and Soil pollution causes and control',
          'Solid waste management techniques',
          'Disaster management: Floods, earthquakes, cyclones',
        ],
      },
      {
        title: 'Social Issues & Environmental Ethics',
        topics: [
          'Sustainable development practices',
          'Water harvesting and watershed management',
          'Environmental protection acts and policies',
        ],
      },
    ],
  },
  'engineering-graphics': {
    fileName: 'Engineering_Graphics_Syllabus.pdf',
    units: [
      {
        title: 'Drafting Principles & Scales',
        topics: [
          'Drawing instruments, sheet layout, and lettering',
          'Dimensioning systems and geometric constructions',
          'Plain scales, diagonal scales, and vernier scales',
        ],
      },
      {
        title: 'Engineering Curves & Conics',
        topics: [
          'Conic sections: Ellipse, Parabola, and Hyperbola',
          'Cycloidal curves: Cycloid, Epicycloid, Hypocycloid',
          'Involutes of regular polygons and circles',
        ],
      },
      {
        title: 'Orthographic Projections',
        topics: [
          'First angle and Third angle projection methods',
          'Projections of points in all quadrants',
          'Projections of straight lines inclined to planes',
        ],
      },
      {
        title: 'Projections & Section of Solids',
        topics: [
          'Projections of prisms, pyramids, cylinders, cones',
          'Section planes and true shapes of sections',
          'Development of lateral surfaces',
        ],
      },
      {
        title: 'Isometric Projections & CAD',
        topics: [
          'Isometric scale, isometric axes, and isometric views',
          'Conversion of orthographic views into isometric views',
          'Basic AutoCAD 2D drafting commands',
        ],
      },
    ],
  },
};

/**
 * Resolves a subject identifier (UUID or slug / name) to a subject record
 */
export const resolveSubjectRecord = async (subjectIdOrSlug: string): Promise<Subject | null> => {
  if (!subjectIdOrSlug) return null;

  if (isValidUUID(subjectIdOrSlug)) {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', subjectIdOrSlug)
      .maybeSingle();
    if (data) return data;
  }

  // Look up by exact slug / clean match
  const cleanName = subjectIdOrSlug.replace(/-/g, ' ').trim();
  const { data } = await supabase
    .from('subjects')
    .select('*')
    .ilike('name', `%${cleanName}%`)
    .limit(1)
    .maybeSingle();
  return data || null;
};

export const getSubjectDetails = resolveSubjectRecord;

/**
 * Fetches the dynamic syllabus, units, and nested topics for a subject
 */
export const getSubjectSyllabus = async (subjectIdOrSlug: string): Promise<SubjectSyllabus | null> => {
  if (!subjectIdOrSlug) return null;

  const subject = await resolveSubjectRecord(subjectIdOrSlug);
  const targetId = subject?.id || subjectIdOrSlug;

  try {
    // 1. Fetch syllabus metadata
    const { data: sylData, error: sylError } = await supabase
      .from('syllabuses')
      .select('*')
      .eq('subject_id', targetId)
      .maybeSingle();

    if (sylError && sylError.code !== 'PGRST116') {
      console.warn('Error querying syllabuses table:', sylError.message);
    }

    if (sylData) {
      // 2. Fetch units for this syllabus
      const { data: unitsData, error: unitsError } = await supabase
        .from('syllabus_units')
        .select('*')
        .eq('syllabus_id', sylData.id)
        .order('sort_order', { ascending: true })
        .order('unit_number', { ascending: true });

      if (unitsError) {
        console.error('Error fetching syllabus units:', unitsError);
      }

      const units: SyllabusUnit[] = [];
      const rawUnits = unitsData || [];

      if (rawUnits.length > 0) {
        const unitIds = rawUnits.map(u => u.id);
        const { data: topicsData, error: topicsError } = await supabase
          .from('syllabus_topics')
          .select('*')
          .in('unit_id', unitIds)
          .order('sort_order', { ascending: true });

        if (topicsError) {
          console.error('Error fetching syllabus topics:', topicsError);
        }

        const topicsByUnit: Record<string, SyllabusTopic[]> = {};
        (topicsData || []).forEach(topic => {
          if (!topicsByUnit[topic.unit_id]) {
            topicsByUnit[topic.unit_id] = [];
          }
          topicsByUnit[topic.unit_id].push(topic);
        });

        rawUnits.forEach((u, idx) => {
          units.push({
            ...u,
            unit_number: u.unit_number || (idx + 1),
            topics: topicsByUnit[u.id] || [],
          });
        });
      }

      return {
        id: sylData.id,
        subject_id: targetId,
        file_url: sylData.file_url,
        file_name: sylData.file_name,
        file_path: sylData.file_path,
        created_at: sylData.created_at,
        updated_at: sylData.updated_at,
        units,
      };
    }
  } catch (err) {
    console.warn('Supabase syllabus query exception:', err);
  }

  // Check fallback match
  const slugKey = subjectIdOrSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const fallback = DEFAULT_SYLLABUS_MAP[slugKey] || 
    (subject?.name ? DEFAULT_SYLLABUS_MAP[subject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')] : null);

  if (fallback) {
    return {
      id: `fallback-${slugKey}`,
      subject_id: targetId,
      file_url: null,
      file_name: fallback.fileName,
      file_path: null,
      units: fallback.units.map((u, idx) => ({
        id: `fb-unit-${idx + 1}`,
        syllabus_id: `fallback-${slugKey}`,
        subject_id: targetId,
        unit_number: idx + 1,
        title: u.title,
        description: null,
        sort_order: idx + 1,
        topics: u.topics.map((t, tIdx) => ({
          id: `fb-top-${idx + 1}-${tIdx + 1}`,
          unit_id: `fb-unit-${idx + 1}`,
          title: t,
          description: null,
          sort_order: tIdx + 1,
        })),
      })),
    };
  }

  return null;
};

/**
 * Saves syllabus metadata, units, and topics with ID-based reconciliation
 */
export const saveSubjectSyllabus = async (
  subjectIdOrSlug: string,
  payload: SyllabusSavePayload
): Promise<SubjectSyllabus> => {
  const subject = await resolveSubjectRecord(subjectIdOrSlug);
  const targetId = subject?.id || subjectIdOrSlug;

  if (!isValidUUID(targetId)) {
    throw new Error(`Cannot save syllabus: "${targetId}" is not a valid subject UUID.`);
  }

  // 1. Upsert syllabus record
  const { data: sylRecord, error: sylError } = await supabase
    .from('syllabuses')
    .upsert({
      subject_id: targetId,
      file_url: payload.file_url,
      file_name: payload.file_name,
      file_path: payload.file_path,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'subject_id' })
    .select()
    .single();

  if (sylError || !sylRecord) {
    throw new Error(`Failed to save syllabus header: ${sylError?.message || 'Unknown error'}`);
  }

  const syllabusId = sylRecord.id;

  // 2. Fetch existing units for this syllabus
  const { data: existingUnits } = await supabase
    .from('syllabus_units')
    .select('id')
    .eq('syllabus_id', syllabusId);

  const existingUnitIds = new Set((existingUnits || []).map(u => u.id));
  const incomingUnitIds = new Set(payload.units.map(u => u.id).filter(Boolean) as string[]);

  // Delete removed units
  const unitsToDelete = [...existingUnitIds].filter(id => !incomingUnitIds.has(id));
  if (unitsToDelete.length > 0) {
    await supabase.from('syllabus_units').delete().in('id', unitsToDelete);
  }

  // 3. Process each unit and its topics
  for (let uIdx = 0; uIdx < payload.units.length; uIdx++) {
    const unitPayload = payload.units[uIdx];
    const unitNumber = unitPayload.unit_number || (uIdx + 1);
    const sortOrder = unitPayload.sort_order ?? (uIdx + 1);

    let unitId = unitPayload.id;

    if (unitId && existingUnitIds.has(unitId)) {
      // Update existing unit
      await supabase
        .from('syllabus_units')
        .update({
          unit_number: unitNumber,
          title: unitPayload.title,
          description: unitPayload.description || null,
          sort_order: sortOrder,
          updated_at: new Date().toISOString(),
        })
        .eq('id', unitId);
    } else {
      // Insert new unit
      const { data: newUnit, error: insertError } = await supabase
        .from('syllabus_units')
        .insert({
          syllabus_id: syllabusId,
          subject_id: targetId,
          unit_number: unitNumber,
          title: unitPayload.title,
          description: unitPayload.description || null,
          sort_order: sortOrder,
        })
        .select('id')
        .single();

      if (insertError || !newUnit) {
        console.error('Error inserting syllabus unit:', insertError);
        continue;
      }
      unitId = newUnit.id;
    }

    if (!unitId) continue;

    // 4. Reconcile topics for this unit
    const { data: existingTopics } = await supabase
      .from('syllabus_topics')
      .select('id')
      .eq('unit_id', unitId);

    const existingTopicIds = new Set((existingTopics || []).map(t => t.id));
    const incomingTopicIds = new Set((unitPayload.topics || []).map(t => t.id).filter(Boolean) as string[]);

    // Delete removed topics
    const topicsToDelete = [...existingTopicIds].filter(id => !incomingTopicIds.has(id));
    if (topicsToDelete.length > 0) {
      await supabase.from('syllabus_topics').delete().in('id', topicsToDelete);
    }

    // Upsert topics
    const topics = unitPayload.topics || [];
    for (let tIdx = 0; tIdx < topics.length; tIdx++) {
      const topicPayload = topics[tIdx];
      const tSortOrder = topicPayload.sort_order ?? (tIdx + 1);

      if (topicPayload.id && existingTopicIds.has(topicPayload.id)) {
        await supabase
          .from('syllabus_topics')
          .update({
            title: topicPayload.title,
            description: topicPayload.description || null,
            sort_order: tSortOrder,
            updated_at: new Date().toISOString(),
          })
          .eq('id', topicPayload.id);
      } else {
        await supabase
          .from('syllabus_topics')
          .insert({
            unit_id: unitId,
            title: topicPayload.title,
            description: topicPayload.description || null,
            sort_order: tSortOrder,
          });
      }
    }
  }

  const result = await getSubjectSyllabus(targetId);
  if (!result) {
    throw new Error('Syllabus was saved but could not be refetched.');
  }
  return result;
};

/**
 * Uploads a syllabus PDF to Supabase Storage
 */
export const uploadSyllabusFile = async (
  subjectId: string,
  file: File
): Promise<{ url: string; path: string; name: string }> => {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `syllabuses/${subjectId}/${Date.now()}_${sanitizedName}`;

  // Upload to resources bucket (or syllabuses bucket)
  const { data, error } = await supabase.storage
    .from('resources')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    // Try syllabuses bucket fallback
    const { data: sylBucketData, error: sylBucketError } = await supabase.storage
      .from('syllabuses')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (sylBucketError) {
      throw new Error(`Failed to upload file to storage: ${error.message}`);
    }

    const { data: urlData } = supabase.storage.from('syllabuses').getPublicUrl(filePath);
    return {
      url: urlData.publicUrl,
      path: filePath,
      name: file.name,
    };
  }

  const { data: urlData } = supabase.storage.from('resources').getPublicUrl(filePath);
  return {
    url: urlData.publicUrl,
    path: filePath,
    name: file.name,
  };
};

/**
 * Removes a syllabus file from storage
 */
export const deleteSyllabusFile = async (filePath: string): Promise<void> => {
  if (!filePath) return;
  await supabase.storage.from('resources').remove([filePath]);
  await supabase.storage.from('syllabuses').remove([filePath]);
};

