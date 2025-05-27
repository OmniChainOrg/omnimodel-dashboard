// components/OracleThread.tsx

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

// Simple native button (styled tailwind) replaces missing Button import

interface Comment {
  id: string;
  author: string;
  timestamp: string;
  content: string;
}

export default function OracleThread({
  simulationId,
  zone,
}: {
  simulationId: string;
  zone: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(
      `/api/sirrenasim/comments?simulationId=${simulationId}&zone=${encodeURIComponent(
        zone
      )}`
    )
      .then((r) => r.json())
      .then(setComments)
      .catch(console.error);
  }, [simulationId, zone]);

  const postComment = async () => {
    if (!newComment.trim()) return;
    const res = await fetch(`/api/sirrenasim/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ simulationId, zone, content: newComment }),
    });
    if (res.ok) {
      setNewComment("");
      // re-fetch comments
      fetch(
        `/api/sirrenasim/comments?simulationId=${simulationId}&zone=${encodeURIComponent(
          zone
        )}`
      )
        .then((r) => r.json())
        .then(setComments)
        .catch(console.error);
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">📝 Oracle Commentary Thread</h3>
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="p-2 border rounded-md">
              <div className="text-sm font-medium">{c.author}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(c.timestamp).toLocaleString()}
              </div>
              <div className="mt-1">{c.content}</div>
            </div>
          ))}
        </div>
        <div className="mb-2">
          <textarea
            rows={3}
            className="w-full border rounded p-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a note or tag…"
          />
        </div>
        <button
          onClick={postComment}
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Send
        </button>
      </CardContent>
    </Card>
  );
}
