# AI, Agents & AI Coding Tools: A Practical Deep Dive

**A talk by Sebastian Kehle, webvise**
Duration: 60 minutes | Audience: Engineering & IT Leadership

---

## About the Speaker

### Sebastian Kehle

Founder of webvise and AI Engineer at luca in Berlin. My background is in design and communication - over the years I've moved deeper into software engineering and automation.

**Career:**

- **webvise** (since 2016) - Design, web development, and AI automation for businesses
- **luca, Berlin** (since 2022) - Started as Frontend Engineer, now AI Engineer. Works on LLM-based solutions for the hospitality industry
- **Addisco Education GmbH** (2017-2021) - CEO of a recruiting technology startup with a proprietary matching algorithm

**Technical Stack:**

TypeScript, React, Next.js, Node.js, PostgreSQL | OpenAI, Anthropic, Vercel AI SDK, Mastra, n8n | Vercel, Docker, Cloudflare, GitHub, Turborepo

**Why this topic?**

What I'm presenting today are tools and workflows I use in my daily work - at luca, for webvise clients, and in open-source projects.

---

## Part 1: The AI Landscape in 2026

### Three Waves of AI-Assisted Software Development

**Wave 1: Autocomplete (2021-2023)**
GitHub Copilot brought AI into the editor. Line completion, function suggestions, boilerplate generation. Helpful but limited. The developer stayed in control, AI was a better IntelliSense.

**Wave 2: Chat & Copilot (2023-2025)**
ChatGPT, Claude, and specialized coding assistants enabled conversations about code. Developers could describe and generate entire functions. Cursor and Windsurf integrated AI deeply into the IDE. Context grew from single files to entire projects.

**Wave 3: Autonomous Agents (2025-present)**
AI systems that independently plan, use tools, write code, test, and deploy. Not one prompt, one answer - but one goal, many steps. Claude Code, Codex CLI, and Gemini CLI work directly in the terminal, navigate codebases, run tests, and create pull requests. This is the current state.

### Numbers That Matter

- **McKinsey (2025):** Developers using AI coding tools are 20-45% more productive in code generation
- **GitHub (2025):** 55% faster task completion with Copilot in controlled studies
- **Stack Overflow Survey (2025):** 76% of professional developers use AI tools, 62% in a professional context
- **Gartner (2026):** By 2028, 75% of all enterprise software engineers will use AI coding assistants (2024: 10%)

### What This Means for Organizations

When developers become 30% more productive, it's not a marginal improvement - it's a strategic advantage:

- **Maintenance costs decrease:** Automated code reviews, bug detection, dependency updates
- **Time-to-market shortens:** Features that took weeks are delivered in days
- **Code quality improves:** AI finds patterns humans miss - security vulnerabilities, performance issues, accessibility problems
- **Knowledge transfer accelerates:** New team members understand legacy code faster with AI support

---

## Part 2: AI Coding Tools Overview

### The Key Tools of 2026

#### GitHub Copilot
- **Type:** IDE integration (VS Code, JetBrains, Neovim)
- **Strength:** Broadest adoption, solid autocomplete quality
- **Weakness:** Agent Mode since 2025, but feels bolted on. Good for simple completion - hits its limits quickly on complex, multi-step tasks. Limited codebase understanding
- **Models:** GPT-4o, Claude Sonnet, Gemini (selectable)
- **Price:** from $19/month per developer

#### Cursor
- **Type:** VS Code fork with native AI integration
- **Strength:** Multi-file editing, codebase context, Composer for complex tasks
- **Models:** Claude, GPT-4o, proprietary models
- **Enterprise:** Cursor for Business with SSO and admin controls
- **Price:** from $20/month per developer

#### Claude Code (CLI)
- **Type:** Terminal-based autonomous agent
- **Strength:** Agentic coding - plans, implements, tests autonomously. Understands entire codebase. Works with Git, shell, APIs
- **Models:** Claude Opus, Sonnet, Haiku (Anthropic)
- **Enterprise:** API-based, self-hostable, full control over data flows
- **Price:** API-based (pay-per-use) or Max subscription

#### Windsurf (ex-Codeium)
- **Type:** AI-first IDE
- **Strength:** Flows system for multi-step tasks, good context management
- **Models:** Proprietary and third-party models
- **Price:** from $15/month per developer

#### Codex CLI (OpenAI)
- **Type:** Terminal-based agent
- **Strength:** OpenAI ecosystem, cloud sandbox execution
- **Price:** API-based

#### Gemini CLI (Google)
- **Type:** Terminal-based agent
- **Strength:** Large context window (1M+ tokens), Google ecosystem
- **Price:** Free tier available

### Comparison Matrix

