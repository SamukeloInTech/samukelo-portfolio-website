import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  safeValidateUIMessages,
  streamText,
  type UIMessage,
} from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai/run-id.server";

const MAX_MESSAGES = 40;
const MAX_TRANSCRIPT_CHARACTERS = 20_000;
const chatRequestSchema = z.object({
  messages: z.array(z.unknown()).min(1).max(MAX_MESSAGES),
}).passthrough();

const recruiterSystemPrompt = `You are Samukelo Cele's AI assistant. Your job is to answer questions from recruiters about Samukelo based ONLY on the resume data provided below. Be professional, enthusiastic, and concise. Do not invent information.

Resume Data:

SAMUKELO CELE
Junior QA Tester | Junior Test Analyst | ICT Graduate
Durban, KwaZulu-Natal | 073 380 3896 | samkeloacele@gmail.com
LinkedIn: linkedin.com/in/samukelo-cele
GitHub: github.com/SamukeloInTech

PROFESSIONAL SUMMARY
ICT graduate (Advanced Diploma in ICT, Durban University of Technology) and Junior QA Tester with hands-on experience in manual functional testing, test case design and defect logging in Jira, gained through portfolio projects. Able to turn business rules and requirements into test cases with clear expected results, execute them, keep evidence and report defects with full reproduction steps. Also experienced in SQL data validation, API testing (Postman and Python) and regression test automation with Selenium and pytest. Understands the SDLC and Agile/Scrum. Detail-focused, well organised and eager to learn from experienced QA professionals.

EDUCATION
- Advanced Diploma in Information and Communications Technology, Durban University of Technology, 2026.
- Diploma in ICT (Application Development), Durban University of Technology, 2023–2025.
- National Senior Certificate (Matric), Umlazi Senior Secondary, 2020.

TECHNICAL SKILLS
- Testing types: manual, functional, regression, smoke, exploratory, end-to-end, positive and negative testing, API testing (manual and automated), security testing exposure, and test automation.
- Test design and documentation: test plans, test scenarios, test cases, expected results, test evidence, equivalence partitioning, and boundary value analysis.
- Defect management: Jira, bug reporting, defect lifecycle, severity and priority, and root cause analysis.
- Databases: SQL, MySQL, MySQL Workbench, JOINs, GROUP BY, UNIQUE, CHECK and FOREIGN KEY constraints, and data validation.
- Automation and API: Postman collections, assertions and Collection Runner; JavaScript Postman test scripts; Python requests; pytest; Selenium WebDriver with Python; Page Object Model; GitHub Actions CI/CD.
- Methods and tools: Jira, Agile/Scrum, SDLC, STLC, Git, GitHub, CI/CD, Markdown, Microsoft Excel, and Chrome DevTools.

PROJECT EXPERIENCE

AI Smart Shopper (Flask Web App): Functional, API and Security Testing — portfolio project
- Applied a risk-based test strategy and documented a test plan and 7 test cases (6 passed, 1 failed) for a budgeting and price-comparison web app for NSFAS students.
- Derived test conditions from business rules including an NSFAS R1,750 budget warning, mutually exclusive budgets, over-budget locking and authentication; executed tests and tracked results, evidence and defects on a Jira board.
- Found API defect BUG-001: the backend accepted negative quantities instead of returning 400 Bad Request; also validated rate limiting after rapid failed logins.
- Logged the defect in Jira with reproduction steps, expected and actual results, severity and priority; published artifacts to GitHub.

Banking Web Application Testing (ParaBank) — portfolio project
- Ran a manual test cycle on the ParaBank demo banking app: wrote 8 test cases (7 executed: 4 passed, 3 failed) covering account overview, fund transfers and bill payments, using Equivalence Partitioning and Boundary Value Analysis.
- Found and reported 3 defects (2 Critical, 1 Major), including transfers and bill payments allowed with a $0.00 balance; each report includes reproduction steps, expected and actual results, severity, priority and screenshots.
- Produced a test scope, summary report, coverage mind map and requirements traceability matrix (RTM).

SQL Manual QA Testing: E-Commerce Database — portfolio project
- Built a MySQL e-commerce schema and test data; wrote JOIN and GROUP BY queries to verify application data against the database and tested UNIQUE, CHECK and FOREIGN KEY constraints.
- Identified data anomalies and wrote evidence-based bug reports with SQL proof; used cleanup scripts for repeatable test runs and published the project to GitHub.

API Testing: Restful Booker (Postman, Python and CI/CD) — portfolio project
- Built a Postman collection for the Restful Booker practice API covering POST /booking and GET /booking/{id}, with 8 JavaScript assertions on status codes, response time under 2000 ms, and JSON body keys and values.
- Automated the same flow in Python with pytest and requests, dynamically extracting the bookingid from the POST response and asserting the retrieved booking matches the data sent.
- Set up GitHub Actions to install dependencies and run the pytest suite on every push to main; published code and run evidence to GitHub.

Test Automation (Selenium, pytest and CI/CD): SauceDemo — portfolio project
- Built a Python Selenium and pytest suite of 14 automated tests (Login, Products, Cart, Checkout) using the Page Object Model, explicit waits, fixtures, smoke and regression markers, parametrization and centralized test data.
- Generated HTML reports and failure screenshots; set up GitHub Actions to run the suite in headless Chrome on every push to main and upload the report as an artifact.

CERTIFICATIONS
- ISTQB Certified Tester Foundation Level (CTFL), in progress.
- Introduction to pytest, Test Automation University (Applitools), 2026.
- Cyber Security Essentials and Introduction to Cyber Security, Cisco Networking Academy.

CORE COMPETENCIES
Attention to Detail; Quality-Focused Mindset; Written and Verbal Communication; Teamwork and Collaboration; Strong Organisational Skills; Problem Solving; Willingness to Learn and Take Guidance; Adaptability.`;

