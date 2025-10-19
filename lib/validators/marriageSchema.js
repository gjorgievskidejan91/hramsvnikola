import { z } from "zod";

// Валидација за лице (Person)
const personSchema = z.object({
  firstName: z.string().min(1, "Задолжително поле"),
  fatherName: z.string().min(1, "Задолжително поле"),
  lastName: z.string().min(1, "Задолжително поле"),
  profession: z.string().optional(),
  residence: z.string().optional(),
  religion: z.string().optional(),
  nationality: z.string().optional(),
  birthDate: z
    .object({
      day: z.number().min(1).max(31).optional().or(z.literal("")),
      month: z.number().min(1).max(12).optional().or(z.literal("")),
      year: z.number().min(1800).max(2100).optional().or(z.literal("")),
    })
    .optional(),
  maritalStatus: z.string().optional(),
  previousStatusDate: z.date().optional(),
  marriageNumber: z.number().optional().or(z.literal("")),
});

// Главна валидација за венчавање
export const marriageSchema = z.object({
  groom: personSchema,
  bride: personSchema,
  marriage: z.object({
    church: z.string().optional(),
    place: z.string().optional(),
    date: z.object({
      day: z.number().min(1, "Невалиден ден").max(31, "Невалиден ден"),
      month: z.number().min(1, "Невалиден месец").max(12, "Невалиден месец"),
      year: z
        .number()
        .min(1800, "Невалидна година")
        .max(2100, "Невалидна година"),
    }),
    priestName: z.string().optional(),
    bestMan: z
      .object({
        name: z.string().optional(),
        residence: z.string().optional(),
      })
      .optional(),
    witness: z
      .object({
        name: z.string().optional(),
        residence: z.string().optional(),
      })
      .optional(),
  }),
  notes: z.string().optional(),
  pageNumber: z.number().positive().optional(),
});
