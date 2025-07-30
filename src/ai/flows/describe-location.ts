'use server';
/**
 * @fileOverview An AI agent that describes the user's current location.
 *
 * - describeLocation - A function that generates a description of the user's surroundings.
 * - DescribeLocationInput - The input type for the describeLocation function.
 * - DescribeLocationOutput - The return type for the describeLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescribeLocationInputSchema = z.object({
  latitude: z
    .number()
    .describe('The latitude of the location to describe.'),
  longitude: z
    .number()
    .describe('The longitude of the location to describe.'),
});
export type DescribeLocationInput = z.infer<typeof DescribeLocationInputSchema>;

const DescribeLocationOutputSchema = z.object({
  locationDescription: z
    .string()
    .describe('A description of the user\'s surroundings.'),
});
export type DescribeLocationOutput = z.infer<typeof DescribeLocationOutputSchema>;

export async function describeLocation(input: DescribeLocationInput): Promise<DescribeLocationOutput> {
  return describeLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'describeLocationPrompt',
  input: {schema: DescribeLocationInputSchema},
  output: {schema: DescribeLocationOutputSchema},
  prompt: `You are a helpful AI assistant that describes a user's surroundings based on their GPS coordinates.

  The user is currently at latitude: {{latitude}}, longitude: {{longitude}}.

  Describe the user's surroundings in a way that would help them orient themselves and identify landmarks.
  Focus on easily identifiable objects and features.
  The location description must be concise.
  Return the location description.`,
});

const describeLocationFlow = ai.defineFlow(
  {
    name: 'describeLocationFlow',
    inputSchema: DescribeLocationInputSchema,
    outputSchema: DescribeLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
