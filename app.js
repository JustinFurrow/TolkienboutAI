require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const OpenAI = require('openai');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const http = rateLimit(axios.create(), { maxRequests: 100, perMilliseconds: 600000 });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

app.post('/query-character', async (req, res) => {
    console.log("Received request for character:", req.body.characterName);
    const characterName = req.body.characterName;
    if (typeof characterName !== 'string' || characterName.trim() === '') {
        return res.status(400).json({ success: false, message: "Invalid input" });
    }

    try {
        const isValid = await isValidCharacter(characterName);
        if (isValid) {
            const response = await queryOpenAI(characterName);
            res.json({ success: true, response });
        } else {
            res.json({ success: false, message: "Character not found in LOTR universe." });
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

async function isValidCharacter(userInput) {
    try {
        const response = await http.get('https://the-one-api.dev/v2/character', {
            headers: { 'Authorization': `Bearer ${process.env.LOTR_API_KEY}` }
        });

        // Extracting character names from the response data
        const characterData = response.data.docs;
        const characterNames = characterData.map(character => character.name.toLowerCase());
        
        console.log("Extracted character names:", characterNames); // Debug log

        return characterNames.includes(userInput.trim().toLowerCase());
    } catch (error) {
        console.error("Error occurred while fetching or parsing LOTR API data:", error);
        throw error;
    }
}

async function queryOpenAI(characterName) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `You are a wizened loremaster - a wizard perhaps, in the Lord of the Rings series. What lore do you know of ${characterName}` }]
        });

        console.log("OpenAI API response:", chatCompletion); // Debug log

        // Extract the text content from the response
        const responseText = chatCompletion.choices[0].message.content;
        console.log("Response text to be sent:", responseText); // Debug log

        return responseText;
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error("OpenAI API Error:", error);
        } else {
            // Non-API error
            console.error("Non-API Error:", error);
        }
        throw error;
    }
}



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));