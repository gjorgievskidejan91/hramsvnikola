"use server";

import { connectDB } from "@/lib/db";
import Marriage from "@/lib/models/Marriage";

/**
 * Зема листа на венчавања со пагинација и пребарување
 * @param {number} page - Број на страна (default: 1)
 * @param {number} limit - Број на записи по страна (default: 20)
 * @param {Object} filters - Search filters
 * @returns {Promise<{marriages: Array, total: number, pages: number}>}
 */
export async function getMarriages(page = 1, limit = 20, filters = {}) {
  try {
    await connectDB();

    const skip = (page - 1) * limit;

    // Изгради search filter
    const searchFilter = {};
    const andConditions = [];

    // Пребарување по име/презиме (groom и bride)
    if (filters.name && filters.name.trim()) {
      const regex = new RegExp(filters.name.trim(), "i");
      andConditions.push({
        $or: [
          { "groom.firstName": regex },
          { "groom.lastName": regex },
          { "bride.firstName": regex },
          { "bride.lastName": regex },
        ],
      });
    }

    // Date range filter
    if (filters.dateFromYear || filters.dateToYear) {
      const dateFilter = {};

      if (filters.dateFromYear) {
        const fromYear = parseInt(filters.dateFromYear);
        const fromMonth = filters.dateFromMonth
          ? parseInt(filters.dateFromMonth)
          : 1;
        const fromDay = filters.dateFromDay ? parseInt(filters.dateFromDay) : 1;

        // Create comparison for date >= dateFrom
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

        // Create comparison for date <= dateTo
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
            { "marriage.date.year": { $gt: fromY } },
            {
              $and: [
                { "marriage.date.year": fromY },
                {
                  $or: [
                    { "marriage.date.month": { $gt: fromM } },
                    {
                      $and: [
                        { "marriage.date.month": fromM },
                        { "marriage.date.day": { $gte: fromD } },
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
            { "marriage.date.year": { $lt: toY } },
            {
              $and: [
                { "marriage.date.year": toY },
                {
                  $or: [
                    { "marriage.date.month": { $lt: toM } },
                    {
                      $and: [
                        { "marriage.date.month": toM },
                        { "marriage.date.day": { $lte: toD } },
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
    if (filters.church) {
      andConditions.push({
        "marriage.church": new RegExp(filters.church, "i"),
      });
    }

    if (filters.place) {
      andConditions.push({
        "marriage.place": new RegExp(filters.place, "i"),
      });
    }

    if (filters.priest) {
      andConditions.push({
        "marriage.priestName": new RegExp(filters.priest, "i"),
      });
    }

    if (filters.pageNumber) {
      andConditions.push({
        pageNumber: parseInt(filters.pageNumber),
      });
    }

    // Combine all conditions
    if (andConditions.length > 0) {
      searchFilter.$and = andConditions;
    }

    const marriages = await Marriage.find(searchFilter)
      .sort({
        "marriage.date.year": -1,
        "marriage.date.month": -1,
        "marriage.date.day": -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Marriage.countDocuments(searchFilter);

    return {
      marriages: JSON.parse(JSON.stringify(marriages)),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      filters,
    };
  } catch (error) {
    console.error("Грешка при вчитување:", error);
    return {
      marriages: [],
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
export async function getMarriageById(id) {
  try {
    await connectDB();

    const marriage = await Marriage.findById(id).lean();

    if (!marriage) {
      return null;
    }

    return JSON.parse(JSON.stringify(marriage));
  } catch (error) {
    console.error("Грешка при вчитување:", error);
    return null;
  }
}
