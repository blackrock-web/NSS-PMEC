export type ActivityCategory = 
  | 'Environment'
  | 'Health & Wellbeing'
  | 'Education'
  | 'Community Development'
  | 'Social Awareness'
  | 'National Integration'
  | 'Special Camp';

export interface Activity {
  id: string;
  slug: string;
  title: string;
  category: ActivityCategory;
  date: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  volunteersInvolved: number;
  beneficiaries: string;
  highlights: string[];
  reportPdfUrl?: string;
  featured?: boolean;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: ActivityCategory;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'past';
  day: string;
  month: string;
  year: string;
  heroImage: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string[];
  activitiesConducted?: string[];
  impactStats?: { label: string; value: string }[];
  gallery?: string[];
  reportAvailable?: boolean;
  registrationOpen?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  roleType: 'leadership' | 'programme_officer' | 'student_coordinator';
  department: string;
  bio: string;
  image: string;
  email?: string;
  phone?: string;
  badge?: string;
}

export interface SpecialCampDay {
  dayNumber: string;
  title: string;
  theme: string;
  timeSchedule: string;
  description: string;
  activities: string[];
  keyOutcomes: string;
  icon: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Events' | 'Special Camp' | 'Community' | 'Environment' | 'Volunteers' | 'Celebrations';
  imageUrl: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  date: string;
  location: string;
  caption: string;
  eventAssociated?: string;
}

export interface Achievement {
  id: string;
  title: string;
  year: string;
  category: 'Award' | 'Recognition' | 'Certificate' | 'Milestone';
  awardingBody: string;
  description: string;
  image: string;
  citation?: string;
}

export type AchievementItem = Achievement;

export interface ReportItem {
  id: string;
  title: string;
  academicYear: '2025–26' | '2024–25';
  category: 'Annual' | 'Special Camp' | 'Blood Donation' | 'Environment' | 'Social Drive';
  datePublished: string;
  fileSize: string;
  pages: number;
  preparedBy: string;
  description: string;
  downloadUrl: string;
}

export interface VolunteerFormData {
  fullName: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  phone: string;
  email: string;
  rollNumber: string;
  department: string;
  academicYear: string;
  semester?: string;
  bloodGroup: string;
  previousExperience?: string;
  skills: string[];
  motivation: string;
  agreeToPledge?: boolean;
  pledgeAccepted?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: 'General Inquiry' | 'Volunteer Enrollment' | 'Event Collaboration' | 'Report Verification';
  message: string;
}

// ----------------------------------------------------
// SaaS, Multi-tenant, and Auth Types
// ----------------------------------------------------

export type Role = 'public' | 'admin' | 'superadmin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  collegeId: string;
  collegeName?: string;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
}

export interface SiteAnnouncement {
  id: string;
  title: string;
  date: string;
  isNew: boolean;
  link: string;
}

export type Announcement = SiteAnnouncement;

export interface ImpactStatistic {
  label: string;
  value: number;
  suffix: string;
  note: string;
}

export type ImpactStat = ImpactStatistic;

export interface TenantConfig {
  id: string;
  collegeName: string;
  collegeFullName: string;
  universityAffiliation: string;
  unitNumber: string;
  motto: string;
  hindiMotto: string;
  foundedYear: string;
  collegeAddress: string;
  programmeOfficerName: string;
  programmeOfficerTitle: string;
  email: string;
  phone: string;
  officialPhone: string;
  bloodHelpline: string;
  officeLocation: string;
  address: string;
  officeHours: string;
  workingHours: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
    collegeWebsite: string;
  };
  impactStats: ImpactStatistic[];
  announcements: SiteAnnouncement[];
  driveFolderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  token: string;
  user: User;
  expiresAt: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface VolunteerApplication extends VolunteerFormData {
  id: string;
  submittedAt: string;
  collegeId: string;
  status: ApplicationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export type ContactMessageStatus = 'unread' | 'read' | 'replied';

export interface ContactMessageRecord extends ContactFormData {
  id: string;
  submittedAt: string;
  collegeId: string;
  status: ContactMessageStatus;
  replyNotes?: string;
  repliedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: Role;
  collegeId: string;
  action: string;
  domain: 'events' | 'activities' | 'volunteers' | 'gallery' | 'reports' | 'team' | 'settings' | 'auth' | 'system';
  details: string;
  ipAddress?: string;
}

export interface StorageQuota {
  usedBytes: number;
  maxBytes: number;
  fileCount: number;
  driveFolderUrl?: string;
}

export interface GlobalSearchResult {
  id: string;
  title: string;
  category: string;
  type: 'event' | 'activity' | 'achievement' | 'gallery' | 'report' | 'team';
  link: string;
  snippet: string;
  date?: string;
}

