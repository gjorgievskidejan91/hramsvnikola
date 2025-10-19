"use server";

import { connectDB } from "@/lib/db";
import Death from "@/lib/models/Death";

/**
 * Зема листа на умрени со пагинација и пребарување
 * @param {number} page - Број на страна (default: 1)
 * @param {number} limit - Број на записи по страна (default: 20)
 * @param {Object} filters - Search filters
 * @returns {Promise<{deaths: Array, total: number, pages: number}>}
 */
export async function getDeaths(page = 1, limit = 20, filters = {}) {
  try {
    await connectDB();

    const skip = (page - 1) * limit;

    // Изгради search filter
    const searchFilter = {};
    const andConditions = [];

    // Пребарување по име/презиме на умрениот
    if (filters.name && filters.name.trim()) {
      const regex = new RegExp(filters.name.trim(), "i");
      andConditions.push({
        $or: [
          { "deceased.firstName": regex },
          { "deceased.lastName": regex },
          { "deceased.fatherName": regex },
        ],
      });
    }

    // Date range filter (death date)
    if (filters.dateFromYear || filters.dateToYear) {
      const dateFilter = {};

      if (filters.dateFromYear) {
        const fromYear = parseInt(filters.dateFromYear);
        const fromMonth = filters.dateFromMonth
          ? parseInt(filters.dateFromMonth)
          : 1;
        const fromDay = filters.dateFromDay ? parseInt(filters.dateFromDay) : 1;

        dateFilter.$gte = {
          year: fromYear,
          month: fromMonth,
          day: fromDay,
        };
      }

      if (filters.dateToYear) {
        const toYear = parseInt(filters.dateToYear);
        const toMonth = filters.dateToMonth
          ? parseInt(filters.dateToMonth)
          : 12;
        const toDay = filters.dateToDay ? parseInt(filters.dateToDay) : 31;

        dateFilter.$lte = {
          year: toYear,
          month: toMonth,
          day: toDay,
        };
      }

      // Construct date range query
      const dateConditions = [];

      if (dateFilter.$gte) {
        const { year: fromY, month: fromM, day: fromD } = dateFilter.$gte;
        dateConditions.push({
          $or: [
            { "death.date.year": { $gt: fromY } },
            {
              $and: [
                { "death.date.year": fromY },
                {
                  $or: [
                    { "death.date.month": { $gt: fromM } },
                    {
                      $and: [
                        { "death.date.month": fromM },
                        { "death.date.day": { $gte: fromD } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
      }

      if (dateFilter.$lte) {
        const { year: toY, month: toM, day: toD } = dateFilter.$lte;
        dateConditions.push({
          $or: [
            { "death.date.year": { $lt: toY } },
            {
              $and: [
                { "death.date.year": toY },
                {
                  $or: [
                    { "death.date.month": { $lt: toM } },
                    {
                      $and: [
                        { "death.date.month": toM },
                        { "death.date.day": { $lte: toD } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
      }

      if (dateConditions.length > 0) {
        andConditions.push({ $and: dateConditions });
      }
    }

    // Advanced filters
    if (filters.place) {
      andConditions.push({
        $or: [
          { "death.place": new RegExp(filters.place, "i") },
          { "burial.place": new RegExp(filters.place, "i") },
        ],
      });
    }

    if (filters.priest) {
      andConditions.push({
        "burial.priestName": new RegExp(filters.priest, "i"),
      });
    }

    if (filters.pageNumber) {
      andConditions.push({
        pageNumber: parseInt(filters.pageNumber),
      });
    }

    if (filters.gender) {
      andConditions.push({
        "deceased.gender": filters.gender,
      });
    }

    // Combine all conditions
    if (andConditions.length > 0) {
      searchFilter.$and = andConditions;
    }

    const deaths = await Death.find(searchFilter)
      .sort({
        "death.date.year": -1,
        "death.date.month": -1,
        "death.date.day": -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Death.countDocuments(searchFilter);

    return {
      deaths: JSON.parse(JSON.stringify(deaths)),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      filters,
    };
  } catch (error) {
    console.error("Грешка при вчитување:", error);
    return {
      deaths: [],
      total: 0,
      pages: 0,
      currentPage: 1,
      filters: {},
    };
  }
}

/**
 * Зема еден запис по ID
 * @param {string} id - MongoDB ID
 * @returns {Promise<Object|null>}
 */
export async function getDeathById(id) {
  try {
    await connectDB();

    const death = await Death.findById(id).lean();

    if (!death) {
      return null;
    }

    return JSON.parse(JSON.stringify(death));
  } catch (error) {
    console.error("Грешка при вчитување:", error);
    return null;
  }
}