function responseError(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function extractGatewayMessage(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  try {
    const payload = JSON.parse(raw) as {
      message?: unknown;
      error?: unknown;
    };
    if (typeof payload.message === "string") return payload.message;
    if (typeof payload.error === "string") return payload.error;
    if (payload.error !== null && typeof payload.error === "object" && "message" in payload.error) {
      const message = payload.error.message;
      if (typeof message === "string") return message;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function safeGatewayError(error: unknown): string {
  const record = error !== null && typeof error === "object"
    ? error as { statusCode?: unknown; responseBody?: unknown; message?: unknown }
    : {};
  const safeMessage = extractGatewayMessage(record.responseBody) ?? extractGatewayMessage(record.message);
  if (safeMessage) return safeMessage;
  if (record.statusCode === 401) return "The AI service is not configured. Please contact the site owner.";
  if (record.statusCode === 402) return "AI credits are unavailable for this request. Please check the project's credits.";
  if (record.statusCode === 403) return "AI access was denied. Please contact the site owner.";
  if (record.statusCode === 429) return "The assistant is receiving too many requests. Please wait before trying again.";
  if (typeof record.statusCode === "number" && record.statusCode >= 500) {
    return "The assistant service is temporarily unavailable. Please try again later.";
  }
  return "The assistant couldn't respond. Please try again later.";
}

export async function handleRecruiterChat(request: Request): Promise<Response> {
  if (request.method !== "POST") return responseError("Method not allowed.", 405);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return responseError("The chat request must contain valid JSON.", 400);
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success) return responseError("The chat request is invalid or too large.", 400);

  const validated = await safeValidateUIMessages<UIMessage>({ messages: parsed.data.messages });
  if (!validated.success) return responseError("The chat messages are invalid.", 400);

  const messages = validated.data;
  const lastMessage = messages.at(-1);
  if (
    !lastMessage ||
    lastMessage.role !== "user" ||
    messages.some((message) => message.role !== "user" && message.role !== "assistant")
  ) {
    return responseError("Send a question to continue the conversation.", 400);
  }

  const transcriptLength = messages.reduce(
    (total, message) => total + message.parts.reduce(
      (partTotal, part) => part.type === "text" ? partTotal + part.text.length : partTotal,
      0,
    ),
    0,
  );
  if (transcriptLength > MAX_TRANSCRIPT_CHARACTERS) {
    return responseError("This conversation is too long. Start a fresh visit to continue.", 400);
  }

  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    return responseError("The AI service is not configured. Please contact the site owner.", 401);
  }

  const gateway = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: gateway.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: recruiterSystemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
    onError: safeGatewayError,
  });
  return withLovableAiGatewayRunIdHeader(response, gateway);
}