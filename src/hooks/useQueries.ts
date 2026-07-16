import { useQuery } from '@tanstack/react-query';
import {
  getBanners,
  getSubjects,
  getAllSubjects,
  getMarketplaceServices,
  getSkills,
  getPopularResources,
  getResources,
  getResourcesByType,
  getSkillResources,
  getDeliverySettings,
  getUserOrders,
  getCommunityLinks,
  getSocialLinks
} from '@/services/supabase';

export const useBanners = (screenName = 'home') => {
  return useQuery({
    queryKey: ['banners', screenName],
    queryFn: () => getBanners(screenName),
  });
};

export const useSubjects = (branchId: string | null, semesterId: string | null) => {
  return useQuery({
    queryKey: ['subjects', branchId, semesterId],
    queryFn: () => (branchId && semesterId ? getSubjects(branchId, semesterId) : Promise.resolve([])),
    enabled: Boolean(branchId && semesterId),
  });
};

export const useAllSubjects = () => {
  return useQuery({
    queryKey: ['all-subjects'],
    queryFn: () => getAllSubjects(),
  });
};

export const useMarketplaceServices = () => {
  return useQuery({
    queryKey: ['marketplace-services'],
    queryFn: () => getMarketplaceServices(),
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => getSkills(),
  });
};

export const usePopularResources = (limit = 10) => {
  return useQuery({
    queryKey: ['popular-resources', limit],
    queryFn: () => getPopularResources(limit),
  });
};

export const useSubjectResources = (subjectId: string) => {
  return useQuery({
    queryKey: ['resources', subjectId],
    queryFn: () => getResources(subjectId),
    enabled: Boolean(subjectId),
  });
};

export const useSubjectResourcesByType = (subjectId: string, type: string) => {
  return useQuery({
    queryKey: ['resources', subjectId, type],
    queryFn: () => getResourcesByType(subjectId, type),
    enabled: Boolean(subjectId && type),
  });
};

export const useSkillResources = (skillId: string) => {
  return useQuery({
    queryKey: ['skill-resources', skillId],
    queryFn: () => getSkillResources(skillId),
    enabled: Boolean(skillId),
  });
};

export const useDeliverySettings = () => {
  return useQuery({
    queryKey: ['delivery-settings'],
    queryFn: () => getDeliverySettings(),
  });
};

export const useUserOrders = (userId?: string) => {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: () => (userId ? getUserOrders(userId) : Promise.resolve([])),
    enabled: Boolean(userId),
  });
};

export const useCommunityLinks = () => {
  return useQuery({
    queryKey: ['community-links'],
    queryFn: () => getCommunityLinks(),
  });
};

export const useSocialLinks = (platform?: string | null) => {
  return useQuery({
    queryKey: ['social-links', platform],
    queryFn: () => getSocialLinks(platform || null),
  });
};
