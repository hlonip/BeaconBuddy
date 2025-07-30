import {z} from 'genkit';

export const TextToSpeechOutputSchema = z.object({
  media: z
    .string()
    .describe(
      "The audio data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."
    ),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
