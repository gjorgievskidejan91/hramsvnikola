import { z } from "zod";

// Валидација за дете
const childSchema = z.object({
  firstName: z.string().min(1, "Задолжително поле"),
  lastName: z.string().optional().or(z.literal("")),
  gender: z.string().optional(),
  birthDate: z
    .object({
      day: z.number().min(1).max(31).optional().or(z.literal("")),
      month: z.number().min(1).max(12).optional().or(z.literal("")),
      year: z.number().min(1800).max(2100).optional().or(z.literal("")),
    })
    .optional(),
  birthPlace: z.string().optional(),
});

// Валидација за татко
const fatherSchema = z.object({
  firstName: z.string().min(1, "Задолжително поле"),
  lastName: z.string().min(1, "Задолжително поле"),
});

// Валидација за мајка
const motherSchema = z.object({
  firstName: z.string().min(1, "Задолжително поле"),
  lastName: z.string().min(1, "Задолжително поле"),
  childOrderNumber: z.number().positive().optional().or(z.literal("")),
});

// Главна валидација за запис за крстениче
export const christeningSchema = z.object({
  child: childSchema,
  father: fatherSchema,
  mother: motherSchema,
  christening: z.object({
    date: z.object({
      day: z.number().min(1, "Невалиден ден").max(31, "Невалиден ден"),
      month: z.number().min(1, "Невалиден месец").max(12, "Невалиден месец"),
      year: z
        .number()
        .min(1800, "Невалидна година")
        .max(2100, "Невалидна година"),
    }),
    church: z.string().optional(),
    place: z.string().optional(),
    priestName: z.string().optional(),
    godparentFirstName: z.string().optional(),
    godparentLastName: z.string().optional(),
  }),
  civillyRegistered: z.boolean().optional(),
  churchMarriage: z.boolean().optional(),
  isTwin: z.boolean().optional(),
  notes: z.string().optional(),
  pageNumber: z.string().optional(),
});
