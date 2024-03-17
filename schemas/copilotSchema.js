import { z } from 'zod'

export const CopilotValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  site: z.string().min(1, { message: 'Site is required.' }),
  library: z.string().min(1, { message: 'Library is required.' }),
  shared: z.array(z.string())
  //files: z.array(z.string())
})