| Criterion | Copilot | Cursor | Claude Code | Windsurf |
|---|---|---|---|---|
| Autonomy Level | Medium | Medium-High | Very High | Medium-High |
| Codebase Understanding | Good | Very Good | Excellent | Good |
| Multi-File Editing | Yes | Yes | Yes | Yes |
| Terminal Integration | Limited | Limited | Native | Limited |
| Enterprise Features | Very Good | Good | API-flexible | Medium |
| Offline Capable | No | No | No* | No |
| Compliance Controls | Good | Medium | High | Medium |

*Claude Code can be operated with local MCP servers and proxy configurations.

---

## Part 3: AI Agents - From Chatbots to Autonomous Systems

### What Is an AI Agent?

An AI agent is a system that:
1. **Understands a goal** - not just a single prompt
2. **Plans independently** - breaks complex tasks into steps
3. **Uses tools** - filesystem, APIs, databases, browser, terminal
4. **Iterates** - checks results, corrects errors, tries alternative approaches
5. **Builds knowledge** - learns project context, remembers decisions

This is fundamentally different from a chatbot. A chatbot answers questions. An agent completes tasks.

### Model Context Protocol (MCP) - The Standard for Tool Integration

MCP is an open standard (initiated by Anthropic, broadly adopted) that defines how AI models communicate with external tools. Think USB-C for AI:

**Before MCP:**
- Every tool needed its own integration
- Every AI system spoke its own language
- No standardization, no reusability

**With MCP:**
- One standard protocol for all tools
- One MCP server can be used by any compatible AI client
- Tools are interchangeable and composable

**Practical MCP Server Examples:**
- **Database Server:** AI securely accesses PostgreSQL, Redis, Elasticsearch
- **Git Server:** AI understands repository history, branches, PRs
- **Jira/Linear Server:** AI reads and creates tickets
- **Monitoring Server:** AI analyzes Grafana dashboards, logs, alerts
- **Browser Server:** AI navigates websites, tests UIs, extracts data

For organizations, this means: AI agents can be integrated into existing infrastructure without rebuilding every tool. MCP servers for internal systems (CI/CD, monitoring, ticket systems) are built once and used by all AI tools.

### Real-World Example: My Daily Workflow

This is not a demo scenario. This is my actual daily working process.

#### Claude Code as Foundation

Claude Code is my primary development tool. It runs in the terminal with access to:
- The entire project filesystem
- Git (commits, branches, PRs)
- Shell commands (tests, builds, deployments)
- MCP servers (databases, APIs, browser)

#### oh-my-claudecode (OMC) - Multi-Agent Orchestration

On top of Claude Code, I use oh-my-claudecode (OMC), an orchestration layer that coordinates specialized agents:

**Available Agents:**
- **Architect** (Opus) - Strategic architecture decisions, read-only
- **Planner** (Opus) - Implementation planning with interview workflow
- **Executor** (Sonnet) - Focused code implementation
- **Code Reviewer** (Opus) - Detailed code reviews with severity rating
- **Security Reviewer** (Sonnet) - OWASP Top 10, secrets detection, unsafe patterns
- **Test Engineer** (Sonnet) - Test strategy, TDD workflows
- **Debugger** (Sonnet) - Root cause analysis, stack trace analysis
- **Verifier** (Sonnet) - Evidence-based completion checks
- **Designer** (Sonnet) - UI/UX design and implementation
- **Writer** (Haiku) - Documentation, API docs, comments

**Workflow Example: Feature Implementation**

```
1. Requirement: "Implement a health check endpoint for all microservices"

2. Planner agent analyzes:
   - Existing service architecture
   - Existing health check patterns
   - Dependencies and interfaces

3. Architect agent reviews the plan:
   - Recommends standardized response format
   - Identifies critical paths

4. Executor agents work in parallel:
   - Agent 1: Implements health check module
   - Agent 2: Writes tests
   - Agent 3: Updates documentation

5. Code reviewer checks:
   - Code quality, patterns, edge cases
   - Security implications

6. Verifier confirms:
   - Tests pass
   - No regressions
   - Deployment successful
```

This is not a theoretical scenario. This is my actual workflow for webvise client projects.

#### Skills - Reusable Agent Capabilities

Skills are Markdown-based instructions that give agents specific capabilities. They are:
- **Portable** - work in Claude Code, Cursor, Copilot, and 19+ other AI tools
- **Versionable** - in Git, shareable across teams
- **Composable** - skills can invoke other skills

**My webvise Skills:**
- **webvise-conventions** - Our tech stack conventions, design system, code patterns
- **webvise-qa** - 7-category QA audit (Performance, Accessibility, SEO, Responsive, Analytics...)
- **webvise-deliver** - 6-phase delivery workflow (Discover, Plan, Build, SEO, QA, Deliver)

**The skills.sh Ecosystem:**
skills.sh is an open marketplace for AI agent skills. Teams can create, share, and discover skills. Instead of every team writing their own prompts, there's a growing library of reusable capabilities.

