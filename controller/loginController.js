
import { fetcher } from "../helper/fetcher.js"
import fs from 'fs/promises';


export const T10Login = async(req,res,next) => {
    const creds = {
    "password": "Rrr741136",
    "userName": "t10rohney01"
    }
    try{
        const response = await fetcher('https://ag.t10exchange.com/ag/login/agentLogin', 'POST', creds);
        console.log(response?.response?.data?.acessToken,"resp")
        await fs.writeFile("auth.json", JSON.stringify(response?.response?.data, null, 2));
        console.log("✅ Lotus auth saved");
        res.status(200).send({ message: response?.response?.data });
    }
    catch (err) {
    console.error("❌ T10 login error:", err);
    // res.status(500).send({ error: err.message });
    next(err)
  }
}