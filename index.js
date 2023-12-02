import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "dotenv/config";
import { getSign, getZodiac } from "horoscope";
import OpenAI from "openai";
// https://www.npmjs.com/package/openai

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url); //go to this url and serve that
const __dirname = dirname(__filename);

app.use(bodyParser.json());

app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.post("/submit", (req, res) => {
  // console.log(req.body)
  let nickName = req.body.nickName;
  let Role = req.body.Role;
  let genre = req.body.genre;

  // let userDOB = dob.split("-");
  // let userZodiac = getZodiac(Number(userDOB[0]));
  // let userHoroscope = getSign({
  //   month: Number(userDOB[1]),
  //   day: Number(userDOB[2]),
  // });

  let gptResponse = "failed to generate output.. Please try again..";

  console.log("--GPT info sending...");
  async function getGptResultAsString(
    // userZodiac,
    // userHoroscope,
    nickName,
    Role,
    genre
  ) {
    try {
      const result = await gpt(nickName, Role, genre);
      return JSON.stringify(result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  getGptResultAsString(nickName, Role, genre).then((response) => {
    gptResponse = response;
    console.log(`--GPT promise processed`);
  });

  setTimeout(async () => {
    // *** I set a timeout here so the information[response] are send to client.js later (wait until gpt done generating)
    console.log(`--RIGHT BEFORE respnose json`);
    const response = {
      message: `Welcome, ${nickName}!`,
      setting: `Your character has been chosen as ${Role}! The game's genre will be ${genre}`,
      gpt: `${gptResponse}`,
    };
    res.json(response);

    // *** when im testing, 50 words take less then 5 second, if you need more time to generate it, add time to the below variable!
  }, 5000);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //

const openai = new OpenAI({
  apiKey: process.env.GPTAPIKEY,
});

async function gpt(nickName, Role, genre) {
  console.log("--GPT info received...");
  // Non-streaming:
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `please create D&D character setting based on their nickname : ${nickName}, their role : ${Role}, their genre : ${genre} in following order: Character Information, Ability Scores, Background within 200words and do not include "" sign `,
      },
    ],
    model: "gpt-3.5-turbo-1106",
    // *** use gpt3.5 so it's cheaper!
  });
  console.log("--GPT Result:");
  // console.log(completion.choices[0]?.message?.content);
  let gptResult = completion.choices[0]?.message?.content;

  //change /n to <br> tag
  const formattedCharacterInfo =
    completion.choices[0]?.message?.content.replace(/\n/g, "<br>");
  console.log(formattedCharacterInfo);
  console.log(gptResult);

  // return gptResult;
  return formattedCharacterInfo; // Return the formatted character info with HTML line breaks
}
