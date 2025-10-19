"use server";

import { connectDB } from "@/lib/db";
import Christening from "@/lib/models/Christening";

/**
 * Зема листа на крстени со пагинација и пребарување
 * @param {number} page - Број на страна (default: 1)
 * @param {number} limit - Број на записи по страна (default: 20)
 * @param {Object} filters - Search filters
 * @returns {Promise<{christenings: Array, total: number, pages: number}>}
 */
export async function getChristenings(page = 1, limit = 20, filters = {}) {
  try {
    await connectDB();

    const skip = (page - 1) * limit;

    // Изгради search filter
    const searchFilter = {};
    const andConditions = [];

    // Пребарување по име на дете/родители
    if (filters.name && filters.name.trim()) {
      const regex = new RegExp(filters.name.trim(), "i");
      andConditions.push({
        $or: [
          { "child.firstName": regex },
          { "child.lastName": regex },
          { "father.firstName": regex },
          { "father.lastName": regex },
          { "mother.firstName": regex },
          { "mother.lastName": regex },
        ],
      });
    }

    // Date range filter (christening date)
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
            { "christening.date.year": { $gt: fromY } },
            {
              $and: [
                { "christening.date.year": fromY },
                {
                  $or: [
                    { "christening.date.month": { $gt: fromM } },
                    {
                      $and: [
                        { "christening.date.month": fromM },
                        { "christening.date.day": { $gte: fromD } },
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
            { "christening.date.year": { $lt: toY } },
            {
              $and: [
                { "christening.date.year": toY },
                {
                  $or: [
                    { "christening.date.month": { $lt: toM } },
                    {
                      $and: [
                        { "christening.date.month": toM },
                        { "christening.date.day": { $lte: toD } },
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
          { "child.birthPlace": new RegExp(filters.place, "i") },
          { "christening.place": new RegExp(filters.place, "i") },
        ],
      });
    }

    if (filters.priest) {
      andConditions.push({
        "christening.priestName": new RegExp(filters.priest, "i"),
      });
    }

    if (filters.godparent) {
      andConditions.push({
        $or: [
          {
            "christening.godparentFirstName": new RegExp(
              filters.godparent,
              "i"
            ),
          },
          {
            "christening.godparentLastName": new RegExp(filters.godparent, "i"),
          },
        ],
      });
    }

    if (filters.pageNumber) {
      andConditions.push({
        pageNumber: filters.pageNumber,
      });
    }

    if (filters.gender) {
      andConditions.push({
        "child.gender": filters.gender,
      });
    }

    // Combine all conditions
    if (andConditions.length > 0) {
      searchFilter.$and = andConditions;
    }

    const christenings = await Christening.find(searchFilter)
      .sort({
        "christening.date.year": -1,
        "christening.date.month": -1,
        "christening.date.day": -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Christening.countDocuments(searchFilter);

    return {
      christenings: JSON.parse(JSON.stringify(christenings)),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      filters,
    };
  } catch (error) {
    console.error("Грешка при вчитување:", error);
    return {
      christenings: [],
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
export async function getChristeningById(id) {
  try {
    await connectDB();

    const christening = await Christening.findById(id).lean();

    if (!christening) {
      return null;
    }

    return JSON.parse(JSON.stringify(christening));
  } catch (error) {
    console.error("Грешка при вчитување:", error);
    return null;
  }
}
