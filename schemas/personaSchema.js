import { z } from 'zod'

export const PersonaValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  persona: z
    .string()
    .min(20, { message: 'Your Persona has at least to be 20 characters long' }),
  temperature: z
    .number()
    .min(0.1)
    .max(1.0)
    .refine(value => {
      if (value < 0.1 || value > 1.0) {
        return 'Value must be between 0.1 and 1.'
      }
      return true
    }),
  topp: z
    .number()
    .min(0.1)
    .max(1.0)
    .refine(value => {
      if (value < 0.1 || value > 1.0) {
        return 'Value must be between 0.1 and 1.'
      }
      return true
    }),
  public: z.boolean()
})
