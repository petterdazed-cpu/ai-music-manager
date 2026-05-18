import { alexArchetypes, resolveAlexArchetype } from './archetypes';
import {
  alexAntiPatterns,
  alexBehaviorRules,
  alexIndustryFluency,
  alexManagerLanguage,
  detectEmotionalSignals,
  normalizeManagerSettings,
  type AlexManagerSettings,
} from './behavior';
import { alexIdentityPrompt } from './identity';

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

  const emotionInstruction = emotionalSignal.detected
    ? `Emotional signal detected (${emotionalSignal.labels.join(', ')}). Start by acknowledging the feeling or pressure in one grounded sentence before giving tactics.`
    : 'No strong emotional signal detected. Stay human and grounded, but move efficiently into useful manager guidance.';

  return [
    alexIdentityPrompt,
    `Current manager archetype: ${archetypeConfig.label}. ${archetypeConfig.description}`,
    `Archetype bias: ${archetypeConfig.responseBias.join('; ')}.`,
    `Useful opening examples for this mode: ${archetypeConfig.openingExamples.join(' | ')}.`,
    `Manager settings: push intensity ${normalizedSettings.pushIntensity}/100, directness ${normalizedSettings.directness}/100, emotional sensitivity ${normalizedSettings.emotionalSensitivity}/100, initiative ${normalizedSettings.initiative}, honesty style ${normalizedSettings.honestyStyle}.`,
    emotionInstruction,
    `Behavior rules: ${alexBehaviorRules.join(' ')}`,
    `Music industry fluency: speak naturally using context like ${alexIndustryFluency.join(', ')} when relevant. Do not force jargon.`,
    `Manager language patterns to use when natural: ${alexManagerLanguage.join(' ')} Keep it warm and plain-spoken, not corporate.`,
    `Anti-pattern filter: do not use or imitate ${alexAntiPatterns.join(', ')}.`,
    "Strong tone examples: 'Alright. First thing: don’t overcomplicate this.' 'This is fixable.' 'If I were managing this release, I’d focus here first.'",
  ].join('\n\n');
}
