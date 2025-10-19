import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Marriage from "@/lib/models/Marriage";
import Death from "@/lib/models/Death";
import Christening from "@/lib/models/Christening";

/**
 * API за autocomplete на имиња - пребарува низ сите книги
 * Филтрира по пол: машки имиња (groom, father) и женски (bride, mother)
 * GET /api/autocomplete/names?q=...&field=...&gender=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const field = searchParams.get("field"); // firstName, lastName, fatherName, bestMan, witness, priest
    const gender = searchParams.get("gender"); // male or female

    // Валидација
    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Поврзи со база
    await connectDB();

    const allSuggestions = new Set();

    // FIRSTNAME или FATHERNAME - пребарувај по пол (firstName и fatherName заедно)
    if (field === "firstName" || field === "fatherName") {
      if (gender === "male") {
        // МАШКИ ИМИЊА - од groom.firstName, groom.fatherName, father.firstName, deceased (male)
        const regex = new RegExp(`^${query}`, "i");

        // Marriages - groom firstName, fatherName, bestMan, witness
        try {
          const marriages = await Marriage.find({
            $or: [
              { "groom.firstName": { $regex: `^${query}`, $options: "i" } },
              { "groom.fatherName": { $regex: `^${query}`, $options: "i" } },
              { "bride.fatherName": { $regex: `^${query}`, $options: "i" } },
              {
                "marriage.bestMan.firstName": {
                  $regex: `^${query}`,
                  $options: "i",
                },
              },
              {
                "marriage.witness.firstName": {
                  $regex: `^${query}`,
                  $options: "i",
                },
              },
            ],
          })
            .select(
              "groom.firstName groom.fatherName bride.fatherName marriage.bestMan.firstName marriage.witness.firstName"
            )
            .limit(50)
            .lean();

          marriages.forEach((m) => {
            // Додај само ако одговара на query
            if (m.groom?.firstName && regex.test(m.groom.firstName)) {
              allSuggestions.add(m.groom.firstName);
            }
            if (m.groom?.fatherName && regex.test(m.groom.fatherName)) {
              allSuggestions.add(m.groom.fatherName);
            }
            if (m.bride?.fatherName && regex.test(m.bride.fatherName)) {
              allSuggestions.add(m.bride.fatherName);
            }
            if (
              m.marriage?.bestMan?.firstName &&
              regex.test(m.marriage.bestMan.firstName)
            ) {
              allSuggestions.add(m.marriage.bestMan.firstName);
            }
            if (
              m.marriage?.witness?.firstName &&
              regex.test(m.marriage.witness.firstName)
            ) {
              allSuggestions.add(m.marriage.witness.firstName);
            }
          });
        } catch (err) {}

        // Deaths - deceased (male firstName) and all fatherNames
        try {
          const deaths = await Death.find({
            $or: [
              {
                $and: [
                  {
                    "deceased.firstName": {
                      $regex: `^${query}`,
                      $options: "i",
                    },
                  },
                  { "deceased.gender": "Машки" },
                ],
              },
              { "deceased.fatherName": { $regex: `^${query}`, $options: "i" } },
            ],
          })
            .select("deceased.firstName deceased.fatherName deceased.gender")
            .limit(50)
            .lean();

          deaths.forEach((d) => {
            // Add firstName only if male AND matches query
            if (
              d.deceased?.firstName &&
              d.deceased?.gender === "Машки" &&
              regex.test(d.deceased.firstName)
            ) {
              allSuggestions.add(d.deceased.firstName);
            }
            // Add fatherName only if matches query
            if (d.deceased?.fatherName && regex.test(d.deceased.fatherName)) {
              allSuggestions.add(d.deceased.fatherName);
            }
          });
        } catch (err) {}

        // Christenings - father firstName + male child + godparent
        try {
          const christenings = await Christening.find({
            $or: [
              { "father.firstName": { $regex: `^${query}`, $options: "i" } },
              {
                "christening.godparentFirstName": {
                  $regex: `^${query}`,
                  $options: "i",
                },
              },
              {
                $and: [
                  { "child.firstName": { $regex: `^${query}`, $options: "i" } },
                  { "child.gender": "Машки" },
                ],
              },
            ],
          })
            .select(
              "father.firstName christening.godparentFirstName child.firstName child.gender"
            )
            .limit(50)
            .lean();

          christenings.forEach((c) => {
            if (c.father?.firstName && regex.test(c.father.firstName)) {
              allSuggestions.add(c.father.firstName);
            }
            if (
              c.christening?.godparentFirstName &&
              regex.test(c.christening.godparentFirstName)
            ) {
              allSuggestions.add(c.christening.godparentFirstName);
            }
            if (
              c.child?.firstName &&
              c.child?.gender === "Машки" &&
              regex.test(c.child.firstName)
            ) {
              allSuggestions.add(c.child.firstName);
            }
          });
        } catch (err) {}
      } else if (gender === "female") {
        // ЖЕНСКИ ИМИЊА - од bride.firstName, mother.firstName, deceased (female)
        const regex = new RegExp(`^${query}`, "i");

        // Marriages - bride firstName
        try {
          const marriages = await Marriage.find({
            $or: [
              { "bride.firstName": { $regex: `^${query}`, $options: "i" } },
              ...(field === "fatherName"
                ? [
                    {
                      "groom.fatherName": {
                        $regex: `^${query}`,
                        $options: "i",
                      },
                    },
                    {
                      "bride.fatherName": {
                        $regex: `^${query}`,
                        $options: "i",
                      },
                    },
                  ]
                : []),
            ],
          })
            .select("bride.firstName groom.fatherName bride.fatherName")
            .limit(50)
            .lean();

          marriages.forEach((m) => {
            if (m.bride?.firstName && regex.test(m.bride.firstName)) {
              allSuggestions.add(m.bride.firstName);
            }
            if (
              field === "fatherName" &&
              m.groom?.fatherName &&
              regex.test(m.groom.fatherName)
            ) {
              allSuggestions.add(m.groom.fatherName);
            }
            if (
              field === "fatherName" &&
              m.bride?.fatherName &&
              regex.test(m.bride.fatherName)
            ) {
              allSuggestions.add(m.bride.fatherName);
            }
          });
        } catch (err) {}

        // Deaths - deceased (female firstName) and fatherNames if requested
        try {
          const orConditions = [
            {
              $and: [
                {
                  "deceased.firstName": { $regex: `^${query}`, $options: "i" },
                },
                { "deceased.gender": "Женски" },
              ],
            },
          ];

          // Add fatherName search only if field is fatherName
          if (field === "fatherName") {
            orConditions.push({
              "deceased.fatherName": { $regex: `^${query}`, $options: "i" },
            });
          }

          const deaths = await Death.find({ $or: orConditions })
            .select("deceased.firstName deceased.fatherName deceased.gender")
            .limit(50)
            .lean();

          deaths.forEach((d) => {
            // Add firstName only if female AND matches query
            if (
              d.deceased?.firstName &&
              d.deceased?.gender === "Женски" &&
              regex.test(d.deceased.firstName)
            ) {
              allSuggestions.add(d.deceased.firstName);
            }
            // Add fatherName only if searching for fatherName AND matches
            if (
              field === "fatherName" &&
              d.deceased?.fatherName &&
              regex.test(d.deceased.fatherName)
            ) {
              allSuggestions.add(d.deceased.fatherName);
            }
          });
        } catch (err) {}

        // Christenings - mother firstName + female child
        try {
          const christenings = await Christening.find({
            $or: [
              { "mother.firstName": { $regex: `^${query}`, $options: "i" } },
              {
                $and: [
                  { "child.firstName": { $regex: `^${query}`, $options: "i" } },
                  { "child.gender": "Женски" },
                ],
              },
            ],
          })
            .select("mother.firstName child.firstName child.gender")
            .limit(50)
            .lean();

          christenings.forEach((c) => {
            if (c.mother?.firstName && regex.test(c.mother.firstName)) {
              allSuggestions.add(c.mother.firstName);
            }
            if (
              c.child?.firstName &&
              c.child?.gender === "Женски" &&
              regex.test(c.child.firstName)
            ) {
              allSuggestions.add(c.child.firstName);
            }
          });
        } catch (err) {}
      } else {
        // No gender specified - return both male and female names
        const regex = new RegExp(`^${query}`, "i");

        // Search all firstName fields from all models
        try {
          const marriages = await Marriage.find({
            $or: [
              { "groom.firstName": { $regex: `^${query}`, $options: "i" } },
              { "bride.firstName": { $regex: `^${query}`, $options: "i" } },
              { "groom.fatherName": { $regex: `^${query}`, $options: "i" } },
              { "bride.fatherName": { $regex: `^${query}`, $options: "i" } },
            ],
          })
            .select(
              "groom.firstName bride.firstName groom.fatherName bride.fatherName"
            )
            .limit(50)
            .lean();

          marriages.forEach((m) => {
            if (m.groom?.firstName && regex.test(m.groom.firstName)) {
              allSuggestions.add(m.groom.firstName);
            }
            if (m.bride?.firstName && regex.test(m.bride.firstName)) {
              allSuggestions.add(m.bride.firstName);
            }
            if (
              field === "fatherName" &&
              m.groom?.fatherName &&
              regex.test(m.groom.fatherName)
            ) {
              allSuggestions.add(m.groom.fatherName);
            }
            if (
              field === "fatherName" &&
              m.bride?.fatherName &&
              regex.test(m.bride.fatherName)
            ) {
              allSuggestions.add(m.bride.fatherName);
            }
          });
        } catch (err) {}

        // Deaths - all deceased names
        try {
          const deaths = await Death.find({
            $or: [
              { "deceased.firstName": { $regex: `^${query}`, $options: "i" } },
              ...(field === "fatherName"
                ? [
                    {
                      "deceased.fatherName": {
                        $regex: `^${query}`,
                        $options: "i",
                      },
                    },
                  ]
                : []),
            ],
          })
            .select("deceased.firstName deceased.fatherName")
            .limit(50)
            .lean();

          deaths.forEach((d) => {
            if (d.deceased?.firstName && regex.test(d.deceased.firstName)) {
              allSuggestions.add(d.deceased.firstName);
            }
            if (
              field === "fatherName" &&
              d.deceased?.fatherName &&
              regex.test(d.deceased.fatherName)
            ) {
              allSuggestions.add(d.deceased.fatherName);
            }
          });
        } catch (err) {}

        // Christenings - child, father, mother, godparent (only firstName, no fatherName field)
        try {
          const christenings = await Christening.find({
            $or: [
              { "child.firstName": { $regex: `^${query}`, $options: "i" } },
              { "father.firstName": { $regex: `^${query}`, $options: "i" } },
              { "mother.firstName": { $regex: `^${query}`, $options: "i" } },
              {
                "christening.godparentFirstName": {
                  $regex: `^${query}`,
                  $options: "i",
                },
              },
            ],
          })
            .select(
              "child.firstName father.firstName mother.firstName christening.godparentFirstName"
            )
            .limit(50)
            .lean();

          christenings.forEach((c) => {
            if (c.child?.firstName && regex.test(c.child.firstName)) {
              allSuggestions.add(c.child.firstName);
            }
            if (c.father?.firstName && regex.test(c.father.firstName)) {
              allSuggestions.add(c.father.firstName);
            }
            if (c.mother?.firstName && regex.test(c.mother.firstName)) {
              allSuggestions.add(c.mother.firstName);
            }
            if (
              c.christening?.godparentFirstName &&
              regex.test(c.christening.godparentFirstName)
            ) {
              allSuggestions.add(c.christening.godparentFirstName);
            }
          });
        } catch (err) {}
      }
    }

    // LASTNAME - пребарувај низ сите lastName полиња (без gender filter)
    else if (field === "lastName") {
      const regex = new RegExp(`^${query}`, "i");

      // Marriages
      try {
        const marriages = await Marriage.find({
          $or: [
            { "groom.lastName": { $regex: `^${query}`, $options: "i" } },
            { "bride.lastName": { $regex: `^${query}`, $options: "i" } },
            {
              "marriage.bestMan.lastName": {
                $regex: `^${query}`,
                $options: "i",
              },
            },
            {
              "marriage.witness.lastName": {
                $regex: `^${query}`,
                $options: "i",
              },
            },
          ],
        })
          .select(
            "groom.lastName bride.lastName marriage.bestMan.lastName marriage.witness.lastName"
          )
          .limit(50)
          .lean();

        marriages.forEach((m) => {
          if (m.groom?.lastName && regex.test(m.groom.lastName)) {
            allSuggestions.add(m.groom.lastName);
          }
          if (m.bride?.lastName && regex.test(m.bride.lastName)) {
            allSuggestions.add(m.bride.lastName);
          }
          if (
            m.marriage?.bestMan?.lastName &&
            regex.test(m.marriage.bestMan.lastName)
          ) {
            allSuggestions.add(m.marriage.bestMan.lastName);
          }
          if (
            m.marriage?.witness?.lastName &&
            regex.test(m.marriage.witness.lastName)
          ) {
            allSuggestions.add(m.marriage.witness.lastName);
          }
        });
      } catch (err) {}

      // Deaths
      try {
        const deaths = await Death.find({
          "deceased.lastName": { $regex: `^${query}`, $options: "i" },
        })
          .select("deceased.lastName")
          .limit(50)
          .lean();

        deaths.forEach((d) => {
          if (d.deceased?.lastName && regex.test(d.deceased.lastName)) {
            allSuggestions.add(d.deceased.lastName);
          }
        });
      } catch (err) {}

      // Christenings
      try {
        const christenings = await Christening.find({
          $or: [
            { "child.lastName": { $regex: `^${query}`, $options: "i" } },
            { "father.lastName": { $regex: `^${query}`, $options: "i" } },
            { "mother.lastName": { $regex: `^${query}`, $options: "i" } },
            {
              "christening.godparentLastName": {
                $regex: `^${query}`,
                $options: "i",
              },
            },
          ],
        })
          .select(
            "child.lastName father.lastName mother.lastName christening.godparentLastName"
          )
          .limit(50)
          .lean();

        christenings.forEach((c) => {
          if (c.child?.lastName && regex.test(c.child.lastName)) {
            allSuggestions.add(c.child.lastName);
          }
          if (c.father?.lastName && regex.test(c.father.lastName)) {
            allSuggestions.add(c.father.lastName);
          }
          if (c.mother?.lastName && regex.test(c.mother.lastName)) {
            allSuggestions.add(c.mother.lastName);
          }
          if (
            c.christening?.godparentLastName &&
            regex.test(c.christening.godparentLastName)
          ) {
            allSuggestions.add(c.christening.godparentLastName);
          }
        });
      } catch (err) {}
    }

    // FULL NAMES - priest, bestMan, witness, godparent
    else if (field === "bestMan" || field === "witness" || field === "priest") {
      const regex = new RegExp(`^${query}`, "i");

      // Marriages
      try {
        const searchFields = {};
        if (field === "bestMan") {
          searchFields["marriage.bestMan.name"] = {
            $regex: `^${query}`,
            $options: "i",
          };
        } else if (field === "witness") {
          searchFields["marriage.witness.name"] = {
            $regex: `^${query}`,
            $options: "i",
          };
        } else if (field === "priest") {
          searchFields["marriage.priestName"] = {
            $regex: `^${query}`,
            $options: "i",
          };
        }

        const marriages = await Marriage.find(searchFields).limit(50).lean();

        marriages.forEach((m) => {
          if (
            field === "bestMan" &&
            m.marriage?.bestMan?.name &&
            regex.test(m.marriage.bestMan.name)
          ) {
            allSuggestions.add(m.marriage.bestMan.name);
          } else if (
            field === "witness" &&
            m.marriage?.witness?.name &&
            regex.test(m.marriage.witness.name)
          ) {
            allSuggestions.add(m.marriage.witness.name);
          } else if (
            field === "priest" &&
            m.marriage?.priestName &&
            regex.test(m.marriage.priestName)
          ) {
            allSuggestions.add(m.marriage.priestName);
          }
        });
      } catch (err) {}

      // Deaths - priest
      if (field === "priest") {
        try {
          const deaths = await Death.find({
            "burial.priestName": { $regex: `^${query}`, $options: "i" },
          })
            .select("burial.priestName")
            .limit(50)
            .lean();

          deaths.forEach((d) => {
            if (d.burial?.priestName && regex.test(d.burial.priestName)) {
              allSuggestions.add(d.burial.priestName);
            }
          });
        } catch (err) {}
      }

      // Christenings - priest and godparent
      try {
        const searchFields = {};
        if (field === "priest") {
          searchFields["christening.priestName"] = {
            $regex: `^${query}`,
            $options: "i",
          };
        } else {
          // bestMan and witness can also match godparent
          searchFields["christening.godparent.name"] = {
            $regex: `^${query}`,
            $options: "i",
          };
        }

        const christenings = await Christening.find(searchFields)
          .limit(50)
          .lean();

        christenings.forEach((c) => {
          if (
            field === "priest" &&
            c.christening?.priestName &&
            regex.test(c.christening.priestName)
          ) {
            allSuggestions.add(c.christening.priestName);
          } else if (
            c.christening?.godparent?.name &&
            regex.test(c.christening.godparent.name)
          ) {
            allSuggestions.add(c.christening.godparent.name);
          }
        });
      } catch (err) {}
    }

    // Конвертирај Set во array и ограничи на 10
    const suggestions = Array.from(allSuggestions).slice(0, 10);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Autocomplete грешка:", error);
    return NextResponse.json([]);
  }
}
