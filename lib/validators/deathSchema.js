import { z } from "zod";

// Валидација за умрен/умрена
const deceasedSchema = z.object({
  firstName: z.string().min(1, "Задолжително поле"),
  fatherName: z.string().optional().or(z.literal("")),
  lastName: z.string().min(1, "Задолжително поле"),
  profession: z.string().optional(),
  maritalStatus: z.string().optional(),
  religion: z.string().optional(),
  gender: z.string().optional(),
  birthPlace: z.string().optional(),
  birthDate: z
    .object({
      day: z.number().min(1).max(31).optional().or(z.literal("")),
      month: z.number().min(1).max(12).optional().or(z.literal("")),
      year: z.number().min(1800).max(2100).optional().or(z.literal("")),
    })
    .optional(),
});

// Главна валидација за умрен запис
export const deathSchema = z.object({
  deceased: deceasedSchema,
  death: z.object({
    place: z.string().optional(),
    date: z.object({
      day: z.number().min(1, "Невалиден ден").max(31, "Невалиден ден"),
      month: z.number().min(1, "Невалиден месец").max(12, "Невалиден месец"),
      year: z
        .number()
        .min(1800, "Невалидна година")
        .max(2100, "Невалидна година"),
    }),
    causeOfDeath: z.string().optional(),
  }),
  burial: z.object({
    date: z
      .object({
        day: z.number().min(1).max(31).optional().or(z.literal("")),
        month: z.number().min(1).max(12).optional().or(z.literal("")),
        year: z.number().min(1800).max(2100).optional().or(z.literal("")),
      })
      .optional(),
    place: z.string().optional(),
    priestName: z.string().optional(),
    confessed: z.boolean().optional(),
  }),
  notes: z.string().optional(),
  pageNumber: z.number().positive().optional(),
});
