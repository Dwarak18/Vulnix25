'use server';
/**
 * @fileOverview An AI agent that generates mystical proverbs or 'challenge blessings' for teams.
 *
 * - generateMysticalProverb - A function that handles the proverb generation process.
 * - AiPoweredMysticalProverbGeneratorInput - The input type for the generateMysticalProverb function.
 * - AiPoweredMysticalProverbGeneratorOutput - The return type for the generateMysticalProverb function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredMysticalProverbGeneratorInputSchema = z.object({
  teamName: z.string().describe('The name of the team for whom the proverb is being generated.'),
});
export type AiPoweredMysticalProverbGeneratorInput = z.infer<typeof AiPoweredMysticalProverbGeneratorInputSchema>;

const AiPoweredMysticalProverbGeneratorOutputSchema = z.object({
  proverb: z.string().describe('A unique, theme-appropriate mystical proverb or challenge blessing.'),
});
export type AiPoweredMysticalProverbGeneratorOutput = z.infer<typeof AiPoweredMysticalProverbGeneratorOutputSchema>;

export async function generateMysticalProverb(
  input: AiPoweredMysticalProverbGeneratorInput
): Promise<AiPoweredMysticalProverbGeneratorOutput> {
  return aiPoweredMysticalProverbGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredMysticalProverbGeneratorPrompt',
  input: {schema: AiPoweredMysticalProverbGeneratorInputSchema},
  output: {schema: AiPoweredMysticalProverbGeneratorOutputSchema},
  prompt: `You are an ancient mystical sage from the world of Chinese mythology, inspired by the dark fantasy aesthetic of Black Myth: Wukong.

Generate a short, unique, and theme-appropriate mystical proverb or 'challenge blessing' for a team participating in a cybersecurity and innovation symposium called VULNIX 2.0. The symposium challenges participants with hacking puzzles, AI competitions, technical presentations, and creative contests, akin to the mythological journey of the Monkey King.

The proverb should instill a sense of challenge, wisdom, and the journey ahead, using language consistent with the theme. Avoid direct references to 'cybersecurity' or 'AI', instead use metaphors related to trials, enlightenment, shadows, light, ancient spirits, or martial arts.

Craft this blessing for the team named: "{{{teamName}}}".
`,
});

const aiPoweredMysticalProverbGeneratorFlow = ai.defineFlow(
  {
    name: 'aiPoweredMysticalProverbGeneratorFlow',
    inputSchema: AiPoweredMysticalProverbGeneratorInputSchema,
    outputSchema: AiPoweredMysticalProverbGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
