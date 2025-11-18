// import crypto from 'crypto';
// import fs from 'fs/promises';
// import { fetcher } from "../helper/fetcher.js";
// import { getDB } from '../db/mongo.js';

// const BETLIST_URL = 'https://ag.t10exchange.com/ag/exchange/betlist/getMasterBetList';

// // ✅ Deterministic ID generator
// const generateBetId = (bet) => {
//   const dataString = `${bet.userName}|${bet.selectionName}|${bet.oddsPrice}|${bet.stake}|${bet.createdAt}`;
//   return crypto.createHash('md5').update(dataString).digest('hex');
// };

// export const T10Betlist = async (req, res, next) => {
//   try {
//     const authData = await fs.readFile("auth.json", "utf-8");
//     const { accessToken, tokenType } = JSON.parse(authData);

//     const date = new Date();
//     const startDate = date.toISOString().split('T')[0];
//     const calculateDay = new Date(startDate);
//     const incrementDay = calculateDay.getDate() - 1;
//     const endDate = startDate.slice(0, 8) + (incrementDay >= 10 ? incrementDay : "0" + incrementDay);

//     const body = {
//       draw: 1,
//       columns: [
//         { data: "userName", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "sportName", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "selectionId", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "eventName", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "selectionName", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "type", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "oddsPrice", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "stake", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "createdAt", searchable: true, orderable: true, search: { value: "", regex: false } },
//         { data: "updatedAt", searchable: true, orderable: true, search: { value: "", regex: false } }
//       ],
//       order: [{ column: 0, dir: "desc" }],
//       start: 0,
//       length: Infinity,
//       search: { value: "", regex: false },
//       startDate: `${startDate}T00:00:00+05:30`,
//       endDate: `${startDate}T23:59:00+05:30`,
//       type: "unsettle",
//       sportId: "4",
//       dataSource: ""
//     };

//     console.log(startDate, endDate, "Dates");

//     const betDataReq = await fetcher(BETLIST_URL, 'POST', body, {
//       Authorization: `${tokenType} ${accessToken}`
//     });

//     const betDataRes = betDataReq?.response?.data;
//     console.log(betDataRes, "Fetched bets");
//     // const filteredBets = betDataRes?.original?.data?.filter(
//     //   bet => bet.marketName == "Match Odds" && bet.eventName === ("Australia v India" || "India W v England W") && bet.stake >= 1000
//     // ) || [];
//     const filteredBets = betDataRes?.original?.data?.filter(
//   bet =>
//     bet.marketName === "Match Odds" &&
//     ["Bangladesh v West Indies", "Sri Lanka W v Bangladesh W"].includes(bet.eventName) &&
//     bet.stake >= 1000
// ) || [];


//     const db = getDB()
//     const collection = db.collection("t10bets");

//     // ✅ Generate deterministic IDs
//     const betsWithId = filteredBets.map(bet => ({
//       ...bet,
//       betId: generateBetId(bet)
//     }));

//     // ✅ Get already stored bets (only betId to avoid large payload)
//     const betIds = betsWithId.map(b => b.betId);
//     const existing = await collection.find({ betId: { $in: betIds } }).project({ betId: 1 }).toArray();
//     const existingIds = new Set(existing.map(b => b.betId));

//     // ✅ Insert only new bets
//     const newUniqueBets = betsWithId.filter(bet => !existingIds.has(bet.betId));
//     if (newUniqueBets.length > 0) {
//       await collection.insertMany(newUniqueBets);
//       console.log(`✅ Inserted ${newUniqueBets.length} new bet(s) into MongoDB`);
//     } else {
//       console.log("ℹ️ No new bets to insert");
//     }

//     // ✅ Fetch full list from DB for response
//     const allBets = await collection.find({}).sort({matchedTime:-1}).toArray();

//     res.status(200).send({
//       added: newUniqueBets.length,
//       total: allBets.length,
//       data: allBets
//     });

//   } catch (err) {
//     console.error("❌ Error:", err);
//     return res.status(500).send({ error: 'Failed to fetch or update bets.' });
//   }
// };




