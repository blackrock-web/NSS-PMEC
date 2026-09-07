import { google } from 'googleapis';
import { SERVER_CONFIG, hasGoogleCredentials } from '../config.js';
import type {
  TenantConfig,
  EventItem,
  Activity,
  Achievement,
  GalleryPhoto,
  ReportItem,
  TeamMember,
  VolunteerApplication,
  ContactMessageRecord,
  User,
  AuditLogEntry,
} from '../../src/types/index.js';

let sheetsClient: ReturnType<typeof google.sheets> | null = null;

function getSheetsClient() {
  if (!sheetsClient && hasGoogleCredentials) {
    try {
      const auth = new google.auth.JWT({
        email: SERVER_CONFIG.google.clientEmail,
        key: SERVER_CONFIG.google.privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      sheetsClient = google.sheets({ version: 'v4', auth });
    } catch (err) {
      console.warn('[Google Sheets] Initialization error, using in-memory store:', err);
    }
  }
  return sheetsClient;
}

// In-Memory Read Cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const memoryCache = new Map<string, CacheEntry<unknown>>();

function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > SERVER_CONFIG.cacheTtlMs) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setToCache<T>(key: string, data: T) {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(sheetName?: string) {
  if (!sheetName) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(sheetName)) {
      memoryCache.delete(key);
    }
  }
}

