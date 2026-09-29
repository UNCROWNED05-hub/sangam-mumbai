import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { ArrowLeft, Shield, FileText, CheckCircle2 } from 'lucide-react';

export const InfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageContent = () => {
    switch (location.pathname) {
      case '/safety':
        return {
          title: 'Safety Guidelines & Public Protocol',
          desc: 'How Sangam is architected from day one to guarantee secure, transparent real-world meetups.',
          sections: [
            {
              h: '1. Always in Verified Public Places',
              p: 'Every plan on Sangam must be hosted in an open, verifiable public place: municipal parks, sports turfs, beach promenades, verified cafes, or heritage libraries. Private residence plans are disallowed by the network protocol.',
            },
            {
              h: '2. Real Names & Verified Identities',
              p: 'Profiles require authentic first names and identity verification badges. You can inspect who is in any plan before committing to step out of your door.',
            },
            {
              h: '3. Group Dynamics First',
              p: 'Plans are designed around shared activities and group tables (3 to 20 people), eliminating 1-on-1 pressure and fostering natural, low-stakes friendship.',
            },
            {
              h: '4. Instant One-Tap Report & Block',
              p: 'If any participant displays inappropriate behavior, you can report them directly from the plan sheet or chat room. Moderation actions occur within minutes.',
            }
          ]
        };
      case '/guidelines':
        return {
          title: 'Community Code of Conduct',
          desc: 'The principles that keep our public gatherings fun, warm, and welcoming for everyone.',
          sections: [
            {
              h: 'Show Up When You Commit',
              p: 'Hosts book courts, reserve tables, and bring equipment. If you cannot attend, please hit Leave at least 30 minutes in advance so waitlisted neighbors can take your spot.',
            },
            {
              h: 'Zero Pitching, Zero Solicitation',
              p: 'Sangam is a sanctuary from corporate networking and multi-level pitches. Meet as human beings sharing a common passion for sports, books, or chai.',
            },
            {
              h: 'Inclusivity for Beginners',
              p: 'Whether it is someone’s first time picking up a badminton racket or joining a sketchwalk, welcome every explorer with generosity.',
            }
          ]
        };
      default:
        return {
          title: 'Terms of Service & Privacy Architecture',
          desc: 'Zero user tracking, zero data sales, zero intrusive advertising feeds.',
          sections: [
            {
              h: 'Privacy First',
              p: 'We do not sell your personal data, location telemetry, or contact information. Location permissions are used solely to place you accurately on your local map.',
            },
            {
              h: 'Invisible Mode',
              p: 'You can toggle Invisible Mode at any moment in your profile to browse plans anonymously without broadcasting your presence on the map.',
            },
            {
              h: 'Content & Moderation Policy',
              p: 'We maintain zero tolerance for harassment, hate speech, or commercial spam. Violations result in immediate hardware-level suspension.',
            }
          ]
        };
    }
  };

  const content = getPageContent();

  return (
    <div className="min-h-screen bg-paper dark:bg-night text-ink dark:text-white py-12 px-6 sm:px-12 max-w-4xl mx-auto space-y-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-xs font-bold text-ink-soft hover:text-ink dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {BRAND.name}</span>
      </button>

      <div className="space-y-3 pb-6 border-b border-line">
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-ink dark:text-white">
          {content.title}
        </h1>
        <p className="text-sm sm:text-base text-ink-soft max-w-2xl leading-relaxed">
          {content.desc}
        </p>
      </div>

      <div className="space-y-8">
        {content.sections.map((sec, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-line/10 border border-line space-y-2">
            <h3 className="text-lg font-bold font-display text-ink dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lagoon flex-shrink-0" />
              {sec.h}
            </h3>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
              {sec.p}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
