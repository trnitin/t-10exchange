// import fs from 'fs/promises';
// import { fetcher } from "../helper/fetcher.js"
// import {v4} from 'uuid';


// const BETLIST_URL = 'https://ag.t10exchange.com/ag/exchange/betlist/getMasterBetList';

// export const T10Betlist = async (req, res, next) => {
//     try {
//         const authData = await fs.readFile("auth.json", "utf-8");
//         const { accessToken, tokenType } = JSON.parse(authData);

//         const date = new Date()
//         const startDate = date.toISOString().split('T')[0];
//         const calculateDay = new Date(startDate);
//         const incrementDay = calculateDay.getDate() + 1;
//         const endDate = startDate.slice(0,8) + incrementDay
       
//         const body = {
//             "draw": 1, 
//             "columns": [
//             { "data": "userName", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }, 
//             { "data": "sportName", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
//             { "data": "selectionId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
//             { "data": "eventName", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }, 
//             { "data": "selectionName", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }, 
//             { "data": "type", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }, 
//             { "data": "oddsPrice", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }, 
//             { "data": "stake", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }, 
//             { "data": "createdAt", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }, 
//             { "data": "updatedAt", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }
//             ],
//             "order": [{ "column": 0, "dir": "desc" }], "start": 0, "length": Infinity, "search": { "value": "", "regex": false }, 
//             "startDate": `${startDate}T00:00:00+05:30`, 
//             "endDate": `${endDate}T23:59:00+05:30`, 
//             "type": "unsettle", 
//             "sportId": "4",
//             "dataSource": "" 
//         }

//         const betDataReq = await fetcher(BETLIST_URL, 'POST', body, {
//             Authorization: tokenType + ' ' + accessToken
//         });
//         const betDataRes = await betDataReq?.response?.data;
//         const filteredBets = betDataRes?.original?.data?.filter(bet => bet.marketName === 'Match Odds' && bet.eventName === "Pakistan v Sri Lanka",);
//         const betsWithId = filteredBets.filter(bet => bet.betId === undefined).map(bet => ({ ...bet, betId: v4() }));
//         console.log(betsWithId?.length, "betsWithId")
//         console.log(filteredBets?.length, "filtered")
//         await fs.writeFile("betlist.json", JSON.stringify(betsWithId, null, 2));
//         res.status(200).send({ message: betsWithId }); 
//     } catch (err) {
//         console.error("❌ Error reading auth file:", err);
//         return res.status(500).send({ error: 'Authentication data not found. Please login first.' });
//     }
// }

// ------------------------------------------------------------------------------------------------------------------------

// import fs from 'fs/promises';
// import crypto from 'crypto';
// import { fetcher } from "../helper/fetcher.js";

// const BETLIST_URL = 'https://ag.t10exchange.com/ag/exchange/betlist/getMasterBetList';

// // Generate deterministic ID based on bet fields
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
//     const incrementDay = calculateDay.getDate() + 1;
//     const endDate = startDate.slice(0, 8) + incrementDay;

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
//       endDate: `${endDate}T23:59:00+05:30`,
//       type: "unsettle",
//       sportId: "4",
//       dataSource: ""
//     };

//     const betDataReq = await fetcher(BETLIST_URL, 'POST', body, {
//       Authorization: `${tokenType} ${accessToken}`
//     });

//     const betDataRes = betDataReq?.response?.data;
//     const filteredBets = betDataRes?.original?.data?.filter(
//       bet => (bet.marketName === "Match Odds" || bet.marketName === 'Bookmakers') && bet.eventName === "Pakistan v Sri Lanka"
//     ) || [];

//     // ✅ Load existing betlist.json
//     let existingBets = [];
//     try {
//       const fileContent = await fs.readFile("betlist.json", "utf-8");
//       existingBets = JSON.parse(fileContent);
//     } catch {
//       console.log("ℹ️ betlist.json not found, creating a new one.");
//     }

//     const existingIds = new Set(existingBets.map(b => b.betId));

//     // ✅ Generate deterministic betIds and only add new bets
//     const newUniqueBets = filteredBets.map(bet => ({
//       ...bet,
//       betId: generateBetId(bet)
//     })).filter(bet => !existingIds.has(bet.betId));

