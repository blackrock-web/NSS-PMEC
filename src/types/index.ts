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
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  phone: string;
  email: string;
  rollNumber: string;
  department: string;
  academicYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | '';
  semester: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | '';
  previousExperience: string;
  skills: string[];
  motivation: string;
  agreeToPledge: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: 'General Inquiry' | 'Volunteer Enrollment' | 'Event Collaboration' | 'Report Verification';
  message: string;
}
