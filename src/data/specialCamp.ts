export interface CampTimelineDay {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  timeSchedule: string;
  description: string;
  activities: string[];
  impact: string;
  image: string;
}

export const SPECIAL_CAMP_CONFIG = {
  title: '7-Day Special Winter Camp 2026',
  tagline: 'Seven days. One community. Countless stories.',
  theme: 'Youth for Sustainable Village Development & Environmental Regeneration',
  dates: '18 January 2026 – 24 January 2026',
  villageName: '[ADOPTED VILLAGE NAME]',
  gramPanchayat: '[GRAM PANCHAYAT NAME]',
  district: '[DISTRICT NAME], [STATE]',
  distanceFromCampus: '18 Kilometers from College Campus',
  volunteersEnrolled: 50,
  volunteerCount: 50,
  maleVolunteers: 26,
  femaleVolunteers: 24,
  programmeOfficer: '[PROGRAMME OFFICER NAME]',
  sarpanchName: '[VILLAGE SARPANCH / HEAD NAME]',
  overview: 'The 7-Day Residential Special Camp is the heart of the National Service Scheme. Fifty selected student volunteers lived together in the rural heartland of [ADOPTED VILLAGE NAME], away from modern campus comforts, to participate in grassroots community mobilization, water stewardship, school revitalization, and civic health advocacy.',
  objectives: [
    'Enable university students to understand the socioeconomic realities of rural India through immersive living.',
    'Execute permanent community assets including water bunds and community library corners.',
    'Conduct scientifically structured household health, sanitation, and literacy surveys.',
    'Cultivate collective civic responsibility, self-discipline, and democratic problem-solving.'
  ],
  villageStats: [
    { label: 'Total Households', value: '142' },
    { label: 'Target Population', value: '680+' },
    { label: 'Primary Schools', value: '01' },
    { label: 'Anganwadi Centers', value: '02' }
  ],
  outcomes: [
    {
      title: 'Water Retention Bund',
      description: 'Engineered a 35-meter loose stone check dam to slow monsoon stream run-off and recharge surrounding water tables.',
      metric: '35m Check Dam'
    },
    {
      title: 'Household Needs Audit',
      description: 'Collected comprehensive family demographic data covering drinking water, toilets, immunization, and schooling.',
      metric: '102 Households'
    },
    {
      title: 'Geriatric & Child Clinic',
      description: 'Partnered with District Hospital to conduct eye refraction, blood sugar tests, and distribute reading glasses.',
      metric: '280 Patients Treated'
    },
    {
      title: 'School Learning Corner',
      description: 'Refurbished village school library, painted interactive learning murals, and handed over curriculum kits.',
      metric: '400 Books Cataloged'
    }
  ],
  campOutcomes: [
    { metric: '35m', label: 'Boulder check dam constructed to replenish 4 shallow irrigation wells' },
    { metric: '102', label: 'Households surveyed for civic amenities, health, and schooling access' },
    { metric: '280', label: 'Villagers examined at free medical & ophthalmology consultation' },
    { metric: '150', label: 'Native fruit & shade saplings planted with tree guards' },
    { metric: '400', label: 'Books cataloged into newly renovated community school library' }
  ],
  testimonials: [
    {
      quote: 'The student volunteers worked with their bare hands in the sun alongside our local youth. The water check dam they constructed has already started storing runoff, which will help our cattle throughout the dry summer.',
      author: '[NAME OF VILLAGE SARPANCH]',
      role: 'Head / Sarpanch, Adopted Gram Panchayat'
    },
    {
      quote: 'Living in the village without internet and high-tech distractions taught me that real education begins where classroom lectures end. The unconditional love and trust from the villagers transformed my perspective on life.',
      author: '[STUDENT VOLUNTEER NAME]',
      role: 'Student Volunteer & Camp Logistic Lead'
    }
  ],
  timeline: [
    {
      dayNumber: 1,
      date: '18 January 2026',
      title: 'Arrival, Camp Pitching & Gram Sabha Assembly',
      theme: 'Arrival, Camp Setup & Village Trust Building',
      timeSchedule: '07:00 AM – 09:30 PM',
      description: 'Volunteers arrived at the village community center, pitched lodging arrangements, and participated in ceremonial camp flag hoisting. An evening Gram Sabha was convened with the Village Sarpanch and elders to outline the weekly civic agenda.',
      activities: [
        'NSS Flag Hoisting & Camp Anthem recitation',
        'Camp rules orientation and squad duty allocations (Kitchen, Shramdaan, Survey, Cultural)',
        'Joint Gram Sabha meeting with Village Elders and Panchayat Representatives'
      ],
      impact: 'Secured community consensus and finalized project sites for watershed shramdaan.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80'
    },
    {
      dayNumber: 2,
      date: '19 January 2026',
      title: 'Comprehensive Socioeconomic & Health Survey',
      theme: 'Demographic Mapping & Household Need Assessment',
      timeSchedule: '06:00 AM – 09:00 PM',
      description: 'Divided into 10 multidisciplinary volunteer squads, students fanned out across 4 wards to conduct door-to-door surveys recording data on sanitation access, drinking water, child immunization, and girl-child education.',
      activities: [
        'Morning physical fitness drill and yoga warmups',
        'Administering standardized 24-point household questionnaire to 102 families',
        'Compilation and digital tabulation of village development indices'
      ],
      impact: 'Survey findings recorded 102 households and revealed localized runoff challenges.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
    },
    {
      dayNumber: 3,
      date: '20 January 2026',
      title: 'Swachhata Abhiyan & Watershed Shramdaan',
      theme: 'Swachhata, Water Harvesting & Physical Labor',
      timeSchedule: '06:00 AM – 08:30 PM',
      description: 'A 5-hour collective manual labor session was carried out along the seasonal village stream. Volunteers cleared plastic debris and weeds, and began laying stones for the 35-meter check dam.',
      activities: [
        'Removal of invasive weeds and accumulated plastic from village perimeter canal',
        'Collection and manual stacking of rocks for loose-boulder check bund',
        'Digging 4 soak-pits near community public water standposts'
      ],
      impact: 'Built 35m loose-stone check dam structure and excavated 4 community soak-pits.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80'
    },
    {
      dayNumber: 4,
      date: '21 January 2026',
      title: 'General Health, Geriatric & Eye Checkup Clinic',
      theme: 'Preventive Healthcare, Geriatric Screening & Nutrition',
      timeSchedule: '06:00 AM – 09:00 PM',
      description: 'Collaborating with the District Hospital medical team, volunteers transformed the village school into a multi-counter clinical station with doctors conducting health screenings, blood pressure, and vision refraction.',
      activities: [
        'Registration and preliminary vital signs screening of 280 villagers',
        'Ophthalmologist consultations with free reading glasses distribution for 65 elders',
        'Counseling session for adolescent girls on menstrual hygiene and subsidized sanitary pads'
      ],
      impact: '280 villagers received consultation; 14 cataract patients referred for free surgery.',
      image: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&w=1000&q=80'
    },
    {
      dayNumber: 5,
      date: '22 January 2026',
      title: 'Primary School Mentorship & STEM Learning Corner',
      theme: 'Foundational Learning, Science Experiments & Digital Literacy',
      timeSchedule: '06:30 AM – 09:00 PM',
      description: 'Volunteers took over interactive learning sessions at the Government Primary School, conducting hands-on science experiments, basic smartphone safety lessons, and creative arts workshops.',
      activities: [
        'Hands-on science demonstrations (solar cooker principles, water filtration model)',
        'Renovation and color-coding of 400 books for the primary school library',
        'Cyber safety and digital payment (UPI) awareness demonstration for village youth'
      ],
      impact: 'Equipped village school with cataloged library and provided 85 student kits.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80'
    },
    {
      dayNumber: 6,
      date: '23 January 2026',
      title: 'Women Empowerment Conclave & Folk Heritage Festival',
      theme: 'Folk Heritage, Gender Equity & Self-Help Groups',
      timeSchedule: '06:30 AM – 10:00 PM',
      description: 'An evening community cultural festival brought together 300+ villagers in the Panchayat courtyard, featuring performances on financial inclusion, self-help groups, and environmental harmony.',
      activities: [
        'Interactive workshop with 3 village Women Self-Help Groups (SHGs) on packaging & branding',
        'Street plays addressing superstition, domestic peace, and girl-child education',
        'Folk music performance uniting collegiate youth and rural traditional musicians'
      ],
      impact: 'Strengthened self-help group microenterprise marketing and village unity.',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80'
    },
    {
      dayNumber: 7,
      date: '24 January 2026',
      title: 'Valedictory Assembly, Survey Handover & Departure',
      theme: 'Reflection, Community Feedback & Resolution',
      timeSchedule: '07:00 AM – 04:00 PM',
      description: 'The closing valedictory was graced by the College Principal, Local Panchayat officials, and village elders. The NSS unit formally presented the Village Socioeconomic Survey Report to the Panchayat.',
      activities: [
        'Presentation of Village Survey Dossier and asset handover to Panchayat representatives',
        'Felicitation of village community helpers and camp squad leaders',
        'Plantation of the memorial "NSS Smriti Vatika" grove before departure'
      ],
      impact: 'Adopted village partnership ratified for ongoing student weekend monitoring.',
      image: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=1000&q=80'
    }
  ]
};
