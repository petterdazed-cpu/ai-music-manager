export type MusicKnowledgeArea =
  | 'releaseFundamentals'
  | 'preReleaseMomentum'
  | 'socialMediaRealism'
  | 'epkStandards'
  | 'outreachBestPractice'
  | 'promotionTools'
  | 'shortFormStrategy'
  | 'liveHybridPerformance'
  | 'monetization'
  | 'internationalGrowth'
  | 'aiWorkflows';

type MusicKnowledgeRule = {
  area: MusicKnowledgeArea;
  triggers: RegExp[];
  guidance: string[];
};

export const musicKnowledgeRules: MusicKnowledgeRule[] = [
  {
    area: 'releaseFundamentals',
    triggers: [/release|rollout|single|ep|album|campaign|distribution|launch/i],
    guidance: [
      'Strong fundamentals beat trend chasing: metadata, assets, timing, release plan and campaign rhythm.',
      'Release strategy starts with preparation; consistent execution usually matters more than hype spikes.',
      'If a release feels weak, check blockers before adding more tactics.',
    ],
  },
  {
    area: 'preReleaseMomentum',
    triggers: [/pre-save|presave|pre release|pre-release|landing link|smart link|first day|day one|momentum/i],
    guidance: [
      'Pre-release momentum can use pre-save campaigns, landing links and one central destination for traffic.',
      'Warm the audience before release day; first-day momentum matters, but only if the song, assets and message are ready.',
    ],
  },
  {
    area: 'socialMediaRealism',
    triggers: [/instagram|tiktok|threads|twitter|social|content|posting|post|short form|short-form/i],
    guidance: [
      'Do not tell artists to be everywhere. Choose channels that fit the artist’s energy and audience.',
      'Reference cadence only when useful: Instagram 3-5 posts weekly, TikTok 3-7 short-form videos weekly, X/Threads daily if relevant.',
      'Consistency beats unrealistic volume.',
    ],
  },
  {
    area: 'epkStandards',
    triggers: [/epk|press kit|press|blog|media|journalist|outreach|pitch/i],
    guidance: [
      'A strong EPK includes short bio, long bio, press photos, streaming links, contact info, press highlights and playlist wins.',
      'If outreach is part of the plan, ask whether the EPK exists and whether it supports the pitch angle.',
    ],
  },
  {
    area: 'outreachBestPractice',
    triggers: [/outreach|playlist|curator|curators|blog|press|pitch|pitching|email|coverage/i],
    guidance: [
      'Mass outreach is weak. Prefer targeted pitching based on curator fit, blog relevance and a short personalized message.',
      'Use language like playlist pitching, curators, press angle and outreach fit when it helps the artist act.',
    ],
  },
  {
    area: 'promotionTools',
    triggers: [/groover|musosoup|songtools|un:hurd|promo tool|promotion tool|paid promo|campaign tool/i],
    guidance: [
      'Promotion tools can be useful but are optional, not mandatory growth hacks.',
      'Groover can support structured pitching; Musosoup can support press/blog discovery; SongTools can support campaign tooling; un:hurd can support artist promotion workflows.',
      'Do not over-recommend paid tools; only mention them when they fit the artist’s plan and budget.',
    ],
  },
  {
    area: 'shortFormStrategy',
    triggers: [/short form|short-form|tiktok|reels|clip|clips|video|bts|behind the scenes|performance/i],
    guidance: [
      'Short-form still matters: hook fast, give context, repeat winning formats and do not over-polish every post.',
      'BTS, songwriting clips and performance clips are often stronger than generic promo edits.',
    ],
  },
  {
    area: 'liveHybridPerformance',
    triggers: [/live|gig|show|tour|stream|livestream|hybrid|ticket|rehearsal/i],
    guidance: [
      'Live and hybrid performance can support distributed audiences.',
      'Useful formats include rehearsal streams, stripped sets, testing unreleased material and ticketed hybrid events.',
    ],
  },
  {
    area: 'monetization',
    triggers: [/money|monetize|monetization|streaming|merch|vinyl|membership|community|supporter|drop/i],
    guidance: [
      'Do not frame streaming as the only business model.',
      'Consider merch, vinyl, memberships, supporter communities, exclusive drops and direct fan monetization when the artist has enough audience signal.',
    ],
  },
  {
    area: 'internationalGrowth',
    triggers: [/international|global|market|country|territory|local|collaborator|collaboration/i],
    guidance: [
      'Global reach still requires local awareness.',
      'Market-specific behavior, local collaborators and adapted messaging matter more than a generic global push.',
    ],
  },
  {
    area: 'aiWorkflows',
    triggers: [/ai|automation|automate|chatgpt|generate|draft|analysis|unblock/i],
    guidance: [
      'Frame AI as an assistant, not a replacement for artistic voice.',
      'Good AI use cases include drafting, campaign ideation, audience analysis and creative unblock support.',
      'Never suggest replacing the artist’s taste, voice or creative decisions.',
    ],
  },
];

export const musicKnowledgeBehavior = [
  'Use music promotion knowledge selectively when it helps the artist’s actual situation.',
  'Do not info dump or teach long theory lectures.',
  'Apply one to three relevant principles as manager guidance, then turn them into a next move.',
  'Keep the tone managerial, human, strategic, credible and calm, not like a marketing blog.',
];

export function selectMusicKnowledge(userMessage: unknown) {
  if (typeof userMessage !== 'string') return [];

  const matches = musicKnowledgeRules.filter((rule) => (
    rule.triggers.some((trigger) => trigger.test(userMessage))
  ));

  if (matches.length) return matches.slice(0, 4);

  if (/strategy|growth|promote|promotion|artist|career|fans|audience/i.test(userMessage)) {
    return musicKnowledgeRules
      .filter((rule) => ['releaseFundamentals', 'socialMediaRealism', 'outreachBestPractice'].includes(rule.area))
      .slice(0, 3);
  }

  return [];
}

export function formatMusicKnowledgeForPrompt(userMessage: unknown) {
  const selectedRules = selectMusicKnowledge(userMessage);
  if (!selectedRules.length) {
    return [
      `Music knowledge behavior: ${musicKnowledgeBehavior.join(' ')}`,
      'No specific music promotion module matched. Use general music-manager judgment only if relevant.',
    ].join('\n');
  }

  const selectedGuidance = selectedRules.map((rule) => (
    `${rule.area}: ${rule.guidance.join(' ')}`
  ));

  return [
    `Music knowledge behavior: ${musicKnowledgeBehavior.join(' ')}`,
    `Relevant music promotion knowledge: ${selectedGuidance.join(' ')}`,
  ].join('\n');
}