For a large organization, this means: Create an "Enterprise Security Review Skill" once, and every developer uses the same standard - regardless of IDE or AI tool.

---

## Part 4: Compliance, Security & Governance

### Why This Chapter Is Especially Relevant for Large Enterprises

Large enterprises in regulated industries prioritize safety, quality, and certification. When AI tools are integrated into the development process, the same standards must apply that these organizations verify for their own clients. This isn't a contradiction - it's an opportunity to lead by example.

### EU AI Act - What Does It Mean for Development Tools?

The EU AI Act (in force since August 2024, full application from August 2026) classifies AI systems by risk:

**Minimal Risk (most AI coding tools):**
- Code autocomplete, refactoring suggestions, documentation generation
- No special requirements, but transparency obligations

**Limited Risk (some agent systems):**
- AI that autonomously deploys code or makes infrastructure decisions
- Transparency obligation: users must know they're interacting with AI
- Documentation obligation for AI use

**High Risk (potentially relevant for regulated enterprises):**
- AI systems in safety-critical applications
- If AI-generated code flows into testing or certification software
- Requires: risk management, data quality, transparency, human oversight, accuracy

**Recommendation for large enterprises:**
- Classify your applications by AI Act risk classes
- Define which apps may be AI-assisted and under what conditions
- Establish an AI governance board that sets standards

### GDPR and AI Coding Tools

**The central question: Where does the data go?**

When a developer writes code with an AI tool, source code is sent to the model provider. This can be problematic if:
- The code contains personal data (test data, configurations)
- The code contains proprietary business logic
- The provider uses data for training (NOT the case with most enterprise plans)

**Data Flow Analysis of Major Providers:**

| Provider | Training on Data | Data Processing | DPA Available | EU Hosting |
|---|---|---|---|---|
| Anthropic (Claude) | No (API) | USA, EU routing possible | Yes | Planned |
| OpenAI | No (API/Enterprise) | USA, EU option | Yes | Azure EU |
| GitHub Copilot | No (Business/Enterprise) | USA | Yes | No |
| Google (Gemini) | No (API) | Global, EU option | Yes | EU available |

**Recommendations:**
1. Use API access (not consumer products) - no training data usage
2. Sign Data Processing Agreements (DPA) with all providers
3. Implement code scanning before sending to AI APIs (no secrets, no PII)
4. Evaluate EU hosting options for maximum GDPR compliance

### Local Models: The Air-Gap Option

For highly sensitive code, there's an alternative: local AI models that run entirely on-premise.

**Available Local Models (as of 2026):**

| Model | Provider | Parameters | Hardware Requirement | Coding Quality |
|---|---|---|---|---|
| Qwen 2.5 Coder | Alibaba | 7B-32B | 16-64GB RAM | Very Good |
| DeepSeek Coder V3 | DeepSeek | 16B-236B | 32-128GB+ RAM | Excellent |
| CodeLlama | Meta | 7B-70B | 16-128GB RAM | Good |
| StarCoder2 | BigCode | 3B-15B | 8-32GB RAM | Good |
| Mistral Codestral | Mistral | 22B | 32-64GB RAM | Very Good |

**Tools for Local Deployment:**
- **Ollama** - Simplest setup, runs on Mac/Linux/Windows
- **llama.cpp** - Maximum performance, C++ based
- **vLLM** - Production-grade serving for teams

**Hybrid Approach (Recommendation for large enterprises):**
- Local models for safety-critical code (testing software, certification systems)
- Cloud APIs for non-critical development (marketing websites, internal tools)
- Clear guidelines on which code goes where

### Code Ownership and IP Questions

**Who owns AI-generated code?**

- Most providers (Anthropic, OpenAI, GitHub) transfer all rights to the generated output to the user
- With API usage, there are no license restrictions
- **Important:** Review the ToS of each provider for your specific use case
- **Recommendation:** Document AI usage in your development process (which tool, what proportion)

### Audit Trails and Traceability

For organizations that conduct audits themselves, traceability is critical:

**Best Practices:**
1. **Git Integration:** All AI-generated changes go through normal Git workflows (branches, PRs, reviews)
2. **Co-Author Tags:** AI-generated commits are marked (e.g., `Co-Authored-By: Claude`)
3. **Review Mandate:** No AI-generated code goes to production without human review
4. **Logging:** Which model, which prompt, which output - document for critical systems
5. **Test Coverage:** AI-generated code must meet the same (or higher) testing standards

**Tooling for Audit Trails:**
- Git hooks that enforce AI co-author tags
- CI/CD pipelines that flag AI-generated code
- Custom MCP servers that log AI interactions

---

## Part 5: Enterprise Adoption Strategy

### The Crawl-Walk-Run Framework

