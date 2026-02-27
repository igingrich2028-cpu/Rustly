'use server';
/**
 * @fileOverview An AI agent that explains Rust compiler errors and suggests fixes.
 *
 * - explainCompilerError - A function that handles the explanation process for Rust compiler errors.
 * - ExplainCompilerErrorInput - The input type for the explainCompilerError function.
 * - ExplainCompilerErrorOutput - The return type for the explainCompilerError function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCompilerErrorInputSchema = z.object({
  rustCompilerError: z.string().describe('The Rust compiler error message.'),
});
export type ExplainCompilerErrorInput = z.infer<typeof ExplainCompilerErrorInputSchema>;

const ExplainCompilerErrorOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A simplified, natural language explanation of the compiler error.'),
  potentialFixes: z.array(z.string()).describe('A list of potential fixes for the error.'),
});
export type ExplainCompilerErrorOutput = z.infer<typeof ExplainCompilerErrorOutputSchema>;

export async function explainCompilerError(
  input: ExplainCompilerErrorInput
): Promise<ExplainCompilerErrorOutput> {
  return explainCompilerErrorFlow(input);
}

const explainCompilerErrorPrompt = ai.definePrompt({
  name: 'explainCompilerErrorPrompt',
  input: {schema: ExplainCompilerErrorInputSchema},
  output: {schema: ExplainCompilerErrorOutputSchema},
  prompt: `You are an expert Rust programmer and an AI assistant specializing in debugging.

Your task is to analyze the provided Rust compiler error, explain it in simple, natural language, and suggest concrete potential fixes.

Rust Compiler Error:
---
{{{rustCompilerError}}}
---

Please provide your explanation and potential fixes in JSON format, adhering to the output schema.`,
});

const explainCompilerErrorFlow = ai.defineFlow(
  {
    name: 'explainCompilerErrorFlow',
    inputSchema: ExplainCompilerErrorInputSchema,
    outputSchema: ExplainCompilerErrorOutputSchema,
  },
  async input => {
    const {output} = await explainCompilerErrorPrompt(input);
    return output!;
  }
);
