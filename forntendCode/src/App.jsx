import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim()) {
      alert("Please enter some code!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
    } catch (error) {
      setReview("❌ Error fetching review. Please check server or API.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6 py-10">
      {/* HEADER */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-500 tracking-wide drop-shadow">
          🔍 Code Reviewer AI
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Write code, get instant reviews powered by AI!
        </p>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Column - Code Editor */}
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-indigo-400">Code Editor</h2>
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900 shadow-lg">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
              padding={16}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: "300px",
                backgroundColor: "#1e1e1e",
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={reviewCode}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            {loading ? "⏳ Reviewing..." : "🔍 Review Code"}
          </button>
        </div>

        {/* Right Column - Review Output */}
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-green-400">Code Review Output</h2>
          <div className="bg-gray-900 p-4 border border-gray-700 rounded-xl shadow-lg prose prose-invert max-w-none">
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

