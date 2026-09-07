import { Activity } from '../types';

export const ACTIVITIES_DATA: Activity[] = [
  {
    id: 'act-1',
    slug: 'mega-tree-plantation-drive',
    title: 'Mission Harit: 500 Saplings Plantation Drive',
    category: 'Environment',
    date: '12 Aug 2026',
    location: 'College Campus & Adopted Village Green Belt',
    shortDescription: 'NSS volunteers spearheaded an extensive native species afforestation initiative, planting neem, peepal, and fruit-bearing saplings with geo-tagged tree guards.',
    fullDescription: 'Under the Green Campus Charter, 120 NSS student volunteers collaborated with the State Forest Department to plant 500 indigenous trees. Each volunteer adopted three saplings with an accountability commitment for 12 months of irrigation and nurturing. The drive was inaugurated with an environmental sensitization rally emphasizing groundwater recharge and biodiversity conservation.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    volunteersInvolved: 120,
    beneficiaries: '3,000+ residents & student community',
    highlights: [
      '500 native saplings planted with protective bamboo tree guards',
      'Installed drip watering markers across barren campus borders',
      'Awareness distribution of seed balls to 400 school students'
    ],
    reportPdfUrl: '#',
    featured: true
  },
  {
    id: 'act-2',
    slug: 'annual-blood-donation-lifeline',
    title: 'Raktdaan Mahadan: Mega Blood Donation Camp',
    category: 'Health & Wellbeing',
    date: '14 Jun 2026',
    location: 'Auditorium Foyer, Main Campus',
    shortDescription: 'Organized in partnership with the Government District Blood Bank and Red Cross Society, collecting crucial units for thalassemia and emergency care.',
    fullDescription: 'In commemoration of World Blood Donor Day, the NSS unit coordinated a state-certified voluntary blood collection camp. Strict pre-donation medical screenings (hemoglobin, blood pressure, BMI) were conducted by certified hematology teams. Over 180 eligible units were collected, alongside donor pledge cards distribution.',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    volunteersInvolved: 45,
    beneficiaries: '185 units collected for District Hospital',
    highlights: [
      '185 blood units certified and transferred safely',
      'Pre-donation awareness session conducted on nutrition & anemia',
      'Digital donor registry created for rare blood group emergency roster'
    ],
    reportPdfUrl: '#',
    featured: true
  },
  {
    id: 'act-3',
    slug: 'gyaan-jyoti-village-literacy',
    title: 'Project Gyaan: Remedial Math & Reading Circle',
    category: 'Education',
    date: '28 Jul 2026',
    location: 'Government Primary School, Adopted Village',
    shortDescription: 'Weekly student-led mentorship focusing on foundational numeracy, digital literacy basics, and library book distribution for rural children.',
    fullDescription: 'Volunteer tutors conducted an interactive 4-week weekend bridge course for 85 underprivileged students. Using visual storytelling, math puzzles, and phonics workbooks, the program bridged curriculum learning gaps. The unit also established a 400-book lending repository inside the village community center.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    volunteersInvolved: 35,
    beneficiaries: '85 primary schoolchildren & parents',
    highlights: [
      'Distributed 85 school stationary kits and curated reading primers',
      'Set up permanent "NSS Bal Pustakalaya" (Children Book Corner)',
      'Held interactive storytelling and solar system science workshop'
    ],
    reportPdfUrl: '#',
    featured: false
  },
  {
    id: 'act-4',
    slug: 'gram-swaraj-sanitation-drive',
    title: 'Swachhata Pakhwada: Village Water & Waste Audit',
    category: 'Community Development',
    date: '02 Oct 2026',
    location: 'Adopted Village Ward 3 & 4',
    shortDescription: 'Comprehensive door-to-door sanitation survey, soak-pit construction, and single-use plastic segregation drives in rural households.',
    fullDescription: 'As part of the Swachh Bharat Abhiyan fortnight, volunteers executed a community sanitation campaign. The team dug 6 recharge soak-pits near public water taps to eliminate stagnant runoff, painted pictorial hygiene guidelines on community walls, and gathered 320 kg of discarded non-biodegradable waste.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    volunteersInvolved: 80,
    beneficiaries: '450 rural households',
    highlights: [
      'Constructed 6 community drainage soak-pits',
      'Collected and handed over 320 kg segregated plastic to recycling unit',
      'Distributed 500 cotton tote bags made by rural women self-help groups'
    ],
    reportPdfUrl: '#',
    featured: false
  },
  {
    id: 'act-5',
    slug: 'suraksha-road-safety-campaign',
    title: 'Suraksha: Road Safety & Helmet Awareness Campaign',
    category: 'Social Awareness',
    date: '18 Jan 2026',
    location: 'National Highway Junction & College Outer Ring',
    shortDescription: 'In conjunction with District Traffic Police, volunteers demonstrated emergency CPR drills, distributed reflector stickers, and conducted street plays.',
    fullDescription: 'Addressing commuter safety on high-traffic highway intersections, 60 NSS volunteers performed street theatre (Nukkad Natak) on speeding, helmet compliance, and good Samaritan emergency protocols. Over 250 slow-moving vehicles and bicycles were fitted with high-visibility prismatic retro-reflective tape.',
    image: 'https://images.unsplash.com/photo-1570126618953-d437176e8c79?auto=format&fit=crop&w=1200&q=80',
    volunteersInvolved: 60,
    beneficiaries: '1,200+ motorists & pedestrians reached',
    highlights: [
      'Street theatre staged at 4 key urban intersections',
      'Fixed retro-reflective safety stickers on 250 cycles and carts',
      'Demonstrated hands-only CPR basics to public onlookers'
    ],
    reportPdfUrl: '#',
    featured: false
  },
  {
    id: 'act-6',
    slug: 'ek-bharat-shreshtha-bharat',
    title: 'Ek Bharat Shreshtha Bharat: National Unity Rally',
    category: 'National Integration',
    date: '31 Oct 2026',
    location: 'Town Hall to College Quadrangle',
    shortDescription: 'Unity march, constitution pledge reading, and cultural exchange exhibition celebrating diverse regional traditions and civil harmony.',
    fullDescription: 'To celebrate National Unity Day (Rashtriya Ekta Diwas), 150 volunteers organized a 4-kilometer awareness march carrying national flags and placards on democratic ideals. The rally concluded with a multilingual cultural symposium featuring folk performances from partner states and a collective citizenship pledge.',
    image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    volunteersInvolved: 150,
    beneficiaries: 'General public & 1,500 collegiate students',
    highlights: [
      'Massive 4-km Unity March with 150 volunteers and faculty',
      'Reading of the Preamble to the Constitution in 3 regional languages',
      'Exhibition highlighting Sardar Patel contribution and civil ethics'
    ],
    reportPdfUrl: '#',
    featured: false
  },
  {
    id: 'act-7',
    slug: 'anti-substance-abuse-drive',
    title: 'Nasha Mukt Bharat: Youth Anti-Drug Pledge & Rally',
    category: 'Social Awareness',
    date: '26 Jun 2026',
    location: 'College Auditorium & Student Hostels',
    shortDescription: 'Interactive counseling seminar with psychologists and student oath-taking ceremony promoting mental health resilience and substance-free campuses.',
    fullDescription: 'Collaborating with the State Mental Health Institute, this awareness convention equipped students with peer-support counseling strategies. Posters highlighting helpline numbers were affixed across all college hostels and cafeteria notice boards.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    volunteersInvolved: 70,
    beneficiaries: '800 college students',
    highlights: [
      'Guest lecture by Clinical Psychiatrist on stress management',
      'Signage board installed across 6 college hostel blocks',
      'Interactive anonymous Q&A box for student guidance'
    ],
    reportPdfUrl: '#',
    featured: false
  },
  {
    id: 'act-8',
    slug: 'poshan-abhiyan-nutrition-camp',
    title: 'Poshan Maah: Maternal & Child Nutrition Workshop',
    category: 'Health & Wellbeing',
    date: '19 Sep 2026',
    location: 'Anganwadi Center, Adopted Village',
    shortDescription: 'Nutritional recipe demonstrations using affordable millets, iron-folic acid awareness, and height-weight health indexing for infants.',
    fullDescription: 'In observance of National Nutrition Month, female NSS volunteers partnered with rural Anganwadi health workers to conduct live culinary demonstrations on nutrient-dense indigenous grains like Ragi and Bajra for expectant and lactating mothers.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    volunteersInvolved: 30,
    beneficiaries: '95 mothers and infants',
    highlights: [
      'Live demonstration of 4 millet-based high-iron recipes',
      'Free distribution of fortified health mix packets',
      'Growth monitoring chart updates for 45 toddlers'
    ],
    reportPdfUrl: '#',
    featured: false
  }
];
