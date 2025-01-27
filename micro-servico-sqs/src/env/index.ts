import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(2222),
  QueueUrl: z.string()
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Variável incorreta!', _env.error.format());
  throw new Error('Variável incorreto!');
}

export const env = _env.data;