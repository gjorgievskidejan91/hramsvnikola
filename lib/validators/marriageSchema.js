import { z } from "zod";

// Валидација за лице (Person)
const personSchema = z.object({
  firstName: z.string().min(1, "Потребно е да внесете име"),
  fatherName: z.string().min(1, "Потребно е да внесете татково име"),
  lastName: z.string().min(1, "Потребно е да внесете презиме"),
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
      day: z
        .number()
        .min(1, "Внесете ден (1-31)")
        .max(31, "Денот мора да биде помеѓу 1 и 31"),
      month: z
        .number()
        .min(1, "Внесете месец (1-12)")
        .max(12, "Месецот мора да биде помеѓу 1 и 12"),
      year: z
        .number()
        .min(1800, "Годината мора да биде по 1800")
        .max(2100, "Годината мора да биде пред 2100"),
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
