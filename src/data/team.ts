import { TeamMember } from '../types';

export const TEAM_DATA: TeamMember[] = [
  // College Leadership
  {
    id: 'lead-1',
    name: 'Dr. [PRINCIPAL NAME]',
    designation: 'Principal & Patron, NSS Advisory Board',
    roleType: 'leadership',
    department: 'Office of the Principal, [COLLEGE NAME]',
    bio: 'Guiding the institution with a commitment to academic excellence, ethical stewardship, and community citizenship. Oversees the NSS Advisory Committee to ensure civic engagement aligns with higher education values.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'principal@[college].edu.in',
    badge: 'Patron'
  },
  {
    id: 'lead-2',
    name: 'Prof. [DEAN NAME]',
    designation: 'Dean of Student Welfare & Co-Chairman',
    roleType: 'leadership',
    department: 'Deanery of Student Affairs',
    bio: 'Promotes holistic student leadership, civic consciousness, and extracurricular development. Mentors volunteer initiatives across cross-disciplinary academic streams.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    email: 'dsw@[college].edu.in',
    badge: 'Co-Chairman'
  },

  // Programme Officers
  {
    id: 'po-1',
    name: 'Dr. [PROGRAMME OFFICER NAME]',
    designation: 'NSS Programme Officer (Unit I)',
    roleType: 'programme_officer',
    department: 'Department of Humanities & Social Sciences',
    bio: 'Trained at the Empanelled Training Institution (ETI), Ministry of Youth Affairs & Sports. Directs annual regular activities, adopted village special camps, and state NSS council liaisons with 8+ years of youth leadership experience.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: 'po.nss@[college].edu.in',
    phone: '+91 [OFFICIAL EXTENSION]',
    badge: 'Unit I Officer'
  },
  {
    id: 'po-2',
    name: 'Prof. [ASST. PO NAME]',
    designation: 'Assistant Programme Officer (Unit II)',
    roleType: 'programme_officer',
    department: 'Department of Life Sciences',
    bio: 'Coordinates health camps, environmental drives, and Red Ribbon Club (RRC) youth awareness cells. Facilitates volunteer documentation, university audits, and camp logistics.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'asstpo.nss@[college].edu.in',
    phone: '+91 [OFFICIAL EXTENSION]',
    badge: 'Unit II Officer'
  },

  // Student Coordinators
  {
    id: 'sc-1',
    name: '[STUDENT COORDINATOR NAME]',
    designation: 'Lead Student Coordinator',
    roleType: 'student_coordinator',
    department: 'Final Year, B.Tech / B.Sc Computer Science',
    bio: 'National Integration Camp (NIC) delegate with 240+ completed volunteer hours. Leads overall volunteer mobilization, project execution, and inter-unit synchronization.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    badge: 'Overall Lead'
  },
  {
    id: 'sc-2',
    name: '[DEPUTY COORDINATOR NAME]',
    designation: 'Deputy Student Coordinator (Female Wing)',
    roleType: 'student_coordinator',
    department: 'Third Year, Department of Economics',
    bio: 'Spearheads women empowerment workshops, girl-child literacy drives, and POSHAN Abhiyan initiatives across outreach villages.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    badge: 'Social Outreach'
  },
  {
    id: 'sc-3',
    name: '[LOGISTICS HEAD NAME]',
    designation: 'Logistics & Camp Quartermaster',
    roleType: 'student_coordinator',
    department: 'Final Year, Department of Mechanical Engineering',
    bio: 'Coordinates transport, first aid supplies, camp gear, and on-ground field shramdaan equipment for rural camps and blood donation setups.',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
    badge: 'Logistics & Operations'
  },
  {
    id: 'sc-4',
    name: '[DOCUMENTATION HEAD NAME]',
    designation: 'Media, PR & Documentation Secretary',
    roleType: 'student_coordinator',
    department: 'Third Year, Department of Media & Communication',
    bio: 'Manages official photography, activity press releases, social channels, and compiles the annual NSS Unit Dossier and University Quarterly Reports.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    badge: 'Documentation & Media'
  }
];