#### Phase 1: Crawl (Months 1-3)
**Goal:** Gather experience, identify quick wins

- **Pilot Team:** 5-10 developers from different teams
- **Tools:** GitHub Copilot or Cursor (low barrier to entry)
- **Use Cases:** Code completion, documentation, unit tests
- **Governance:** Basic guidelines for data classification
- **Measurement:** Developer satisfaction, code output, error rate

**Quick Wins:**
- Automated documentation generation for legacy code
- Increase test coverage with AI-generated tests
- Accelerate code reviews with AI support
- Automate dependency updates and security patches

#### Phase 2: Walk (Months 4-9)
**Goal:** Establish standards, expand rollout

- **Expansion:** 50-100 developers
- **Tools:** Claude Code / Cursor for complex tasks, first MCP servers
- **Use Cases:** Feature development, refactoring, bug fixing, CI/CD integration
- **Governance:** AI coding policy, DPA with providers, app classification
- **Skills:** Create first company-specific skills (coding standards, review checklists)

**Infrastructure:**
- MCP servers for internal systems (Jira, CI/CD, monitoring)
- Proxy layer for API calls (logging, filtering, rate limiting)
- Shared skills repository in internal Git

#### Phase 3: Run (from Month 10)
**Goal:** AI as a standard tool for all developers

- **Expansion:** All development teams
- **Tools:** Multi-agent workflows, automated pipelines
- **Use Cases:** Full feature development, automated QA, incident response
- **Governance:** Complete AI governance framework, regular audits
- **Measurement:** ROI per team, code quality metrics, time-to-market

### Measuring ROI

**Quantitative Metrics:**
- Lines of code per developer/sprint (caution: not as a sole metric)
- Time-to-merge for pull requests
- Bug rate in AI-assisted vs. traditional code
- Test coverage improvement
- Time-to-resolution for incidents

**Qualitative Metrics:**
- Developer satisfaction (NPS)
- Onboarding time for new team members
- Knowledge transfer for legacy systems
- Innovation rate (new features, experiments)

### Change Management

**The Biggest Hurdles:**
1. **"AI replaces developers"** - No. AI makes developers more productive. The need for good developers increases because they can accomplish more
2. **"The code isn't trustworthy"** - That's why: reviews, tests, CI/CD. AI code is reviewed the same way as human code
3. **"Compliance is too complex"** - That's why: clear guidelines, classification, governance. Step by step
4. **"We have legacy code"** - That's exactly where AI helps most. Understanding, documenting, modernizing legacy code

**Recommendation:** Champions program. Identify AI-enthusiastic developers in each team. They become multipliers and points of contact.

---

## Part 6: Outlook 2026/2027

### What Comes Next?

**Short-term (2026):**
- AI agents become standard in every IDE
- MCP becomes the de facto standard for tool integration
- Local models reach cloud quality for many use cases
- Enterprise features (SSO, audit logs, data residency) at all major providers

**Mid-term (2027):**
- Multi-agent teams as normal development workflow
- AI-assisted code migration at scale (legacy modernization)
- Specialized industry models (automotive, healthcare, finance)
- Integrated compliance checks in AI coding workflows

**Long-term:**
- AI as a full team member that independently develops, tests, and deploys features
- Human developers focus on architecture, business logic, and review
- The line between "AI code" and "human code" becomes irrelevant

### Recommendations for the Next Step

1. **Start now.** The learning curve is flatter than expected, but the competition isn't waiting
2. **Start small.** One pilot team, one tool, clear metrics
3. **Invest in governance.** Defining guidelines now is easier than retrofitting them later
4. **Build internal know-how.** Skills, MCP servers, best practices - invest in knowledge, not just licenses
5. **Measure results.** What isn't measured doesn't get improved

---

## Appendix: Resources

### Further Reading (webvise Blog)

- "Best Local AI Models for Compliant Businesses in 2026"
- "How AI Agents Are Transforming Business Automation in 2026"
- "AI Tools Every Small Business Should Be Using in 2026"
- "How We Use AI to Build Better Software, Faster"
- "AI Regulations and Certifications in Germany/Europe"
- "What Is the Model Context Protocol (MCP)"
- "AI Agent Skills Directory"

### Official Documentation

- **Claude Code:** claude.ai/claude-code
- **Model Context Protocol:** modelcontextprotocol.io
- **skills.sh:** skills.sh
- **EU AI Act:** artificialintelligenceact.eu
- **oh-my-claudecode:** github.com/anthropics/claude-code (community plugin)

### Contact

**Sebastian Kehle**
sebastian.kehle@webvise.io
webvise.io | sebastiankehle.com
LinkedIn: linkedin.com/in/sebastiankehle
GitHub: github.com/sebastiankehle

---

*This document was created by webvise - Design, development, and AI automation for digital products.*
