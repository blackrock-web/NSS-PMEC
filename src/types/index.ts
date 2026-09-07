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

export type Role =
  | 'public'
  | 'user'
  | 'member'
  | 'coordinator'
  | 'admin'
  | 'super_admin_1'
  | 'super_admin_2'
  | 'superadmin';

export type Permission =
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'events.view'
  | 'events.create'
  | 'events.edit'
  | 'events.delete'
  | 'events.attendance'
  | 'volunteers.view'
  | 'volunteers.apply'
  | 'volunteers.approve'
  | 'coordinators.manage'
  | 'reports.view'
  | 'reports.export'
  | 'analytics.view'
  | 'analytics.advanced'
  | 'system.activity.view'
  | 'system.settings.manage'
  | 'website.content.edit'
  | 'website.branding.edit'
  | 'website.gallery.manage'
  | 'website.integrations.manage'
  | 'website.security.manage';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  public: ['events.view'],
  user: ['events.view', 'volunteers.view', 'volunteers.apply'],
  member: ['events.view', 'volunteers.view', 'volunteers.apply'],
  coordinator: [
    'events.view',
    'events.edit',
    'events.attendance',
    'volunteers.view',
    'reports.view',
  ],
  admin: [
    'users.view',
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'events.attendance',
    'volunteers.view',
    'volunteers.approve',
    'coordinators.manage',
    'reports.view',
    'reports.export',
    'analytics.view',
    'system.activity.view',
  ],
  super_admin_1: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'events.attendance',
    'volunteers.view',
    'volunteers.approve',
    'coordinators.manage',
    'reports.view',
    'reports.export',
    'analytics.view',
    'analytics.advanced',
    'system.activity.view',
    'system.settings.manage',
  ],
  superadmin: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'events.attendance',
    'volunteers.view',
    'volunteers.approve',
    'coordinators.manage',
    'reports.view',
    'reports.export',
    'analytics.view',
    'analytics.advanced',
    'system.activity.view',
    'system.settings.manage',
  ],
  super_admin_2: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'events.attendance',
    'volunteers.view',
    'volunteers.approve',
    'coordinators.manage',
    'reports.view',
    'reports.export',
    'analytics.view',
    'analytics.advanced',
    'system.activity.view',
    'system.settings.manage',
    'website.content.edit',
    'website.branding.edit',
    'website.gallery.manage',
    'website.integrations.manage',
    'website.security.manage',
  ],
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions?: Permission[];
  collegeId: string;
  collegeName?: string;
  avatarUrl?: string;
  department?: string;
  academicYear?: string;
  rollNumber?: string;
  phone?: string;
  passwordHash?: string;
  totpEnabled?: boolean;
  totpSecret?: string;
  assignedEventIds?: string[];
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
  requiresAdmin2FA?: boolean;
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

// ----------------------------------------------------
// Super Admin Level 2: External Data Sources & Drive Links
// ----------------------------------------------------
export interface ExternalDataSource {
  id: string;
  name: string;
  url: string;
  description: string;
  type: 'google_drive' | 'onedrive' | 'dropbox' | 's3' | 'custom';
  isActive: boolean;
  priority: number;
  lastVerifiedAt?: string;
  folderId?: string;
}

// ----------------------------------------------------
// Super Admin Level 2: Gallery & Homepage Glimpse Top Picks
// ----------------------------------------------------
export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  altText?: string;
  isFeatured: boolean; // Selected for Homepage Top Picks
  orderIndex: number;
  isActive: boolean;
  uploadedAt: string;
  date?: string;
  tags?: string[];
}

// ----------------------------------------------------
// Super Admin Level 2: Branding & Website CMS Content
// ----------------------------------------------------
export interface BrandingSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  websiteLogoUrl: string;
  orgLogoUrl: string;
  faviconUrl: string;
  headerLogoUrl: string;
  footerLogoUrl: string;
  heroImageUrl: string;
  heroBackgroundUrl: string;
  ogShareImageUrl: string;
  primaryBrandColor: string;
  secondaryBrandColor: string;
  accentColor: string;
}

export interface SiteCmsContent {
  collegeName: string;
  collegeFullName: string;
  universityAffiliation: string;
  unitNumber: string;
  motto: string;
  hindiMotto: string;
  foundedYear: string;

  // Homepage Headings & Hero
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutSectionTitle: string;
  aboutSectionDescription: string;
  missionStatement: string;
  visionStatement: string;
  orgDescription: string;

  // Contact Information
  collegeAddress: string;
  officialEmail: string;
  officialPhone: string;
  bloodHelpline: string;
  workingHours: string;

  // Navigation Labels
  navLabels: {
    home: string;
    about: string;
    events: string;
    activities: string;
    gallery: string;
    reports: string;
    bloodDonor: string;
    contact: string;
  };

  // Footer & Legal Content
  footerDescription: string;
  copyrightText: string;
  termsText: string;
  privacyText: string;

  // Announcements & Notices
  announcements: SiteAnnouncement[];
  faqs: { question: string; answer: string }[];

  // Branding & Visuals
  branding: BrandingSettings;

  // External Drive / Data Sources
  externalDataSources: ExternalDataSource[];

  // Top Picks Carousel interval
  topPicksIntervalSeconds: number;
}

// ----------------------------------------------------
// Super Admin Level 2: Full Audit Trail Diffs
// ----------------------------------------------------
export interface AuditTrailDiff {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: Role;
  section: string;
  fieldChanged: string;
  previousValue: string;
  newValue: string;
  ipAddress?: string;
}

// ----------------------------------------------------
// Event Registration & Attendance (For Users & Coordinators)
// ----------------------------------------------------
export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone?: string;
  rollNumber?: string;
  department?: string;
  status: 'registered' | 'attended' | 'absent' | 'cancelled';
  registeredAt: string;
  attendedAt?: string;
  coordinatorNotes?: string;
}

// ----------------------------------------------------
// Live Database Analytics Summary
// ----------------------------------------------------
export interface LiveAnalyticsData {
  volunteers: {
    total: number;
    newEnrollmentsThisMonth: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'neutral';
  };
  pendingApprovals: {
    total: number;
    pendingVolunteers: number;
    pendingEvents: number;
    pendingCoordinators: number;
  };
  events: {
    totalActive: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    registeredParticipants: number;
    volunteerParticipation: number;
  };
  enrollmentTimeSeries: {
    date: string;
    label: string;
    count: number;
  }[];
  eventAnalytics: {
    category: string;
    eventsCount: number;
    registrations: number;
    attendanceRate: number;
  }[];
  approvalsBreakdown: {
    status: 'pending' | 'approved' | 'rejected';
    count: number;
    percentage: number;
  }[];
}


