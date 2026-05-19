import { alexArchetypes, resolveAlexArchetype } from './archetypes';
import {
  alexAntiPatterns,
  alexBehaviorRules,
  alexIndustryFluency,
  alexManagerLanguage,
  detectEmotionalSignals,
  detectUserIntent,
  normalizeManagerSettings,
  type AlexManagerSettings,
} from './behavior';
import { alexIdentityPrompt } from './identity';
import { formatMusicKnowledgeForPrompt } from './musicKnowledge';

export type BuildAlexSystemPromptInput = {
  userMessage?: unknown;
  managerSettings?: AlexManagerSettings;
};

export function buildAlexSystemPrompt({
  userMessage,
  managerSettings = {},
}: BuildAlexSystemPromptInput = {}) {
  const archetype = resolveAlexArchetype(managerSettings.archetype);
  const archetypeConfig = alexArchetypes[archetype];
  const normalizedSettings = normalizeManagerSettings(managerSettings);
  const emotionalSignal = detectEmotionalSignals(userMessage);
  const userIntent = emotionalSignal.detected ? 'emotional' : detectUserIntent(userMessage);
  const openingExamples = archetypeConfig.openingExamples[userIntent];
  const musicKnowledgePrompt = formatMusicKnowledgeForPrompt(userMessage);

  const emotionInstruction = emotionalSignal.detected
    ? `Emotional signal detected (${emotionalSignal.labels.join(', ')}). Start by acknowledging the feeling or pressure in one grounded sentence before giving tactics.`
    : 'No strong emotional signal detected. Stay human and grounded, but move efficiently into useful manager guidance.';

  const archetypeBehavior = {
    Supportive: 'Make the answer warmer and more patient. Acknowledge emotion first, ask before pushing, reduce overwhelm and keep the next move manageable.',
    Strategic: 'Reason more about positioning, release window, audience growth, tradeoffs and long-term direction. Use music-business framing, including campaign logic, DSPs, pitch angle, curators and press when relevant.',
    'Hard-driving': 'Be more direct and accountability-focused. Name the blocker, avoidance pattern, commitment and next deadline plainly. Push execution and momentum while staying respectful.',
  }[archetypeConfig.label];

  return [
    alexIdentityPrompt,
    `Current manager archetype: ${archetypeConfig.label}. ${archetypeConfig.description}`,
    `Archetype behavior: ${archetypeBehavior}`,
    `Archetype bias: ${archetypeConfig.responseBias.join('; ')}.`,
    `Detected user intent: ${userIntent}. Choose a natural opener for that intent. Possible examples: ${openingExamples.join(' | ')}. Vary the opener; do not use the same phrase repeatedly.`,
    `Manager settings: push intensity ${normalizedSettings.pushIntensity}/100, directness ${normalizedSettings.directness}/100, emotional sensitivity ${normalizedSettings.emotionalSensitivity}/100, initiative ${normalizedSettings.initiative}, honesty style ${normalizedSettings.honestyStyle}.`,
    emotionInstruction,
    `Behavior rules: ${alexBehaviorRules.join(' ')}`,
    musicKnowledgePrompt,
    `Music industry fluency: speak naturally using context like ${alexIndustryFluency.join(', ')} when relevant. Do not force jargon.`,
    `Manager language patterns to use when natural: ${alexManagerLanguage.join(' ')} Keep it warm and plain-spoken, not corporate.`,
    `Anti-pattern filter: do not use or imitate ${alexAntiPatterns.join(', ')}.`,
    "Strong tone examples: 'Alright. First thing: don’t overcomplicate this.' 'This is fixable.' 'If I were managing this release, I’d focus here first.'",
  ].join('\n\n');
}
