import { createFileRoute } from "@tanstack/react-router";
import { handleRecruiterChat } from "@/lib/recruiter-chat.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: ({ request }) => handleRecruiterChat(request),
    },
  },
});