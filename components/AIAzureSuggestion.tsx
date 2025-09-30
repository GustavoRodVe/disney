"use client";

import { useEffect, useState } from "react";
import {
  OpenAIClient,
  AzureKeyCredential,
  ChatResponseMessage,
} from "@azure/openai";

export default function AIAzureSuggestion({ term }: { term: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT || process.env.ENDPOINT;
    const azureApiKey = process.env.NEXT_PUBLIC_AZURE_API_KEY || process.env.AZURE_API_KEY;

    if (!endpoint || !azureApiKey) {
      setError("Azure OpenAI not configured. Enable ENDPOINT and AZURE_API_KEY to use AI suggestions.");
      return;
    }

    const fetchChat = async () => {
      try {
        const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
        const deploymentId = "disney-clone-youtube-35";

        const result = await client.getChatCompletions(deploymentId, [
          {
            role: "system",
            content: `You are a digital video assistant working for services such as Netflix, Disney Plus & Amazon Prime Video. Your job is to provide suggestions based on the videos the user specifies. Provide an quirky breakdown of what the user should watch next! It should only list the names of the films after the introduction. Keep the response short and sweet! Always list at least 3 films as suggestions. If the user mentions a genre, you should provide a suggestion based on that genre.`,
          },
          { role: "user", content: `I like: ${term}` },
        ], { maxTokens: 128 });

        const first = result.choices?.[0]?.message?.content;
        setContent(first ?? "No suggestion available.");
      } catch (err: any) {
        console.error("AIAzureSuggestion failed", err);
        setError("Failed to fetch AI suggestion.");
      }
    };

    fetchChat();
  }, [term]);

  if (error)
    return (
      <div className="p-6 text-sm text-yellow-300">
        {error} (AI suggestions are optional — the site works without them.)
      </div>
    );

  if (!content)
    return (
      <div className="p-6">
        <div className="animate-pulse rounded-full bg-gradient-to-t from-purple-400 h-10 w-10 border-2 flex-shrink-0 border-white" />
        <p className="text-sm text-gray-400">Loading AI suggestion…</p>
      </div>
    );

  return (
    <div className="flex space-x-5 mt-8 p-6 pb-0">
      <div className="rounded-full bg-gradient-to-t from-purple-400 h-10 w-10 border-2 flex-shrink-0 border-white" />
      <div>
        <p className="text-sm text-purple-400">Azure Open AI Assistant Suggests:</p>
        <p className="italic text-xl">{content}</p>
      </div>
    </div>
  );
}
