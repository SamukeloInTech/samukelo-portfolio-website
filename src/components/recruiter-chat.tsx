import { useEffect, useMemo, useRef, useState } from "react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
    .trim();
}

export function RecruiterChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatError, setChatError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousStatus = useRef("ready");
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop } = useChat({
    transport,
    onError: (error) => setChatError(error.message || "The assistant couldn't respond. Please try again later."),
    onFinish: ({ message, isError }) => {
      if (!isError && !messageText(message)) {
        setChatError("The assistant could not answer this request.");
      }
    },
  });
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (isOpen) textareaRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && status === "ready" && previousStatus.current !== "ready") {
      textareaRef.current?.focus();
    }
    previousStatus.current = status;
  }, [isOpen, status]);

  function handleSubmit(message: PromptInputMessage) {
    const text = message.text.trim();
    if (!text || isBusy) return;
    setChatError("");
    setInput("");
    void sendMessage({ text });
  }

  return (
    <div className="recruiter-chat">
      <section
        aria-hidden={!isOpen}
        aria-label="Chat with Samukelo's recruiter assistant"
        className="recruiter-chat-panel"
        data-open={isOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        role="dialog"
      >
        <header className="recruiter-chat-header">
          <span aria-hidden="true" className="recruiter-chat-avatar">SC</span>
          <div className="recruiter-chat-heading">
            <strong>Samukelo Cele</strong>
            <span>Recruiter assistant</span>
          </div>
          <Button
            aria-label="Close chat"
            className="recruiter-chat-close"
            onClick={() => setIsOpen(false)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </header>

        <Conversation className="recruiter-chat-conversation">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                className="recruiter-chat-empty"
                description="Junior Test Analyst · Software Tester"
                icon={<span aria-hidden="true" className="recruiter-chat-empty-mark">SC</span>}
                title="Samukelo Cele"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse>;
                      }
                      if (part.type === "reasoning") {
                        return (
                          <details className="recruiter-chat-reasoning" key={`${message.id}-${index}`}>
                            <summary>Reasoning summary</summary>
                            <p>{part.text}</p>
                          </details>
                        );
                      }
                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent><Shimmer>Thinking…</Shimmer></MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton aria-label="Scroll to latest message" />
        </Conversation>

        {chatError && <p className="recruiter-chat-error" role="alert">{chatError}</p>}

        <PromptInput className="recruiter-chat-composer" onSubmit={handleSubmit}>
          <PromptInputTextarea
            aria-label="Ask a question about Samukelo"
            disabled={isBusy}
            onChange={(event) => setInput(event.currentTarget.value)}
            placeholder="Ask a question about Samukelo…"
            ref={textareaRef}
            value={input}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              aria-label={isBusy ? "Stop response" : "Send message"}
              disabled={!input.trim() && !isBusy}
              onStop={stop}
              status={status}
              title={isBusy ? "Stop response" : "Send message"}
            />
          </PromptInputFooter>
        </PromptInput>
      </section>

      <Button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close recruiter chat" : "Open recruiter chat"}
        className="recruiter-chat-trigger"
        onClick={() => setIsOpen((current) => !current)}
        size="icon"
        title={isOpen ? "Close recruiter chat" : "Open recruiter chat"}
        type="button"
      >
        {isOpen ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
      </Button>
    </div>
  );
}