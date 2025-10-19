import { z } from "zod";

// Валидација за умрен/умрена
const deceasedSchema = z.object({
  firstName: z.string().min(1, "Потребно е да внесете име"),
  fatherName: z.string().optional().or(z.literal("")),
  lastName: z.string().min(1, "Потребно е да внесете презиме"),
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
      day: z.number().min(1).max(31).optional().or(z.literal("")),
      month: z.number().min(1).max(12).optional().or(z.literal("")),
      year: z
        .number()
        .min(1800, "Годината мора да биде по 1800")
        .max(2100, "Годината мора да биде пред 2100"),
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
    confessed: z.string().optional(),
  }),
  notes: z.string().optional(),
  pageNumber: z.number().positive().optional(),
});
