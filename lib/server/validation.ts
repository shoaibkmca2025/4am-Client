import { z } from 'zod';

// Shared server-side validation. Never trust client input (rules.md §3).

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(32).optional().or(z.literal('')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  service: z.string().trim().max(80).optional().or(z.literal('')),
  budget: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(4000),
  source: z.string().trim().max(60).default('website'),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const claimSchema = z.object({
  claimKey: z
    .string()
    .trim()
    .regex(/^4AM-[A-Z2-9]{5}-[A-Z2-9]{5}$/i, 'Invalid key format'),
});

export const courseSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().regex(/^[a-z0-9-]{2,80}$/),
  description: z.string().trim().max(4000).optional().or(z.literal('')),
  venue: z.string().trim().max(200).optional().or(z.literal('')),
  college: z.string().trim().max(200).optional().or(z.literal('')),
  start_date: z.string().date().optional(),
  end_date: z.string().date().optional(),
  status: z.enum(['draft', 'active', 'completed']).default('draft'),
});

export const enrollmentSchema = z.object({
  course_id: z.string().uuid(),
  student_name: z.string().trim().min(2).max(160),
  student_email: z.string().trim().email().max(254),
});

export const issueCertificateSchema = z.object({
  enrollment_id: z.string().uuid(),
  file_path: z.string().trim().min(3).max(500),
  issue_date: z.string().date().optional(),
  show_file_publicly: z.boolean().default(false),
});

export const revokeCertificateSchema = z.object({
  certificate_id: z.string().uuid(),
  reason: z.string().trim().min(3).max(500),
});

export const serialSchema = z
  .string()
  .trim()
  .regex(/^4AM-\d{4}-[A-Z2-9]{6}$/i, 'Invalid serial format');
