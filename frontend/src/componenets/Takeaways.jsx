import React, { useState } from "react";
import "./Takeaways.css";

const Takeaways = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: 1,
      title: "1. Introduction – The Magic Behind Spotify ",
      content: (
        <>
          <p>It’s 2025! Honestly, who doesn’t use Spotify to play music these days? It's the biggest platform for music streaming. But what makes it magical isn’t just the songs — it’s the smart player behind the scenes.</p>
          <p>Spotify recommends songs that match our mood and preferences. But how? It all starts with transforming songs and artist info into numerical vectors — a process called <strong>vector embeddings</strong>. These embeddings help Spotify deliver ultra-personalized recommendations that feel like magic.</p>
          <p>This technique has made Spotify blazing fast, super scalable, and truly smart!</p>
        </>
      ),
    },
    {
      id: 2,
      title: "2. What Are Embeddings? ",
      content: (
        <>
          <p>Every day, we interact with platforms like Amazon, Google, and Instagram that sift through massive data. How do they seem to “understand” us?</p>
          <p>The answer is: <strong>embeddings</strong> — the secret language of AI! 🤖</p>
          <p>Embeddings represent words, images, audio, or video as numerical vectors in a special space. For example:</p>
          <ul>
            <li>"cat" → (4.5, 12.2)</li>
            <li>"feline" → (4.7, 12.6) → Similar meaning!</li>
            <li>"kitten" → (5.1, 12.1)</li>
            <li>"dog" → (7.5, 10.5) → Different meaning</li>
          </ul>
          <p>Cool, right? Embeddings help machines "feel" how similar two things are.</p>
        </>
      ),
    },
    {
      id: 3,
      title: "3. Text Embeddings ",
      content: (
        <>
          <p>Text, words, or even whole sentences can be turned into vectors. To do this, we send the text to an <strong>embedding model</strong> like <code>text-embedding-ada-002</code> from OpenAI.</p>
          <p>This model converts text into vectors that algorithms can easily work with for search, grouping, or recommendations.</p>
          <p><strong>Example:</strong></p>
          <p>Text: <code>Hello, world!</code></p>
          <p>Embedding: <code>[0.0015, 0.0033, -0.0127, ...]</code> (truncated for simplicity)</p>
        </>
      ),
    },
    {
      id: 4,
      title: "4. Vector Databases ",
      content: (
        <>
          <p>Vector databases (like Supabase, Chroma, or Pinecone) are made to store and quickly search through millions of embeddings.</p>
          <p>Unlike traditional databases that look for exact matches, vector databases find content that is <em>similar</em> in meaning.</p>
          <p>This is how AI apps can instantly find relevant responses or content — even if it’s phrased differently!</p>
        </>
      ),
    },
    {
      id: 5,
      title: "5. Semantic Search ",
      content: (
        <>
          <p>Let’s play a game! Which two of these sentences are most similar?</p>
          <ol>
            <li>Dogs are loyal companions.</li>
            <li>Books contain a world of knowledge.</li>
            <li>Canines are faithful friends.</li>
          </ol>
          <p>Most people would say 1 and 3 — and they’d be right! Embeddings help AI recognize such contextual similarities through semantic search.</p>
        </>
      ),
    },
    {
      id: 6,
      title: "6. Text Chunking ",
      content: (
        <>
          <p>When processing large documents, we break them into smaller <strong>chunks</strong>. This helps embedding models understand content better.</p>
          <p>Tools like <strong>LangChain</strong> offer text splitters to clean, remove HTML tags, fix typos, and chunk documents effectively.</p>
          <p><strong>Pro tips:</strong></p>
          <ul>
            <li>Choose chunk size based on content type.</li>
            <li>Short queries = short chunks. Large documents = bigger chunks.</li>
            <li>Don’t exceed token limits (e.g., 8191 for OpenAI models).</li>
          </ul>
        </>
      ),
    },
    {
      id: 7,
      title: "7. Retrieval-Augmented Generation (RAG) ",
      content: (
        <>
          <p>RAG combines the best of both worlds:</p>
          <ul>
            <li>Retrieval: Pulling accurate content from vector databases.</li>
            <li>Generation: Using GPT models to create fresh, human-like answers.</li>
          </ul>
          <p>Example: Searching a knowledge base and then generating a new answer with GPT — that's RAG in action!</p>
        </>
      ),
    },
    {
      id: 8,
      title: "8. Recap ",
      content: (
        <>
          <ul>
            <li>Understand the basics of embeddings</li>
            <li> Use OpenAI to create embeddings</li>
            <li>Store & search embeddings in vector databases</li>
            <li>Perform semantic & similarity search</li>
            <li>Chunk text efficiently with LangChain</li>
            <li> Use RAG to generate accurate, creative content</li>
          </ul>
          <p>✨ And that’s the magic behind AI-powered apps in a nutshell!</p>
        </>
      ),
    },
  ];

  return (
    <div className="takeaways-container">
      <h1 className="main-title">My  AI Resume  for this App</h1>
      <div className="sections">
        {sections.map((section) => (
          <div key={section.id}>
            <h2
              className={`section-title ${activeSection === section.id ? "active" : ""}`}
              onClick={() => toggleSection(section.id)}
            >
              {section.title}
            </h2>
            {activeSection === section.id && (
              <div className="section-content">{section.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Takeaways;