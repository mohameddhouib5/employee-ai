import fs from 'fs/promises';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import express from "express";
import cors from "cors";
dotenv.config();
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Helper to parse one profile block
function parseProfileBlock(block) {
  const nameMatch = block.match(/Name:\s*(.*)/);
  const roleMatch = block.match(/Role:\s*(.*)/);
  const expMatch = block.match(/Years of Experience:\s*(\d+)/);
  const skillsMatch = block.match(/Skills:\s*(.*)/);
  const summaryMatch = block.match(/Summary:\s*(.*)/);
  const imgMatch = block.match(/Image:\s*(.*)/);

  return {
    name: nameMatch?.[1] ?? '',
    role: roleMatch?.[1] ?? '',
    years_experience: parseInt(expMatch?.[1] ?? '0', 10),
    skills: skillsMatch?.[1] ?? '',
    profile_summary: summaryMatch?.[1] ?? '',
    img: imgMatch?.[1] ?? '',
  };
}

async function processProfiles() {
  const file = await fs.readFile('profiles.txt', 'utf-8');
  const blocks = file.split('---').map(block => block.trim()).filter(Boolean);

  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  const employeeData = await Promise.all(
    blocks.map(async (block) => {
      const profile = parseProfileBlock(block);
      const toEmbed = `
        Name: ${profile.name}
        Role: ${profile.role}
        Years of Experience: ${profile.years_experience}
        Skills: ${profile.skills}
        Summary: ${profile.profile_summary}
      `;

      const embedResult = await model.embedContent(toEmbed);
      const embedding = embedResult.embedding.values;

      return {
        ...profile,
        embedding,
      };
    })
  );

  const { error } = await supabase.from('employees').insert(employeeData);

  if (error) {
    console.error('Error inserting into Supabase:', error.message);
  } else {
    console.log(`Inserted ${employeeData.length} employees successfully.`);
  }
}



// Add employee (no embedding yet — just for manage UI)
app.post("/add-employee", async (req, res) => {
  try {
    const { name, role, years_experience, skills, img } = req.body;

    const summary = `${name} is a ${role} with ${years_experience} years of experience. Skills: ${skills.join(", ")}`;

    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const embeddingRes = await model.embedContent({
      content: { parts: [{ text: summary }] },
    });
    const embedding = embeddingRes.embedding.values;

    const { data, error } = await supabase.from("employees").insert([
      {
        name,
        role,
        years_experience: Number(years_experience),
        skills,
        img,
        embedding,
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to insert employee" });
    }

    res.json({ success: true, employee: data?.[0] || null });
  } catch (err) {
    console.error("❌ Embedding or insert error:", err);
    res.status(500).json({ error: "Failed to process employee" });
  }
});

// Get all employees
app.get("/employees", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("id, name, role, years_experience, skills, img");

    if (error) {
      console.error("❌ Supabase fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch employees" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Server error fetching employees:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Delete employee by id
app.delete("/delete-employee/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const { error } = await supabase.from("employees").delete().eq("id", id);

    if (error) {
      console.error("❌ Supabase delete error:", error);
      return res.status(500).json({ error: "Failed to delete employee" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Server error deleting employee:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/search-employees", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    // Get embedding for query
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const embeddingRes = await embeddingModel.embedContent({
      content: { parts: [{ text: query }] },
    });
    const queryEmbedding = embeddingRes.embedding.values;

    // Call Supabase stored proc to find matching employees
    const { data: employees, error } = await supabase.rpc("match_employees", {
      query_embedding: queryEmbedding,
      match_threshold: 0.2,
      match_count: 5,
    });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Database search error" });
    }
    if (!employees || employees.length === 0) {
      return res.json({ results: [], explanation: "No matching employees found." });
    }

    // Prepare context string for Gemini chat: list employee summaries
    const context = employees.map(emp => {
      const skills = typeof emp.skills === "string" ? JSON.parse(emp.skills) : emp.skills;
      return `${emp.name}, ${emp.role}, ${emp.years_experience} years experience, skills: ${skills.join(", ")}`;
    }).join("\n");

    // Prepare chat messages for explanation
    const chatMessages = [
  {
    role: "user",
    parts: [
      {
        text: `You are a highly analytical assistant tasked with evaluating employees to find the best matches based on the user's query.

Given the following employee data:
${context}

And the user's query:
${query}

Your task is to:
- Analyze the query and determine what the user is looking for.
- Identify which employees best match the query.
- Return a **single, clear paragraph** that explains which employees are the best fit and why.

Keep the explanation simple and human-friendly-readable. Do not use lists, bullet points, steps, or numbered sections. Just summarize your reasoning in a short paragraph .`
      }
    ]
  }
];


    // Call Gemini chat model for explanation
    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chatResponse = await chatModel.generateContent({ contents: chatMessages });
    const explanationText = await chatResponse.response.text();

    res.json({
      results: employees,
      explanation: explanationText.trim(),
    });
  } catch (err) {
    console.error("Search employees error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));