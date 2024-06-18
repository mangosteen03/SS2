import OpenAI from "openai";
import Activity from "./../models/Activity.js";
import User from "./../models/User.js";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getActivities = async (req, res) => {
  const { name, picture } = req.user;
  const userEmail = req.user.email;

  try {
    const user = await User.findOne({
      where: { email: userEmail },
      include: {
        model: Activity,
        order: [["timestamp", "ASC"]],
      },
    });
    const activities = user ? user.Activities : [];
    res.render("user_activities", { activities, name, picture });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).send("Error fetching activities");
  }
};

const grammarCheck = async (req, res) => {
  const { text } = req.body;

  const escapedText = text.replace(/[\n\r]/g, " ").replace(/"/g, '\\"');
  const message = `Check and correct the grammar of the following text:\n\n"${escapedText}"\n\nReturn the result as JSON with "highlighted_text" and "errors" keys. "highlighted_text" should contain the input text with only the incorrect words highlighted in red using <strong style="color: red;"></strong> tags. "errors" should be a list of objects, each with "incorrect_word" and "suggestion". Do not highlight the entire sentence, only the specific words that are incorrect.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: message,
        },
      ],
    });

    if (response.choices && response.choices.length > 0) {
      let jsonObject;
      const jsonResponse = response.choices[0].message.content;
      jsonObject = JSON.parse(jsonResponse);
      const { highlighted_text, errors } = jsonObject;
      const userEmail = req.user.email;
      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
      });

      await Activity.create({
        userEmail,
        activityType: "grammar-check",
        input: text,
        output: highlighted_text,
        timestamp,
      });

      res.render("grammar_check_result", {
        highlightedText: highlighted_text,
        errors: errors || [],
        question: text,
      });
    } else {
      res
        .status(500)
        .send("Error in grammar check: No response choices available");
    }
  } catch (error) {
    console.error("Error in grammar check:", error);
    res.status(500).send("Error in grammar check");
  }
};

const paraphraseText = async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Please paraphrase the following text:\n\n${text}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    if (response.choices && response.choices.length > 0) {
      const paraphrasedText = response.choices[0].message.content;
      const userEmail = req.user.email;
      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
      });

      await Activity.create({
        userEmail,
        activityType: "paraphrasing",
        input: text,
        output: paraphrasedText,
        timestamp,
      });
      res.render("paraphrasing_result", {
        originalText: text,
        paraphrasedText,
      });
    } else {
      res.status(500).send("Error in paraphrasing");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in paraphrasing");
  }
};

const completeTextHandle = async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Complete the following text:\n\n${text}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    if (response.choices && response.choices.length > 0) {
      const textCompleted = response.choices[0].message.content;
      const userEmail = req.user.email;
      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
      });

      await Activity.create({
        userEmail,
        activityType: "text-completion",
        input: text,
        output: textCompleted,
        timestamp,
      });
      res.render("text_completion_result", {
        originalText: text,
        textCompleted,
      });
    } else {
      res.status(500).send("Error in text completion");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in text completion");
  }
};

const googleSearch = async (query) => {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}`;
  const response = await axios.get(url);
  return response.data;
};

const checkPlagiarism = async (req, res) => {
  const { text } = req.body;

  try {
    const sentences = text.split('.').filter(sentence => sentence.trim());
    let plagiarismResults = [];
    let matchCount = 0;

    for (const sentence of sentences) {
      const results = await googleSearch(sentence);
      if (results.items && results.items.length > 0) {
        matchCount++;
        results.items.slice(0, 10).forEach(item => {
          plagiarismResults.push({
            sentence: sentence.trim(),
            title: item.title,
            link: item.link,
            snippet: item.snippet,
          });
        });
      }
    }

    const matchPercentage = (matchCount / sentences.length) * 100;

    const userEmail = req.user.email;
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
    });

    await Activity.create({
      userEmail,
      activityType: 'plagiarism-check',
      input: text,
      output: JSON.stringify(plagiarismResults),
      timestamp,
    });

    // get 10 first results
    plagiarismResults = plagiarismResults.slice(0, 10);

    res.render('plagiarism_check_result', {
      originalText: text,
      plagiarismResults,
      matchPercentage: matchPercentage.toFixed(2),  // Làm tròn kết quả đến 2 chữ số thập phân
    });

  } catch (error) {
    console.error('Error in plagiarism check:', error);
    res.status(500).send('Error in plagiarism check');
  }
};
export { getActivities, grammarCheck, paraphraseText, completeTextHandle,checkPlagiarism };
