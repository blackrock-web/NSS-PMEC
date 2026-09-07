import { EventItem } from '../types';

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'evt-1',
    slug: 'mega-blood-donation-camp-2026',
    title: 'Voluntary Blood Donation & Thalassemia Screening Camp',
    category: 'Health & Wellbeing',
    date: '12 Sep 2026',
    day: '12',
    month: 'SEP',
    year: '2026',
    time: '09:30 AM – 03:30 PM',
    location: 'Main College Auditorium & Medical Center',
    status: 'upcoming',
    heroImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1400&q=80',
    shortDescription: 'Annual blood donation drive in partnership with District Hospital Blood Bank. Open to all students, staff, and faculty above 18 years meeting health parameters.',
    fullDescription: 'The NSS Unit of [COLLEGE NAME] is organizing its flagship Annual Blood Donation Camp in technical collaboration with the District Red Cross Society and Government Medical College. Every unit collected directly benefits trauma cases, cancer patients, and pediatric thalassemia care in the district. Certified medical officers will supervise donor health vitals, hemoglobin levels, and hydration before collection. Refreshments, donor recognition certificates, and emergency donor cards will be provided.',
    objectives: [
      'Collect 200+ units of voluntary, safe, unremunerated blood for the district bank',
      'Conduct free preliminary blood grouping and hemoglobin screening for 350+ students',
      'Dispel medical myths surrounding blood donation through peer counselors',
      'Enlist voluntary donors in a rapid-response emergency rare-blood-group registry'
    ],
    registrationOpen: true,
    impactStats: [
      { label: 'Target Units', value: '200+ Units' },
      { label: 'Screening Doctors', value: '06 Certified' },
      { label: 'Volunteers on Duty', value: '45 Volunteers' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80'
    ],
    reportAvailable: false
  },
  {
    id: 'evt-2',
    slug: 'nss-foundation-day-celebration-2026',
    title: '57th NSS Foundation Day & Social Impact Conclave',
    category: 'National Integration',
    date: '24 Sep 2026',
    day: '24',
    month: 'SEP',
    year: '2026',
    time: '10:00 AM – 01:30 PM',
    location: 'Dr. Radhakrishnan Seminar Hall',
    status: 'upcoming',
    heroImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
    shortDescription: 'Commemoration of NSS Foundation Day (launched 1969 Gandhi Centenary). Includes pledge reaffirmation, alumni volunteer keynotes, and annual merit badges.',
    fullDescription: 'NSS was officially launched on 24th September 1969, during Mahatma Gandhi’s centenary year. To honor this legacy of youth civic engagement, the unit will host its 57th Foundation Day commemoration. The convention brings together college leadership, former program officers, distinguished community workers, and enrolled student volunteers to assess civic progress and inaugurate the 2026–27 social outreach charter.',
    objectives: [
      'Reaffirm the national NSS pledge "Not Me But You" across all registered volunteers',
      'Confer Best Volunteer Badges and Leadership Honors for the 2025–26 academic term',
      'Keynote symposium on "Youth Leadership in Sustainable Rural Transformation"',
      'Launch of the digital student volunteer hours portal'
    ],
    registrationOpen: true,
    impactStats: [
      { label: 'Expected Delegates', value: '350+ Students' },
      { label: 'Awards to Confer', value: '18 Honors' },
      { label: 'Keynote Speakers', value: '03 Dignitaries' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
    ],
    reportAvailable: false
  },
  {
    id: 'evt-3',
    slug: 'gandhi-jayanti-swachhata-pakhwada',
    title: 'Swachh Bharat Abhiyan: Campus & Heritage Cleanliness Drive',
    category: 'Community Development',
    date: '02 Oct 2026',
    day: '02',
    month: 'OCT',
    year: '2026',
    time: '07:30 AM – 11:30 AM',
    location: 'District Heritage Park & Outer Ring Canal',
    status: 'upcoming',
    heroImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1400&q=80',
    shortDescription: 'Community shramdaan (voluntary labor) dedicated to wetland waste clearing, wall art murals on civic duties, and ban on single-use plastics advocacy.',
    fullDescription: 'In commemoration of the birth anniversary of Mahatma Gandhi and Lal Bahadur Shastri, 100+ volunteers will participate in a structured four-hour shramdaan drive. Activities center on clearing accumulated microplastics along the perimeter canal, setting up organic compost pits, and painting bilingual environmental slogans on public walls with permission from municipal authorities.',
    objectives: [
      'Execute 4 hours of dedicated shramdaan across public waterbody precincts',
      'Divert recyclable waste to certified municipal processing centers',
      'Install 10 segregated dry and wet collection bins fabricated from recycled drums',
      'Conduct street pledge on minimizing single-use polymer containers'
    ],
    registrationOpen: true,
    impactStats: [
      { label: 'Volunteers Enlisted', value: '110+' },
      { label: 'Area Covered', value: '3.2 km²' },
      { label: 'Expected Collection', value: '400+ kg Waste' }
    ],
    gallery: [],
    reportAvailable: false
  },
  {
    id: 'evt-4',
    slug: 'rural-health-and-geriatric-clinic',
    title: 'Gram Arogya: Free Geriatric & Vision Clinic',
    category: 'Health & Wellbeing',
    date: '15 Nov 2026',
    day: '15',
    month: 'NOV',
    year: '2026',
    time: '09:00 AM – 04:00 PM',
    location: 'Adopted Village Primary Health Sub-Center',
    status: 'upcoming',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
    shortDescription: 'Multi-specialty primary health checkups, refractive eye examinations, and free spectacle distributions for senior rural citizens.',
    fullDescription: 'Organized with regional ophthalmologists and general physicians, this day-long outreach clinic screens rural elders for hypertension, diabetes, and cataract onset. Volunteers assist in digital case logging, vision acuity charts, and distributing prescribed basic medicines under physician supervision.',
    objectives: [
      'Screen 250+ rural elderly residents for visual impairment and chronic conditions',
      'Distribute 100+ free custom prescription spectacles following refraction checks',
      'Provide referral tokens for subsidized cataract surgeries at base hospital'
    ],
    registrationOpen: true,
    impactStats: [
      { label: 'Target Patients', value: '250+' },
      { label: 'Free Spectacles', value: '100 Pairs' },
      { label: 'Specialist MDs', value: '05 Doctors' }
    ],
    gallery: [],
    reportAvailable: false
  },
  {
    id: 'evt-5',
    slug: 'special-camp-2026-winter',
    title: 'Annual 7-Day Residential Special Camp 2026',
    category: 'Special Camp',
    date: '18 Jan – 24 Jan 2026',
    day: '18',
    month: 'JAN',
    year: '2026',
    time: 'Full Residential (7 Days)',
    location: 'Adopted Village [VILLAGE NAME], District [DISTRICT]',
    status: 'past',
    heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80',
    shortDescription: 'Fifty selected NSS volunteers resided in the adopted village for a transformative 7-day immersion focusing on water conservation, literacy, and health surveys.',
    fullDescription: 'The 7-Day Special Camp serves as the crucible of NSS character building. Volunteers lived in the village community center, observing disciplined dawn drills, yoga sessions, community shramdaan, door-to-door socioeconomic household surveys, and nightly cultural harmony rallies. Major physical outputs included constructing two check dams for percolation and renovating the village primary school library.',
    objectives: [
      'Immerse 50 collegiate youth in rural socioeconomic realities and self-reliance',
      'Complete comprehensive 100-household demographic and civic amenities survey',
      'Construct a seasonal boulder percolation bund to replenish village tubewells',
      'Organize nightly cultural programs addressing social taboos and female literacy'
    ],
    activitiesConducted: [
      'Inauguration by Village Sarpanch and College Principal',
      'Demographic & healthcare survey covering 102 households',
      'Construction of 35-meter loose boulder water bund on local nullah',
      'Free general health and pediatric checkup camp benefiting 280 villagers',
      'Wall paintings on Beti Bachao Beti Padhao at the Panchayat Bhawan',
      'Nightly folk drama and awareness street plays by NSS cultural troupe',
      'Valedictory session with village elders and token presentation to school'
    ],
    impactStats: [
      { label: 'Households Surveyed', value: '102 Families' },
      { label: 'Check Dam Built', value: '35 m Length' },
      { label: 'Patients Treated', value: '280 Villagers' },
      { label: 'Trees Planted', value: '150 Saplings' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    ],
    reportAvailable: true,
    registrationOpen: false
  },
  {
    id: 'evt-6',
    slug: 'international-yoga-day-2026',
    title: 'International Day of Yoga: Mindful Campus Assembly',
    category: 'Health & Wellbeing',
    date: '21 Jun 2026',
    day: '21',
    month: 'JUN',
    year: '2026',
    time: '06:30 AM – 08:30 AM',
    location: 'College Sports Ground & Indoor Stadium',
    status: 'past',
    heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80',
    shortDescription: 'Mass demonstration of Common Yoga Protocol (CYP) by 400+ volunteers, faculty, and local community members under certified instructors.',
    fullDescription: 'Promoting holistic mental resilience, physical fitness, and stress relief for collegiate youth, the NSS unit conducted a mass sunrise yoga session following the Ministry of AYUSH Common Yoga Protocol. Sessions included pranayama breathwork, asanas, and guided dhyana meditation.',
    objectives: [
      'Promote daily yoga practice for academic stress mitigation',
      'Demonstrate standardized AYUSH Common Yoga Protocol asanas',
      'Distribute bilingual booklets on dietary guidelines and yogic routines'
    ],
    activitiesConducted: [
      'Warmup sukshma vyayama followed by standing & sitting asanas',
      'Specialized pranayama guidance (Anulom Vilom, Bhramari)',
      'Closing meditation and Shanti mantra recitation',
      'Healthy breakfast distribution with sprouts and herbal tea'
    ],
    impactStats: [
      { label: 'Participants', value: '420+' },
      { label: 'Certified Trainers', value: '04 Instructors' },
      { label: 'Instruction Duration', value: '120 Minutes' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    ],
    reportAvailable: true,
    registrationOpen: false
  }
];