//     // ✅ Merge and write back
//     const finalBetList = [...existingBets, ...newUniqueBets];
//     await fs.writeFile("betlist.json", JSON.stringify(finalBetList, null, 2));
//     console.log(finalBetList?.length, "Total bets in betlist.json");
//     console.log(newUniqueBets?.length, "New unique bets added");
    

//     res.status(200).send({ added: newUniqueBets.length, message: newUniqueBets });
//   } catch (err) {
//     console.error("❌ Error:", err);
//     return res.status(500).send({ error: 'Failed to fetch or update bets.' });
//   }
// };


// ------------------------------------------------------------------------------------------------------------------------------------

import crypto from 'crypto';
import fs from 'fs/promises';
import { fetcher } from "../helper/fetcher.js";
// import { connect } from "../db/mongo.js";
import { getDB } from '../db/mongo.js';

const BETLIST_URL = 'https://ag.t10exchange.com/ag/exchange/betlist/getMasterBetList';

// ✅ Deterministic ID generator
const generateBetId = (bet) => {
  const dataString = `${bet.userName}|${bet.selectionName}|${bet.oddsPrice}|${bet.stake}|${bet.createdAt}`;
  return crypto.createHash('md5').update(dataString).digest('hex');
};

export const T10Betlist = async (req, res, next) => {
  try {
    const authData = await fs.readFile("auth.json", "utf-8");
    const { accessToken, tokenType } = JSON.parse(authData);

    const date = new Date();
    const startDate = date.toISOString().split('T')[0];
    const calculateDay = new Date(startDate);
    const incrementDay = calculateDay.getDate() + 1;
    const endDate = startDate.slice(0, 8) + incrementDay;

    const body = {
      draw: 1,
      columns: [
        { data: "userName", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "sportName", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "selectionId", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "eventName", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "selectionName", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "type", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "oddsPrice", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "stake", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "createdAt", searchable: true, orderable: true, search: { value: "", regex: false } },
        { data: "updatedAt", searchable: true, orderable: true, search: { value: "", regex: false } }
      ],
      order: [{ column: 0, dir: "desc" }],
      start: 0,
      length: Infinity,
      search: { value: "", regex: false },
      startDate: `${startDate}T00:00:00+05:30`,
      endDate: `${endDate}T23:59:00+05:30`,
      type: "unsettle",
      sportId: "4",
      dataSource: ""
    };

    const betDataReq = await fetcher(BETLIST_URL, 'POST', body, {
      Authorization: `${tokenType} ${accessToken}`
    });

    const betDataRes = betDataReq?.response?.data;
    const filteredBets = betDataRes?.original?.data?.filter(
      bet => bet.marketName === "Match Odds" && bet.eventName === "Pakistan v Sri Lanka"
    ) || [];

    // ✅ Connect to DB
    // const db = await connect();
    const db = getDB()
    const collection = db.collection("t10bets");

    // ✅ Generate deterministic IDs
    const betsWithId = filteredBets.map(bet => ({
      ...bet,
      betId: generateBetId(bet)
    }));

    // ✅ Get already stored bets (only betId to avoid large payload)
    const betIds = betsWithId.map(b => b.betId);
    const existing = await collection.find({ betId: { $in: betIds } }).project({ betId: 1 }).toArray();
    const existingIds = new Set(existing.map(b => b.betId));

    // ✅ Insert only new bets
    const newUniqueBets = betsWithId.filter(bet => !existingIds.has(bet.betId));
    if (newUniqueBets.length > 0) {
      await collection.insertMany(newUniqueBets);
      console.log(`✅ Inserted ${newUniqueBets.length} new bet(s) into MongoDB`);
    } else {
      console.log("ℹ️ No new bets to insert");
    }

    // ✅ Fetch full list from DB for response
    const allBets = await collection.find({}).toArray();

    res.status(200).send({
      added: newUniqueBets.length,
      total: allBets.length,
      data: allBets
    });

  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).send({ error: 'Failed to fetch or update bets.' });
  }
};