// Exponential backoff helper
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (retries <= 1) throw err;
    await new Promise((res) => setTimeout(res, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// ----------------------------------------------------
// In-Memory Fallback Seed Store
// (Always up-to-date and seamlessly used if Google Sheets ID is not configured)
// ----------------------------------------------------

const mockTenants: TenantConfig[] = [
  {
    id: 'unit-04-05',
    collegeName: 'Government Model Autonomous College',
    collegeFullName: 'Government Model Autonomous College of Arts, Science & Technology',
    universityAffiliation: 'Affiliated to State Central University • Approved by UGC & Govt. of Higher Education',
    unitNumber: 'Unit No. 04 & 05 (Combined Wing)',
    motto: 'NOT ME BUT YOU',
    hindiMotto: 'न मे परंतू भवान्',
    foundedYear: '1969',
    collegeAddress: 'NSS Institutional Cell, Student Welfare Block, Model Autonomous Campus, MG Road, District Central, New Delhi - 110001',
    programmeOfficerName: 'Dr. Anand Verma, Ph.D.',
    programmeOfficerTitle: 'Assistant Professor & Programme Officer, NSS Units 04 & 05',
    email: 'nss.cell@modelautonomous.edu.in',
    phone: '+91 11 2345 6789',
    officialPhone: '+91 11 2345 6789',
    bloodHelpline: '+91 98765 43210 (24/7 Red Cross / NSS Registry)',
    officeLocation: 'Room 104, Student Welfare Block, College Main Campus',
    address: 'Administrative Block, Model Autonomous College Campus, New Delhi - 110001',
    officeHours: 'Monday – Friday: 9:00 AM – 5:00 PM',
    workingHours: 'Monday – Friday: 9:00 AM – 5:00 PM',
    socialLinks: {
      instagram: 'https://instagram.com/nss_modelcollege',
      twitter: 'https://x.com/nss_modelcollege',
      youtube: 'https://youtube.com/@nss_modelcollege',
      linkedin: 'https://linkedin.com/company/nss-modelcollege',
      collegeWebsite: 'https://modelautonomous.edu.in'
    },
    impactStats: [
      { label: 'Enrolled Volunteers', value: 500, suffix: '+', note: 'Active regular volunteers' },
      { label: 'Community Activities', value: 25, suffix: '+', note: 'Annual initiatives completed' },
      { label: 'Communities Reached', value: 10, suffix: '+', note: 'Adopted & outreach villages' },
      { label: 'Citizens Impacted', value: 2500, suffix: '+', note: 'Direct beneficiaries served' },
    ],
    announcements: [
      {
        id: 'ann-1',
        title: 'Volunteer Enrolment for Academic Session 2026–27 is now OPEN',
        date: 'Sept 05, 2026',
        isNew: true,
        link: '/join-nss'
      },
      {
        id: 'ann-2',
        title: 'Annual 7-Day Special Winter Camp Schedule announced for Adopted Village',
        date: 'Aug 28, 2026',
        isNew: false,
        link: '/special-camp'
      },
      {
        id: 'ann-3',
        title: 'Blood Donation Camp in collaboration with District Red Cross Society on Sept 12',
        date: 'Aug 24, 2026',
        isNew: false,
        link: '/events/mega-blood-donation-camp-2026'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  }
];

const mockUsers: User[] = [
  {
    id: 'user-superadmin',
    email: 'superadmin@nss-portal.gov.in',
    name: 'National Directorate Admin',
    role: 'superadmin',
    collegeId: 'all',
    collegeName: 'National NSS Directorate',
    createdAt: '2026-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: 'user-po-verma',
    email: 'programme.officer@college.edu.in',
    name: 'Dr. Anand Verma',
    role: 'admin',
    collegeId: 'unit-04-05',
    collegeName: 'Government Model Autonomous College',
    createdAt: '2026-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: 'user-volunteer-lead',
    email: 'volunteer.lead@college.edu.in',
    name: 'Pooja Sharma',
    role: 'admin',
    collegeId: 'unit-04-05',
    collegeName: 'Government Model Autonomous College',
    createdAt: '2026-01-10T00:00:00Z',
    isActive: true,
  }
];

const mockEvents: (EventItem & { collegeId: string; createdAt: string })[] = [
  {
    id: 'ev-1',
    collegeId: 'unit-04-05',
    slug: 'mega-blood-donation-camp-2026',
    title: 'Mega Blood Donation Drive 2026',
    category: 'Health & Wellbeing',
    date: '2026-09-12',
    time: '9:00 AM – 4:00 PM',
    location: 'College Auditorium & Medical Centre',
    status: 'upcoming',
    day: '12',
    month: 'SEP',
    year: '2026',
    heroImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Annual campus blood donation drive organized with the District Red Cross Blood Bank, targeting 300+ units of voluntary blood.',
    fullDescription: 'Every year, the NSS unit organizes this hallmark humanitarian drive in partnership with the Government Medical College and District Red Cross Society. With over 300 prospective donors registered across faculties and student batches, the camp is supported by certified medical officers, refreshments, and donor certificates.',
    objectives: [
      'Bridge the seasonal shortage of critical blood units in government hospital trauma centres.',
      'Promote voluntary, non-remunerated voluntary blood donation among young adults.',
      'Provide basic health check-ups (hemoglobin, BP, blood group screening) for all volunteer donors.'
    ],
    registrationOpen: true,
    reportAvailable: false,
    createdAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'ev-2',
    collegeId: 'unit-04-05',
    slug: 'poshan-maah-nutrition-awareness-walkathon',
    title: 'Poshan Maah Community Nutrition Walkathon',
    category: 'Health & Wellbeing',
    date: '2026-09-20',
    time: '7:30 AM – 10:30 AM',
    location: 'Campus Gate 1 to Subhash Nagar Chowk',
    status: 'upcoming',
    day: '20',
    month: 'SEP',
    year: '2026',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Flagship 5km public awareness walkathon observing National Nutrition Month, distributing millets and educational pamphlets.',
    fullDescription: 'Under the auspices of Rashtriya Poshan Maah, NSS cadets will lead a 5-kilometer morning rally through adopted slum settlements and commercial hubs to promote traditional millets, balanced maternal nutrition, and hygiene.',
    objectives: [
      'Raise public awareness on anemia prevention among adolescent girls and lactating mothers.',
      'Distribute free sprouted legumes and informational pamphlets printed in regional languages.',
      'Encourage consumption of indigenous Shree Anna (millets) for sustainable health.'
    ],
    registrationOpen: true,
    reportAvailable: false,
    createdAt: '2026-08-25T00:00:00Z',
  },
  {
    id: 'ev-3',
    collegeId: 'unit-04-05',
    slug: 'anti-plastic-cleanliness-shramdaan-lake',
    title: 'Riverfront Cleanliness & Eco-Restoration Shramdaan',
    category: 'Environment',
    date: '2026-08-15',
    time: '6:30 AM – 11:00 AM',
    location: 'Ghat No. 3 & Wetlands Park',
    status: 'past',
    day: '15',
    month: 'AUG',
    year: '2026',
    heroImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Voluntary physical shramdaan removing 680 kg of non-biodegradable waste and installing eco-friendly notice signage.',
    fullDescription: 'Observing Independence Day through patriotic environmental service, 120 NSS volunteers carried out intensive physical desilting, weed clearance, and plastic retrieval along the municipal riverfront stretch.',
    objectives: [
      'Clear single-use plastic debris choking the natural drainage inlet of the migratory wetlands.',
      'Sensitize morning walkers and riverbank temple visitors on zero-litter practices.',
      'Sort collected waste into recyclable PET, multilayer plastics, and glass with municipal waste handlers.'
    ],
    impactStats: [
      { label: 'Volunteers Deployed', value: '120' },
      { label: 'Waste Removed', value: '680 kg' },
      { label: 'Riverfront Restored', value: '1.2 km' }
    ],
    registrationOpen: false,
    reportAvailable: true,
    createdAt: '2026-08-16T00:00:00Z',
  }
];

const mockActivities: (Activity & { collegeId: string; createdAt: string })[] = [
  {
    id: 'act-1',
    collegeId: 'unit-04-05',
    slug: 'tree-plantation-van-mahotsav-2026',
    title: 'Van Mahotsav Urban Agroforestry Drive',
    category: 'Environment',
    date: 'July 2026',
    location: 'Adopted Peri-Urban Green Belt',
    shortDescription: 'Plantation of 1,200 native saplings with geotagging and a dedicated student-volunteer caretaker roster.',
    fullDescription: 'To combat urban heat island effects and restore indigenous biodiversity, NSS units partnered with the State Forest Department to plant 1,200 indigenous tree varieties including Neem, Peepal, Jamun, and Gulmohar. Each volunteer was allocated custody of 5 saplings for ongoing nurturing and survival tracking.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    volunteersInvolved: 140,
    beneficiaries: 'Peri-urban community of 8,000 residents',
    highlights: [
      '1,200 native drought-tolerant saplings planted.',
      'Geotagged monitoring system piloted on mobile app.',
      '94% survival rate recorded during the first 60 days.'
    ],
    featured: true,
    createdAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'act-2',
    collegeId: 'unit-04-05',
    slug: 'digital-literacy-for-seniors',
    title: 'DigiShiksha: Digital Banking & Cyber Safety for Seniors',
    category: 'Education',
    date: 'June 2026',
    location: 'Community Centre & Pensioners Club',
    shortDescription: 'One-on-one digital empowerment workshops training senior citizens in UPI safety, online booking, and cyber fraud prevention.',
    fullDescription: 'Bridging the generational digital divide, NSS cadets held 8 consecutive weekend clinics instructing senior citizens and self-help women on smartphone fundamentals, DigiLocker, BHIM-UPI security, and identifying cyber phishing scams.',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1000&q=80',
    volunteersInvolved: 65,
    beneficiaries: '320 elderly citizens and micro-vendors',
    highlights: [
      '320 seniors trained in safe UPI transactions.',
      'Zero-compromise security guidelines pamphlet published.',
      'Personalized emergency speed-dial configuration assistance provided.'
    ],
    featured: true,
    createdAt: '2026-06-25T00:00:00Z',
  },
  {
    id: 'act-3',
    collegeId: 'unit-04-05',
    slug: 'pulse-polio-immunization-support',
    title: 'National Immunization Day Door-to-Door Outpost',
    category: 'Health & Wellbeing',
    date: 'May 2026',
    location: 'Primary Health Center 12',
    shortDescription: 'Mobilization volunteers assisting medical staff in administering oral polio drops to children under 5 years.',
    fullDescription: 'Supporting the district health administration during the nationwide pulse polio campaign, NSS volunteers staffed 6 transit booths at railway junctions, bus depots, and community markets, ensuring 100% vaccination coverage.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    volunteersInvolved: 90,
    beneficiaries: '1,450 children immunized',
    highlights: [
      '6 strategic transit booths operated from 7 AM to 6 PM.',
      '1,450 infants and toddlers administered life-saving doses.',
      'Commended by Chief Medical Officer for zero-miss coverage.'
    ],
    featured: false,
    createdAt: '2026-05-30T00:00:00Z',
  }
];

const mockAchievements: (Achievement & { collegeId: string; createdAt: string })[] = [
  {
    id: 'ach-1',
    collegeId: 'unit-04-05',
    title: 'State Best NSS Unit Award 2025–26',
    year: '2026',
    category: 'Award',
    awardingBody: 'Ministry of Higher Education & State NSS Cell',
    description: 'Conferred with the prestigious State Governor Trophy in recognition of outstanding community welfare initiatives, watershed management, and record blood donation mobilization.',
    image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80',
    citation: 'For exceptional community mobilization, watershed desilting, and exemplary civic leadership.',
    createdAt: '2026-03-15T00:00:00Z',
  },
  {
    id: 'ach-2',
    collegeId: 'unit-04-05',
    title: 'National Republic Day Parade Selection',
    year: '2026',
    category: 'Recognition',
    awardingBody: 'Ministry of Youth Affairs and Sports, Govt. of India',
    description: 'Senior NSS Cadet Ms. Sneha Kulkarni was selected to represent the State Contingent at the National NSS Republic Day Parade Camp at Kartavya Path, New Delhi.',
    image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
    citation: 'Kartavya Path National NSS Contingent 2026 delegate.',
    createdAt: '2026-01-26T00:00:00Z',
  }
];

const mockGallery: (GalleryPhoto & { collegeId: string; createdAt: string })[] = [
  {
    id: 'gal-1',
    collegeId: 'unit-04-05',
    title: 'Shramdaan at Adopted Village Bund',
    category: 'Special Camp',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    date: 'Jan 2026',
    location: 'Shivapur Adopted Village',
    caption: 'Volunteers and villagers constructing stone percolation bunds.',
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'gal-2',
    collegeId: 'unit-04-05',
    title: 'Blood Donation Registration & Screening',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    date: 'Sep 2026',
    location: 'College Health Centre',
    caption: 'Volunteer testing hemoglobin prior to donation.',
    createdAt: '2026-09-02T00:00:00Z',
  },
  {
    id: 'gal-3',
    collegeId: 'unit-04-05',
    title: 'Green Campus Sapling Planting',
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    date: 'Jul 2026',
    location: 'East Campus Arboretum',
    caption: 'First-year cadets planting native medicinal saplings.',
    createdAt: '2026-07-15T00:00:00Z',
  }
];

const mockReports: (ReportItem & { collegeId: string; createdAt: string })[] = [
  {
    id: 'rep-1',
    collegeId: 'unit-04-05',
    title: 'Annual Activity Report 2025–26 (Complete Audit)',
    academicYear: '2025–26',
    category: 'Annual',
    datePublished: 'May 10, 2026',
    fileSize: '4.8 MB',
    pages: 42,
    preparedBy: 'Dr. Anand Verma, Programme Officer',
    description: 'Comprehensive institutional report detailing all 26 regular community initiatives, volunteer enrolment statistics, audited accounts, and community feedback.',
    downloadUrl: '/assets/sample-nss-annual-report.pdf',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'rep-2',
    collegeId: 'unit-04-05',
    title: '7-Day Special Winter Camp Monograph: Village Shivapur',
    academicYear: '2025–26',
    category: 'Special Camp',
    datePublished: 'Feb 15, 2026',
    fileSize: '6.2 MB',
    pages: 36,
    preparedBy: 'Special Camp Editorial Committee',
    description: 'Detailed photographic and empirical report covering rural sanitation survey, water conservation bund, health camp, and school educational workshops.',
    downloadUrl: '/assets/sample-special-camp-report.pdf',
    createdAt: '2026-02-15T00:00:00Z',
  }
];

const mockTeam: (TeamMember & { collegeId: string; createdAt: string })[] = [
  {
    id: 'tm-1',
    collegeId: 'unit-04-05',
    name: 'Dr. Anand Verma',
    designation: 'Programme Officer (Unit 04)',
    roleType: 'programme_officer',
    department: 'Department of Sociology & Social Work',
    bio: 'Associate Professor with 14 years of NSS mentoring experience. Recipient of the State Best NSS Programme Officer citation.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'anand.verma@college.edu.in',
    phone: '+91 98765 12345',
    badge: 'Programme Officer',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tm-2',
    collegeId: 'unit-04-05',
    name: 'Dr. Sunita Deshmukh',
    designation: 'Programme Officer (Unit 05 - Women Wing)',
    roleType: 'programme_officer',
    department: 'Department of Environmental Science',
    bio: 'Lead researcher in community health and waste management, steering green initiatives and gender equality outreach for 8 years.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'sunita.deshmukh@college.edu.in',
    phone: '+91 98765 67890',
    badge: 'Programme Officer',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tm-3',
    collegeId: 'unit-04-05',
    name: 'Pooja Sharma',
    designation: 'Student Volunteer Secretary',
    roleType: 'student_coordinator',
    department: 'B.Sc. Environmental Science, Final Year',
    bio: 'Led the village percolation bund project and coordinated youth blood donation drives.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    email: 'pooja.sharma@student.edu.in',
    badge: 'Student Coordinator',
    createdAt: '2026-01-10T00:00:00Z',
  }
];

const mockVolunteers: VolunteerApplication[] = [
  {
    id: 'vol-101',
    collegeId: 'unit-04-05',
    fullName: 'Rohan Deshmukh',
    dob: '2005-04-12',
    gender: 'Male',
    phone: '+91 98234 56789',
    email: 'rohan.deshmukh@student.edu.in',
    rollNumber: 'CS-2025-042',
    department: 'Computer Science & Engineering',
    academicYear: '1st Year',
    semester: '1st Semester',
    bloodGroup: 'O+',
    previousExperience: 'Active scout volunteer during high school with 40 hours of tree plantation.',
    skills: ['Web Development', 'Photography', 'First Aid'],
    motivation: 'I want to apply technology to help grassroots rural healthcare and complete the 240 mandatory service hours with diligence.',
    agreeToPledge: true,
    status: 'approved',
    submittedAt: '2026-09-01T10:30:00Z',
    reviewedBy: 'Dr. Anand Verma',
    reviewedAt: '2026-09-02T14:00:00Z',
    reviewNotes: 'Strong profile and technical skillset for documentation squad.',
  },
  {
    id: 'vol-102',
    collegeId: 'unit-04-05',
    fullName: 'Ananya Iyer',
    dob: '2006-01-18',
    gender: 'Female',
    phone: '+91 98456 12345',
    email: 'ananya.iyer@student.edu.in',
    rollNumber: 'ENG-2025-019',
    department: 'English & Mass Communication',
    academicYear: '1st Year',
    semester: '1st Semester',
    bloodGroup: 'B+',
    previousExperience: 'Taught primary school children at an NGO evening learning centre.',
    skills: ['Public Speaking', 'Social Media', 'Content Writing'],
    motivation: 'Desire to spearhead nutrition education drives for women and children in adopted villages.',
    agreeToPledge: true,
    status: 'pending',
    submittedAt: '2026-09-05T09:15:00Z',
  }
];

const mockContactMessages: ContactMessageRecord[] = [
  {
    id: 'msg-1',
    collegeId: 'unit-04-05',
    name: 'Suresh Patil',
    email: 'suresh.patil@redcross.org',
    subject: 'Blood Donation Camp Collaboration Request',
    category: 'Event Collaboration',
    message: 'Greetings from District Red Cross Society. We would like to partner with your NSS unit for our October National Voluntary Blood Donation Month drive.',
    status: 'read',
    submittedAt: '2026-09-04T11:20:00Z',
  }
];

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-06T15:30:00Z',
    actorEmail: 'programme.officer@college.edu.in',
    actorRole: 'admin',
    collegeId: 'unit-04-05',
    action: 'VOLUNTEER_APPROVED',
    domain: 'volunteers',
    details: 'Approved volunteer application for Rohan Deshmukh (CS-2025-042)',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-05T08:45:00Z',
    actorEmail: 'superadmin@nss-portal.gov.in',
    actorRole: 'superadmin',
    collegeId: 'unit-04-05',
    action: 'CONFIG_UPDATED',
    domain: 'settings',
    details: 'Updated campus contact details and annual motto verification.',
  }
];

// ----------------------------------------------------
// Google Sheets Service Implementation
// ----------------------------------------------------

export class SheetsService {
  /**
   * Fetch all records from a given sheet
   */
  public static async getRecords<T>(sheetName: string, collegeId?: string): Promise<T[]> {
    const cacheKey = `${sheetName}:${collegeId || 'all'}`;
    const cached = getFromCache<T[]>(cacheKey);
    if (cached) return cached;

    const sheets = getSheetsClient();
    if (!sheets) {
      // Return filtered mock data
      let result: unknown[] = [];
      switch (sheetName) {
        case 'Tenants':
          result = collegeId ? mockTenants.filter((t) => t.id === collegeId) : mockTenants;
          break;
        case 'Events':
          result = collegeId ? mockEvents.filter((e) => e.collegeId === collegeId) : mockEvents;
          break;
        case 'Activities':
          result = collegeId ? mockActivities.filter((a) => a.collegeId === collegeId) : mockActivities;
          break;
        case 'Achievements':
          result = collegeId ? mockAchievements.filter((a) => a.collegeId === collegeId) : mockAchievements;
          break;
        case 'Gallery':
          result = collegeId ? mockGallery.filter((g) => g.collegeId === collegeId) : mockGallery;
          break;
        case 'Reports':
          result = collegeId ? mockReports.filter((r) => r.collegeId === collegeId) : mockReports;
          break;
        case 'Team':
          result = collegeId ? mockTeam.filter((t) => t.collegeId === collegeId) : mockTeam;
          break;
        case 'Volunteers':
          result = collegeId ? mockVolunteers.filter((v) => v.collegeId === collegeId) : mockVolunteers;
          break;
        case 'ContactMessages':
          result = collegeId ? mockContactMessages.filter((c) => c.collegeId === collegeId) : mockContactMessages;
          break;
        case 'Users':
          result = collegeId ? mockUsers.filter((u) => u.collegeId === collegeId || u.role === 'superadmin') : mockUsers;
          break;
        case 'AuditLogs':
          result = collegeId ? mockAuditLogs.filter((l) => l.collegeId === collegeId) : mockAuditLogs;
          break;
        default:
          result = [];
      }
      setToCache(cacheKey, result as T[]);
      return result as T[];
    }

    // Google Sheets API Query
    return withRetry(async () => {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SERVER_CONFIG.google.sheetsDatabaseId,
        range: `${sheetName}!A2:Z1000`,
      });

      const rows = response.data.values || [];
      const parsed: unknown[] = rows.map((row) => {
        try {
          return JSON.parse(row[1]); // Second column contains JSON serialized object
        } catch {
          return null;
        }
      }).filter(Boolean);

      const filtered = collegeId
        ? parsed.filter((item: any) => !item.collegeId || item.collegeId === collegeId)
        : parsed;

      setToCache(cacheKey, filtered as T[]);
      return filtered as T[];
    });
  }

  /**
   * Get a single record by ID
   */
  public static async getRecordById<T extends { id: string }>(sheetName: string, id: string): Promise<T | null> {
    const records = await this.getRecords<T>(sheetName);
    return records.find((r) => r.id === id) || null;
  }

  /**
   * Add a new record
   */
  public static async addRecord<T extends { id?: string; collegeId?: string }>(sheetName: string, data: T): Promise<T> {
    const id = data.id || `${sheetName.toLowerCase().slice(0, 3)}-${Date.now()}`;
    const record = { ...data, id, createdAt: new Date().toISOString() };

    invalidateCache(sheetName);

    const sheets = getSheetsClient();
    if (!sheets) {
      // Add to mock store
      switch (sheetName) {
        case 'Tenants':
          mockTenants.push(record as unknown as TenantConfig);
          break;
        case 'Events':
          mockEvents.unshift(record as unknown as EventItem & { collegeId: string; createdAt: string });
          break;
        case 'Activities':
          mockActivities.unshift(record as unknown as Activity & { collegeId: string; createdAt: string });
          break;
        case 'Achievements':
          mockAchievements.unshift(record as unknown as Achievement & { collegeId: string; createdAt: string });
          break;
        case 'Gallery':
          mockGallery.unshift(record as unknown as GalleryPhoto & { collegeId: string; createdAt: string });
          break;
        case 'Reports':
          mockReports.unshift(record as unknown as ReportItem & { collegeId: string; createdAt: string });
          break;
        case 'Team':
          mockTeam.push(record as unknown as TeamMember & { collegeId: string; createdAt: string });
          break;
        case 'Volunteers':
          mockVolunteers.unshift(record as unknown as VolunteerApplication);
          break;
        case 'ContactMessages':
          mockContactMessages.unshift(record as unknown as ContactMessageRecord);
          break;
        case 'Users':
          mockUsers.push(record as unknown as User);
          break;
        case 'AuditLogs':
          mockAuditLogs.unshift(record as unknown as AuditLogEntry);
          break;
      }
      return record as T;
    }

    return withRetry(async () => {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SERVER_CONFIG.google.sheetsDatabaseId,
        range: `${sheetName}!A:B`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[id, JSON.stringify(record), new Date().toISOString()]],
        },
      });
      return record as T;
    });
  }

  /**
   * Update an existing record
   */
  public static async updateRecord<T extends { id: string }>(sheetName: string, id: string, data: Partial<T>): Promise<T | null> {
    invalidateCache(sheetName);

    const sheets = getSheetsClient();
    if (!sheets) {
      // Update in mock store
      const updateList = (list: any[]) => {
        const index = list.findIndex((item) => item.id === id);
        if (index === -1) return null;
        list[index] = { ...list[index], ...data, updatedAt: new Date().toISOString() };
        return list[index];
      };

      switch (sheetName) {
        case 'Tenants':
          return updateList(mockTenants) as T | null;
        case 'Events':
          return updateList(mockEvents) as T | null;
        case 'Activities':
          return updateList(mockActivities) as T | null;
        case 'Achievements':
          return updateList(mockAchievements) as T | null;
        case 'Gallery':
          return updateList(mockGallery) as T | null;
        case 'Reports':
          return updateList(mockReports) as T | null;
        case 'Team':
          return updateList(mockTeam) as T | null;
        case 'Volunteers':
          return updateList(mockVolunteers) as T | null;
        case 'ContactMessages':
          return updateList(mockContactMessages) as T | null;
        case 'Users':
          return updateList(mockUsers) as T | null;
        default:
          return null;
      }
    }

    // Google Sheets API: locate row and update
    return withRetry(async () => {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SERVER_CONFIG.google.sheetsDatabaseId,
        range: `${sheetName}!A2:B1000`,
      });
      const rows = response.data.values || [];
      const rowIndex = rows.findIndex((r) => r[0] === id);
      if (rowIndex === -1) return null;

      const existingData = JSON.parse(rows[rowIndex][1] || '{}');
      const updatedData = { ...existingData, ...data, updatedAt: new Date().toISOString() };

      const actualRowNumber = rowIndex + 2;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SERVER_CONFIG.google.sheetsDatabaseId,
        range: `${sheetName}!A${actualRowNumber}:B${actualRowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[id, JSON.stringify(updatedData)]],
        },
      });

      return updatedData as T;
    });
  }

  /**
   * Delete a record by ID
   */
  public static async deleteRecord(sheetName: string, id: string): Promise<boolean> {
    invalidateCache(sheetName);

    const sheets = getSheetsClient();
    if (!sheets) {
      const removeFromList = (list: any[]) => {
        const idx = list.findIndex((item) => item.id === id);
        if (idx !== -1) {
          list.splice(idx, 1);
          return true;
        }
        return false;
      };

      switch (sheetName) {
        case 'Events': return removeFromList(mockEvents);
        case 'Activities': return removeFromList(mockActivities);
        case 'Achievements': return removeFromList(mockAchievements);
        case 'Gallery': return removeFromList(mockGallery);
        case 'Reports': return removeFromList(mockReports);
        case 'Team': return removeFromList(mockTeam);
        case 'Volunteers': return removeFromList(mockVolunteers);
        case 'ContactMessages': return removeFromList(mockContactMessages);
        case 'Users': return removeFromList(mockUsers);
        default: return false;
      }
    }

    return withRetry(async () => {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SERVER_CONFIG.google.sheetsDatabaseId,
        range: `${sheetName}!A2:A1000`,
      });
      const rows = response.data.values || [];
      const rowIndex = rows.findIndex((r) => r[0] === id);
      if (rowIndex === -1) return false;

      const actualRowNumber = rowIndex + 2;
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SERVER_CONFIG.google.sheetsDatabaseId,
        range: `${sheetName}!A${actualRowNumber}:C${actualRowNumber}`,
      });
      return true;
    });
  }
}
