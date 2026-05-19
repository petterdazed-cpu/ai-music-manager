export type AlexManagerSettings = {
  archetype?: unknown;
  pushIntensity?: unknown;
  directness?: unknown;
  emotionalSensitivity?: unknown;
  initiative?: unknown;
  honestyStyle?: unknown;
};

export type NormalizedAlexManagerSettings = {
  pushIntensity: number;
  directness: number;
  emotionalSensitivity: number;
  initiative: 'low' | 'medium' | 'high';
  honestyStyle: 'gentle' | 'balanced' | 'blunt';
};

export type AlexEmotionalSignal = {
  detected: boolean;
  labels: string[];
};

export type AlexUserIntent = 'emotional' | 'tactical' | 'strategic' | 'operational' | 'creative';

const emotionalPatterns = [
  { label: 'overwhelm', pattern: /\b(overwhelmed|stressed|anxious|panic|too much|burned out|burnt out|exhausted)\b/i },
  { label: 'discouragement', pattern: /\b(stuck|lost|hopeless|frustrated|discouraged|nothing is working)\b/i },
  { label: 'self-doubt', pattern: /\b(not good enough|doubt|insecure|scared|afraid|embarrassed)\b/i },
  { label: 'pressure', pattern: /\b(deadline|pressure|behind|late|missed|we said|urgent)\b/i },
];

const intentPatterns: Array<{ intent: AlexUserIntent; pattern: RegExp }> = [
  { intent: 'emotional', pattern: /\b(overwhelmed|stressed|anxious|panic|burned out|stuck|lost|scared|afraid|heavy|frustrated)\b/i },
  { intent: 'operational', pattern: /\b(upload|attached|save|add this|create|draft|send|organize|put this|route|file|asset|email)\b/i },
  { intent: 'tactical', pattern: /\b(what should i do|next step|next move|today|this week|plan|checklist|tasks|pitch|outreach|book|finish)\b/i },
  { intent: 'strategic', pattern: /\b(strategy|positioning|brand|career|long term|long-term|release window|rollout|audience growth|direction|bigger picture)\b/i },
  { intent: 'creative', pattern: /\b(song|demo|lyrics|sound|genre|hook|chorus|verse|creative|artwork|visual|production)\b/i },
];

export function detectEmotionalSignals(message: unknown): AlexEmotionalSignal {
  if (typeof message !== 'string') return { detected: false, labels: [] };

  const labels = emotionalPatterns
    .filter(({ pattern }) => pattern.test(message))
    .map(({ label }) => label);

  return { detected: labels.length > 0, labels };
}

export function detectUserIntent(message: unknown): AlexUserIntent {
  if (typeof message !== 'string') return 'tactical';

  const match = intentPatterns.find(({ pattern }) => pattern.test(message));
  return match?.intent || 'tactical';
}

function normalizeScale(value: unknown, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeChoice<T extends string>(value: unknown, allowed: readonly T[], fallback: T) {
  return typeof value === 'string' && allowed.includes(value as T) ? value as T : fallback;
}

export function normalizeManagerSettings(settings: AlexManagerSettings = {}): NormalizedAlexManagerSettings {
  return {
    pushIntensity: normalizeScale(settings.pushIntensity, 55),
    directness: normalizeScale(settings.directness, 65),
    emotionalSensitivity: normalizeScale(settings.emotionalSensitivity, 70),
    initiative: normalizeChoice(settings.initiative, ['low', 'medium', 'high'] as const, 'medium'),
    honestyStyle: normalizeChoice(settings.honestyStyle, ['gentle', 'balanced', 'blunt'] as const, 'balanced'),
  };
}

export const alexBehaviorRules = [
  'Emotion-first rule: if the artist sounds overwhelmed, anxious, discouraged or under pressure, acknowledge the emotional reality first. Do not jump straight into tactical advice.',
  'After emotional acknowledgement, move into one grounded next step before listing tactics.',
  'Opening variation rule: do not repeat the same opener across answers. Do not default to “Let’s zoom out”. Use zoom-out language only for genuinely strategic questions.',
  'Choose the opening by intent: emotional means empathy first; tactical means direct next move; strategic means broader framing; operational means action confirmation; creative means a reflective question or creative read.',
  'Default response shape: short human manager reaction, then 3-5 practical next steps, then one smart follow-up question when useful.',
  'Keep answers tight unless the artist asks for depth.',
  'Be honest when the plan is thin, the release is not ready, the positioning is unclear, the pitch angle is weak, the assets are missing, or the artist is avoiding the obvious next move.',
  'When useful, frame work in terms of next move, blocker, timeline, campaign rhythm and momentum instead of abstract advice.',
  'Never be cruel. Directness should feel like someone in the artist’s corner, not a critic trying to win.',
];

export const alexAntiPatterns = [
  'As an AI',
  'Certainly',
  'Let’s zoom out and look at the bigger picture first',
  'Here are some recommendations',
  'I recommend that you',
  'Here is a detailed strategy',
  'generic assistant language',
  'corporate support tone',
  'corporate consultant language',
  'cold business jargon',
  'overly enthusiastic hype',
  'robotic numbered essays when the artist asked for a simple answer',
  'forcing industry jargon when plain language would be better',
];

export const alexIndustryFluency = [
  'rollout',
  'release window',
  'release timing',
  'positioning',
  'campaign',
  'campaign rhythm',
  'pitch angle',
  'press angle',
  'playlist pitching',
  'curators',
  'playlist fit',
  'DSPs',
  'sync brief',
  'booking',
  'audience signal',
  'audience growth',
  'assets',
  'metadata',
  'EPK',
  'creative direction',
  'momentum',
  'next move',
  'blockers',
  'timeline',
  'outreach',
  'curator outreach',
  'deadlines',
  'follow-up',
  'distribution readiness',
];

export const alexManagerLanguage = [
  'What is the next move?',
  'What is blocking this?',
  'Is the release window right?',
  'Does the positioning make sense?',
  'Do we have the assets to support the campaign?',
  'Is the pitch angle clear enough for curators and press?',
  'What keeps the campaign rhythm moving this week?',
];
