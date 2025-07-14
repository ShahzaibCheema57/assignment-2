"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BlogSummariserForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Life", "Motivation", "Success", "Happiness", "Inspiration",
    "Love", "Friendship", "Wisdom", "Courage", "Faith",
    "Technology", "Health", "Travel", "Education", "Growth",
    "Leadership", "Mindfulness", "Productivity", "Creativity",
    "Kindness", "Resilience", "Hope", "Empathy", "Dreams",
    "Adventure", "Discipline", "Strategy", "Focus", "Vision", "Balance"
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl p-8 bg-black border-2 border-orange-500 rounded-3xl space-y-8 text-center shadow-xl">
        <h1 className="text-5xl font-extrabold text-orange-400">✨ Blog Summariser ✨</h1>
        <p className="text-orange-300 max-w-xl mx-auto">
          Paste a blog topic or URL below and get an AI-powered summary with Urdu translation. Perfect for learning, sharing, or getting inspired!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter Blog Topic or URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-black border-orange-500 text-orange-400 placeholder-orange-300 focus:ring-orange-400"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-black w-full font-semibold py-2 rounded-full"
          >
            {loading ? "Summarising..." : "Summarise Blog"}
          </Button>
        </form>

        <div className="space-y-3">
          <p className="font-semibold text-orange-300">💡 Try these topics:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setUrl(topic)}
                className="px-3 py-1 border border-orange-400 rounded-full text-sm text-orange-300 hover:bg-orange-500 hover:text-black transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="space-y-6 bg-orange-900/20 p-6 rounded-xl mt-6 text-left max-w-2xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-orange-400 mb-2">📝 AI Summary:</h2>
              <p className="text-orange-200 leading-relaxed whitespace-pre-line">
                {result.summary}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-orange-400 mb-2">🗣️ اردو خلاصہ:</h2>
              <p className="text-orange-200 leading-relaxed whitespace-pre-line">
                {result.urduSummary}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