import crypto from "crypto";
import fs from "fs/promises";
import { fetcher } from "../helper/fetcher.js";
import { getDB } from "../db/mongo.js";

const BETLIST_URL = "https://ag.t10exchange.com/ag/exchange/betlist/getMasterBetList";
const COLLECTION = "t10bets";

// --- Deterministic unique ID generator ---
const generateBetId = (bet) => {
  const data = `${bet.userName}|${bet.selectionName}|${bet.oddsPrice}|${bet.stake}|${bet.createdAt}`;
  return crypto.createHash("md5").update(data).digest("hex");
};

export const T10Betlist = async (req, res) => {
  try {
    const authData = await fs.readFile("auth.json", "utf-8");
    const { accessToken, tokenType } = JSON.parse(authData);

    const date = new Date();
    const day = date.toISOString().split("T")[0];
    const startDate = `${day}T00:00:00+05:30`;
    const endDate = `${day}T23:59:59+05:30`;

    const body = {
      draw: 1,
      columns: [
        { data: "userName" },
        { data: "sportName" },
        { data: "selectionId" },
        { data: "eventName" },
        { data: "selectionName" },
        { data: "type" },
        { data: "oddsPrice" },
        { data: "stake" },
        { data: "createdAt" },
        { data: "updatedAt" },
      ],
      order: [{ column: 0, dir: "desc" }],
      start: 0,
      length: 10000,
      search: { value: "", regex: false },
      startDate,
      endDate,
      type: "unsettle",
      sportId: "4",
      dataSource: "",
    };

    console.log(`⏰ Fetching bets for: ${startDate} → ${endDate}`);

    const betDataReq = await fetcher(BETLIST_URL, "POST", body, {
      Authorization: `${tokenType} ${accessToken}`,
    });

    const fetched = betDataReq?.response?.data?.original?.data || [];
    console.log(`📥 Total fetched: ${fetched.length}`);

    const filtered = fetched.filter(
      (b) =>
        b.marketName === "Match Odds" &&
        ["Hobart Hurricanes W v Adelaide Strikers W","Quetta Qavalry v Northern Warriors"].includes(b.eventName) &&
        b.stake >= 1000 && b.oddsPrice > 1.07 && b.oddsPrice < 14
    );
    console.log(`🎯 Filtered bets: ${filtered.length}`);

    if (!filtered.length) {
      const db = getDB();
      const collection = db.collection(COLLECTION);
      const all = await collection.find({}).sort({ matchedTime: -1 }).toArray();
      return res.status(200).send({ inserted: 0, total: all.length, data: all });
    }

    const db = getDB();
    const collection = db.collection(COLLECTION);

    // Ensure index exists once (unique betId)
    await collection.createIndex({ betId: 1 }, { unique: true });

    // let insertedCount = 0;
    // for (const bet of filtered) {
    //   const betId = generateBetId(bet);
    //   try {
    //     await collection.insertOne({ ...bet, betId });
    //     insertedCount++;
    //   } catch (e) {
    //     if (e.code !== 11000) console.error("⚠️ Insert error:", e.message);
    //   }
    // }

     const betsToInsert = filtered.map((b) => ({ ...b, betId: generateBetId(b) }));

    // ✅ Bulk insert, ignore duplicates
    const result = await collection
      .insertMany(betsToInsert, { ordered: false })
      .catch((err) => {
        if (err.code === 11000) return { insertedCount: err.result?.nInserted || 0 };
        throw err;
      });

    const insertedCount = result.insertedCount || 0;

    console.log(
      insertedCount
        ? `✅ Inserted ${insertedCount} new bet(s)`
        : "ℹ️ No new bets to insert"
    );

    const allBets = await collection.find({}).sort({ matchedTime: -1 }).toArray();
    res.status(200).send({ inserted: insertedCount, total: allBets.length, data: allBets });
  } catch (err) {
    console.error("❌ Error in T10Betlist:", err);
    res.status(500).send({ error: "Failed to fetch or update bets." });
  }
};


