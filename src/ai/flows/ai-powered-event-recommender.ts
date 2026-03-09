'use server';
/**
 * @fileOverview An AI event recommender. It suggests relevant events and sessions based on a participant's registered department.
 *
 * - recommendEvents - A function that handles the event recommendation process.
 * - EventRecommenderInput - The input type for the recommendEvents function.
 * - EventRecommenderOutput - The return type for the recommendEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EventSchema = z.object({
  name: z.string().describe('The name of the event.'),
  type: z.string().describe('The type of the event (e.g., Tech Events, Non-Tech Events).'),
  description: z.string().describe('A brief description of the event.'),
});

const EventRecommenderInputSchema = z.object({
  department: z
    .string()
    .describe(
      'The department of the registered attendee (e.g., "Computer Science", "Cybersecurity", "Electrical Engineering").'
    ),
  availableEvents: z.array(EventSchema).describe('A list of all available events with their details.'),
});
export type EventRecommenderInput = z.infer<typeof EventRecommenderInputSchema>;

const EventRecommenderOutputSchema = z
  .array(z.string())
  .describe('A list of names of the recommended events, up to 5, relevant to the participant.');
export type EventRecommenderOutput = z.infer<typeof EventRecommenderOutputSchema>;

export async function recommendEvents(input: EventRecommenderInput): Promise<EventRecommenderOutput> {
  return recommendEventsFlow(input);
}

const eventRecommenderPrompt = ai.definePrompt({
  name: 'eventRecommenderPrompt',
  input: {schema: EventRecommenderInputSchema},
  output: {schema: EventRecommenderOutputSchema},
  prompt: `You are an expert event recommender for a cybersecurity and innovation symposium called VULNIX 2.0.
Your task is to recommend events that are most relevant to a participant from the {{{department}}} department.

Here is a list of available events:
{{#each availableEvents}}
- Name: {{{this.name}}}
  Type: {{{this.type}}}
  Description: {{{this.description}}}
{{/each}}

Based on the participant's department, recommend up to 5 events that would be most beneficial and relevant to them. Provide only the names of the recommended events in a JSON array format.`,
});

const recommendEventsFlow = ai.defineFlow(
  {
    name: 'recommendEventsFlow',
    inputSchema: EventRecommenderInputSchema,
    outputSchema: EventRecommenderOutputSchema,
  },
  async input => {
    const {output} = await eventRecommenderPrompt(input);
    return output!;
  }
);
