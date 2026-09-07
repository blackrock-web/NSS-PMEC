import React from 'react';
import { 
  Compass, Target, Award, CheckCircle2, Flag, 
  Clock, Users, BookOpen, ShieldCheck, HeartHandshake, ArrowRight 
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { NssLogo } from '../components/common/NssLogo';
import { SITE_CONFIG } from '../data/config';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const unitTimeline = [
    {
      year: '1974',
      title: 'Unit Inception at [COLLEGE NAME]',
      description: 'Formal constitution of NSS Unit with an initial sanctioned enrollment of 50 student volunteers under the State Directorate.'
    },
    {
      year: '1998',
      title: 'First Adopted Village Project',
      description: 'Initiated long-term rural immersion programs in neighboring peripheral villages, establishing regular literacy and sanitation camps.'
    },
    {
      year: '2012',
      title: 'Expansion to Double Units (Unit I & Unit II)',
      description: 'Sanctioned strength expanded to 500 volunteers across two coordinated units to accommodate growing interdisciplinary student interest.'
    },
    {
      year: '2019',
      title: 'Golden Jubilee Celebration & Mega Blood Drive',
      description: 'Celebrated 50 years of National Service Scheme with an institutional record collection of voluntary blood units and statewide youth rally.'
    },
    {
      year: '2025–26',
      title: 'State Best Unit Award & Green Campus Accolade',
      description: 'Conferred the State NSS Unit Citation for integrated watershed management, 500 native plantations, and rural school revitalization.'
    }
  ];

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen">
      {/* Page Hero Header */}
      <section className="bg-[#0B1F3A] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>INSTITUTIONAL CHARTER</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              About National Service Scheme
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Fostering social consciousness, youth leadership, and empathetic community service among students at {SITE_CONFIG.collegeName}.
            </p>
          </div>
        </div>
      </section>

      {/* 1 & 2: About NSS & College Unit */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FEE2E2] text-[#E63946] mb-3">
                <span>HISTORICAL BACKGROUND</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mb-4 leading-tight">
                National Service Scheme (NSS)
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                The National Service Scheme was formally launched on <strong>24th September 1969</strong>, the centenary year of the Father of the Nation, Mahatma Gandhi. Sponsored by the Ministry of Youth Affairs and Sports, Government of India, the scheme represents an educational experiment in community service and nation building.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                The cardinal premise of the scheme is that educational institutions cannot operate in isolation from the socio-economic realities of their surrounding society. Through continuous direct contact with rural and disadvantaged communities, student volunteers gain first-hand understanding of community challenges.
              </p>

              <div id="unit" className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-lg text-[#0B1F3A] mb-2">
                  Our Unit: {SITE_CONFIG.collegeName}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  The college operates two fully active units ({SITE_CONFIG.unitNumber}) under the jurisdiction of the State NSS Advisory Cell and affiliating University. With a registered cadre of over <strong>500 undergraduate volunteers</strong>, the unit represents arts, sciences, engineering, and commerce departments.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-slate-400 block font-normal">Supervising PO:</span>
                    <span className="text-slate-900">{SITE_CONFIG.programmeOfficerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Annual Required Hours:</span>
                    <span className="text-slate-900">120 Regular + 7-Day Camp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Emblem and Meaning */}
            <div className="bg-[#0B1F3A] text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col items-center text-center">
              <NssLogo size={96} />
              
              <div className="mt-6 text-xs uppercase tracking-widest text-[#E63946] font-bold">
                Symbol of Continuous Service
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1 mb-3">
                The Konark Sun Chariot Wheel
              </h3>
              
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
                The NSS emblem is based on the giant rath wheel of the world-famous Sun Temple at Konark, Odisha. The wheel portrays the cycle of creation, preservation, and release, and signifies the movement in life across time and space.
              </p>

              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-left border-t border-white/10 pt-6">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="text-[#E63946] font-bold text-xs">8 Main Spokes</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Signify the 24 hours of a day, reminding volunteers to be ready for service around the clock.
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="text-red-400 font-bold text-xs">NSS Red Color</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Represents youthful vigor, lively energy, and willingness to sacrifice for community good.
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="text-blue-300 font-bold text-xs">Navy Blue Ring</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Represents the vast cosmos of which NSS is a tiny part, ready to contribute its share to mankind.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3, 4, 5 & 6: Vision, Mission, Objectives & Motto */}
      <section id="vision" className="py-20 bg-[#F7F8FA] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="INSTITUTIONAL DIRECTIVES"
            title="Vision, Mission & Objectives"
            subtitle="The foundational philosophies guiding every project, camp, and social drive organized by our volunteers."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vision Card */}
            <div className="bg-white p-8 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0B1F3A] flex items-center justify-center mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Our Vision</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To build youth leaders imbued with Gandhian values of community brotherhood, ethical responsibility, and selfless civic consciousness, capable of steering transformative rural and urban development.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                Ethical Citizenship • Social Equality
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-8 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-red-50 text-[#E63946] flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Our Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To provide structured experiential learning platforms outside university lecture halls, enabling volunteers to identify community needs, mobilize civic partnerships, and implement sustainable community assets.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                Community Integration • Action-Oriented
              </div>
            </div>

            {/* Motto Card */}
            <div className="bg-[#0B1F3A] text-white p-8 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-white/10 text-[#E63946] flex items-center justify-center mb-6">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div className="text-xs uppercase tracking-widest text-[#E63946] font-bold">
                  Official Motto
                </div>
                <h3 className="text-2xl font-bold text-white font-serif mt-1 mb-3">
                  &quot;NOT ME BUT YOU&quot;
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  This succinct motto reflects the essence of democratic living and upholds the need for selfless service. It reminds us that the welfare of an individual is ultimately dependent on the welfare of society as a whole.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 text-xs text-slate-400">
                Selflessness • Collective Well-being
              </div>
            </div>
          </div>

          {/* 10 Principal Objectives Grid */}
          <div className="mt-12 bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/90 shadow-xs">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B1F3A] mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E63946]" />
              Core Educational Objectives for Enrolled Volunteers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Understand the community in which they work and understand themselves in relation to their community.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Identify the needs and problems of the community and involve themselves in problem-solving processes.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Develop among themselves a sense of social and civic responsibility.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Utilize knowledge in finding practical solutions to individual and community problems.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Acquire leadership qualities and democratic attitudes through consensus building.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Practice national integration and social harmony free from caste, creed, or regional prejudices.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7: Timeline of Unit Journey */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="LEGACY OF SERVICE"
            title="The Journey of Our NSS Unit"
            subtitle="Key milestones shaping the evolution of youth civic engagement on our campus over the decades."
            centered
          />

          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-32 space-y-10 py-4">
            {unitTimeline.map((item, index) => (
              <div key={index} className="relative pl-6 sm:pl-8 group">
                {/* Year Marker on Left for Desktop */}
                <div className="hidden sm:block absolute -left-32 top-0 text-right w-24">
                  <span className="text-base font-extrabold text-[#0B1F3A] group-hover:text-[#E63946] transition-colors">
                    {item.year}
                  </span>
                </div>

                {/* Circle Marker on the Line */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#0B1F3A] group-hover:border-[#E63946] transition-colors" />

                {/* Mobile Year Badge */}
                <div className="sm:hidden mb-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0B1F3A] text-white">
                    {item.year}
                  </span>
                </div>

                <div className="bg-[#F7F8FA] p-5 sm:p-6 rounded-xl border border-slate-200/80 group-hover:bg-white group-hover:shadow-md transition-all">
                  <h4 className="text-base sm:text-lg font-bold text-[#0B1F3A] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => onNavigate('/team')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0B1F3A] hover:bg-[#071526] text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>Meet the NSS Unit Leadership & Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
