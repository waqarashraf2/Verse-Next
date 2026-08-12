<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\KnowledgeBaseEntry;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(VerseNextKnowledgeBaseSeeder::class);

        $adminEmail = env('VERSE_ADMIN_EMAIL', 'versanext@gmail.com');
        $adminPassword = env('VERSE_ADMIN_PASSWORD');

        if ($adminPassword) {
            User::updateOrCreate(
                ['email' => $adminEmail],
                [
                    'name' => 'Verse Next Admin',
                    'password' => Hash::make($adminPassword),
                    'role' => 'admin',
                ]
            );
        }

        $this->seedFaqs();
        $this->seedDevelopersFailArticle();
    }

    private function seedFaqs(): void
    {
        $faqs = [
            [
                'title' => 'What kind of digital solutions does Verse Next build?',
                'summary' => 'Verse Next builds business websites, software platforms, CRM systems, CMS-driven websites, admin dashboards, ecommerce workflows, AI agents, lead management systems, mobile app backends, SEO foundations, brand growth assets, and marketing automation workflows.',
            ],
            [
                'title' => 'When should a business pick a custom CRM over a ready made tool?',
                'summary' => 'A ready-made CRM tends to work best when the workflow is pretty basic, and the business is okay with a standard setup. A custom CRM is more sensible when the company runs on special lead stages, distinct team roles reporting, approval steps, client history, integrations, or industry specific operations that generic tools cannot fit neatly.',
            ],
            [
                'title' => 'How can AI agents help a business without damaging customer trust?',
                'summary' => 'AI agents do the most good when they assist with straightforward chores, like handling FAQs, qualifying leads, routing incoming messages, summarizing requests, preparing follow-ups, and helping staff answer quicker. They should be fed with trustworthy business knowledge, then watched over time, and built so a human can take over easily when a decision needs real judgment.',
            ],
            [
                'title' => 'Why does a CMS matter for SEO and broader business growth?',
                'summary' => 'A CMS lets a business publish service pages, blog posts, landing pages, FAQs, case studies, and ongoing updates without waiting on developers for each small change. For SEO the CMS should allow clean URLs, metadata controls, proper heading structure, image alt text, internal links, schema friendly content, plus fast loading pages.',
            ],
            [
                'title' => 'What makes an enterprise web system different from a normal website?',
                'summary' => 'A typical website is mostly about presenting information. An enterprise web system usually includes login access, roles and permissions, dashboards, databases, APIs, reporting, audit logs, integrations, data security, and ongoing maintenance planning. It also needs more durable architecture since real teams depend on it daily, not just occasionally.',
            ],
            [
                'title' => 'How should a company plan a website that can rank on Google?',
                'summary' => 'Begin with genuine customer questions, service intent, location intent, real proof, a sensible page outline, speed, and metadata that is accurate. Google friendly content should help people first, skip empty keyword stuffing, and show the business as genuinely knowledgeable.',
            ],
            [
                'title' => 'Can branding and graphic design affect digital growth?',
                'summary' => 'Branding affects trust, recall, conversion, and first impressions. A consistent visual system helps websites, social posts, ads, proposals, and product screens feel more professional.',
            ],
            [
                'title' => 'What should a business automate first?',
                'summary' => 'Start with a repeated task that has clear rules, such as lead capture, appointment requests, follow-up reminders, inquiry sorting, internal notifications, quote preparation, FAQ responses, or report generation.',
            ],
            [
                'title' => 'How does Verse Next keep content useful instead of generic?',
                'summary' => 'Content should be based on real services, buyer questions, practical experience, and clear decision-making, with useful explanations, service context, internal links, FAQs, schema, and human editing.',
            ],
            [
                'title' => 'What is the safest way to use AI in software projects?',
                'summary' => 'AI should speed up research, drafts, documentation, testing ideas, and repetitive development work, while developers still review logic, security, data flow, edge cases, and business fit.',
            ],
        ];

        foreach ($faqs as $index => $faq) {
            KnowledgeBaseEntry::updateOrCreate(
                ['slug' => Str::slug($faq['title'])],
                [
                    'type' => 'faq',
                    'title' => $faq['title'],
                    'summary' => $faq['summary'],
                    'content' => $faq['summary'],
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }
    }

    private function seedDevelopersFailArticle(): void
    {
        Article::updateOrCreate(
            ['slug' => 'why-good-developers-fail-large-projects'],
            [
                'title' => 'Why Good Developers Fail on Large Projects: The Problem Is Not Always Coding',
                'category' => 'Developer Skills',
                'featured_image' => '/articles/good-developers-fail-cover.png',
                'seo_title' => 'Why Good Developers Fail on Large Projects | Verse Next',
                'seo_description' => 'A comprehensive 1500+ word guide on why excellent developers make critical mistakes in large enterprise software systems, focusing on data lifecycle, performance bottlenecks, and AI dependency.',
                'author' => 'Waqar Ashraf Gondal',
                'reading_time' => 18,
                'tags' => [
                    'enterprise software systems',
                    'data lifecycle management',
                    'performance optimization',
                    'API failure handling',
                    'AI-assisted programming',
                    'deployment safeguards'
                ],
                'content' => implode("\n\n", [
                    'There is a persistent misconception in the software industry that being a great coder automatically makes you a great enterprise engineer. While working on large, complex enterprise software systems, I have seen highly talented developers—people who know React, Laravel, databases, Docker, and cloud architecture inside out—struggle when placed inside a real-world enterprise environment. These are developers who can solve complex algorithms in minutes and write clean, modular code. Yet, when tasked with modifying or extending an enterprise-grade platform, they make critical mistakes that lead to system downtime, lost client data, or performance degradation.',
                    'The problem in these situations is rarely a lack of technical knowledge or coding ability. The issue is much deeper: it is a failure to look beyond the code and understand the broader operational ecosystem, the data lifecycle, and the business workflows that the software supports. When a project reaches a certain scale, the code itself is only a small fraction of what a developer must consider. In this article, I want to explore why good developers fail on large projects, how to transition from a "local machine" mindset to an "enterprise systems" mindset, and how modern trends like AI-assisted programming can actually worsen these challenges if used without discipline.',
                    '<h2>A Large Project Is Not Just a Large Codebase</h2>',
                    'A small application, such as a personal portfolio, a simple CMS, or a basic CRUD tool, is relatively easy to reason about. The codebase is small, the user base is minimal, and the database contains only a few thousand records at most. If a developer makes a mistake, they can quickly deploy a fix, restore a database backup, or restart the server. The consequences of failure are low, and the system is simple enough that a single person can hold the entire architecture in their head.',
                    'An enterprise software system is a completely different entity. Imagine a platform that handles operations for a large corporation. The system is used by 800 to 1,000 internal employees, with hundreds of concurrent users performing tasks simultaneously. Every day, thousands of critical transactions and client orders flow through the system. These orders are automatically validated, assigned to staff members, processed through various departments, verified by quality control, synchronized with external accounting platforms, and sent to delivery partners. The system is a web of background queue workers, cron jobs, database triggers, third-party APIs, and legacy integrations.',
                    'In this kind of environment, a developer cannot afford to think: "I wrote the feature, it runs on my local machine without errors, so my job is done." That mindset is incredibly dangerous. In a large system, writing the code is only about 20% of the effort. The remaining 80% is understanding how that code behaves under load, how it interacts with other systems, how it handles network latency, and how it impacts the existing database. A single missing validation or a minor change in a database query can trigger a chain reaction that disrupts business operations, impacts customer trust, and leads to lost revenue.',
                    '<h2>Reading a Project Is Not the Same as Understanding It</h2>',
                    'When a new developer joins an enterprise project, they are often given a few days to review the codebase and get familiar with the architecture. Many developers review the directory structure, look at the controllers and models, read a few database migrations, and quickly declare that they understand the project. This is a classic mistake. There is a vast difference between understanding the programming syntax of a codebase and understanding the business logic of an enterprise system.',
                    'To truly understand a large project, you must look at it from an operational and architectural perspective. Before you write a single line of code or modify an existing query, you must be able to answer critical questions about the system\'s behavior. You need to know: Where does the incoming data originate? Which specific API endpoints provide this data, and are they reusable or one-time sources? What happens if an API call fails mid-way? How does the system handle partial successes? What mechanisms are in place to prevent duplicate data entry? What happens if a scheduled task runs twice? Which database tables are heavily locked during peak hours? What is the rollback procedure if a deployment fails in production?',
                    'Without answers to these questions, you are essentially coding in the dark. You might write a clean, elegant function that passes all local unit tests, but if that function makes assumptions that do not hold true in production, it will fail. Enterprise development requires you to understand the complete data lifecycle and the business processes that rely on the software.',
                    '<h2>A Real Production Lesson on One-Time API Failures</h2>',
                    'To illustrate this, let me share a real-world situation that occurred on a project I worked on. The system was designed to import client orders from an external portal through a series of system integration APIs. Because of the security policies of the external portal, some of these APIs were strictly "one-time" data sources. Once our system requested the data and the portal confirmed it was sent, the portal would mark those orders as processed and would not provide them again. This is a common pattern in high-security B2B integrations.',
                    'A new developer was assigned a ticket to optimize the import process. He decided to run the import script locally to debug and test his changes. He configured his local `.env` file with production API credentials, assuming it was safe because he was only "reading" data. He executed the script from his local terminal.',
                    'The script ran successfully. The orders were imported into his local database. The developer was pleased—his local tests passed. However, because his script successfully fetched the data, the external portal marked those orders as delivered. The production system, which ran on a scheduled cron job, never received those orders because they had already been fetched by the developer\'s local machine. The orders were now trapped in a local SQLite database on a developer\'s laptop.',
                    'For the business, this was a major incident. Dozens of client orders went missing, leading to delayed shipments, urgent client support inquiries, and a management escalation. The developer did not make a coding error—his script worked perfectly. The failure was a complete lack of understanding of the data lifecycle and the operational environment of the system. He did not ask: "What happens to the production data source if I run this locally?"',
                    '<h2>Developers Must Think About Cascading Consequences</h2>',
                    'The difference between a junior developer and a senior enterprise engineer is not how fast they type or how many frameworks they know. It is their ability to predict the consequences of their code before they write it. A junior developer focused only on coding might think: "I need to import these orders, so I will write an import function." A senior engineer thinks about the edge cases, failure states, and operational impacts of that function.',
                    'A disciplined developer asks: "What happens if the import process crashes halfway through? Will it create duplicate orders when restarted? How do we track which records were successfully processed? Do we have database transactions to ensure data consistency? If an API failure handling mechanism is triggered, does it alert the operations team?" Thinking through these scenarios before writing code is what keeps large enterprise systems stable and reliable.',
                    '<h2>The Hidden Threat: Scale and Performance Degradation</h2>',
                    'Another common way developers fail on large projects is by neglecting performance optimization and scalability. During local development, developers usually work with small datasets—maybe 50 or 100 test records. In this scenario, almost any query runs instantly. A loop that queries the database inside every iteration (the classic N+1 query problem) takes only a few milliseconds locally. It looks perfectly fine.',
                    'But when that code is deployed to a production server with millions of database records and hundreds of concurrent users, the performance characteristics change dramatically. The database query that took 5 milliseconds locally now takes 5 seconds because it requires a full table scan. The N+1 loop that ran 10 times locally now runs 10,000 times, locking the database, consuming all available CPU, and causing the entire application to time out.',
                    'Performance optimization in enterprise software systems is not optional; it is a core requirement. Developers must understand database indexing, eager loading of relationships, query profiling, caching strategies, and asynchronous job queues. If you write code that blocks the main thread or makes inefficient database calls, you are introducing a ticking time bomb into the system.',
                    '<h2>Moving Beyond "It Works on My Machine"</h2>',
                    'The phrase "it works on my machine" is a symptom of a developer who has not yet transitioned to an enterprise mindset. Your local development environment is a sterile, controlled environment. It does not reflect the reality of production. Your local machine does not have to deal with network latency, concurrent database locks, external API rate limits, background processes, or real-time user traffic. Production is where your assumptions are tested under real-world conditions. An enterprise engineer always assumes that anything that can go wrong will go wrong, and designs the software to be resilient, monitorable, and easy to recover.',
                    '<h2>AI Coding Tools: The Illusion of Understanding</h2>',
                    'In recent years, the widespread adoption of AI-assisted programming tools (such as Copilot, ChatGPT, and Claude) has changed the way developers write code. While these tools are incredibly powerful for generating boilerplate code, writing unit tests, and researching syntax, they have also introduced a new risk: the illusion of understanding. Developers are increasingly copying and pasting AI-generated code directly into complex systems without fully understanding how that code works or what impact it has.',
                    'AI models are trained on public data. They understand programming languages, syntax, and common design patterns. But they do not know the unique, undocumented business rules of your specific enterprise system. They do not know which APIs are one-time sources. They do not know the historical context of your database schema. They do not know which tables are critical to other departments. If you rely on AI to write your code without understanding the architecture yourself, you are significantly increasing the risk of introducing bugs and performance issues.',
                    'AI can help you write code faster, but if you do not understand the system, it will simply help you make the wrong changes faster. A developer must always remain the ultimate architect, validating every line of code, checking security implications, analyzing performance impact, and ensuring alignment with business logic.',
                    '<h2>Cultivating an Engineering Mindset for Enterprise Systems</h2>',
                    'To succeed on large, complex software systems, developers must cultivate an engineering mindset. This means asking five critical questions before making any significant modification to the codebase:',
                    '1. <strong>What is the business impact?</strong> If this feature fails, does it block client signups, disrupt payment processing, or stop order shipments?',
                    '2. <strong>What is the data lifecycle?</strong> How does data flow through this feature? Are there safeguards to prevent duplication, data loss, or corruption?',
                    '3. <strong>What are the dependencies?</strong> What other parts of the system—cron jobs, queue workers, external APIs, reporting tools—rely on this codebase or database table?',
                    '4. <strong>How does it scale?</strong> Will this code perform efficiently when the database grows to millions of rows and hundreds of users access it simultaneously?',
                    '5. <strong>What is the recovery plan?</strong> If this changes fails in production, how do we roll back safely? How do we identify and repair any affected data?',
                    '<h2>Conclusion</h2>',
                    'The most valuable software engineers are not those who write the most lines of code or implement features the fastest. They are the ones who understand the system deeply, prevent production issues before they happen, and design software that is resilient, performant, and maintainable. Technology, frameworks, and AI tools will continue to evolve, but the core responsibility of a developer remains unchanged: you must truly understand the system you build. Do not outsource your understanding to AI, and never settle for "it works on my machine." Understand your data, anticipate consequences, optimize for performance, and build with discipline.',
                ]),
                'faqs' => [
                    [
                        'question' => 'Why is code that works locally dangerous in production?',
                        'answer' => 'Local environments lack concurrent users, production scale databases, real traffic load, and background jobs. A query or API call that works instantly with 100 records can crash or freeze a system under production volume.'
                    ],
                    [
                        'question' => 'How does blind AI dependency affect software quality?',
                        'answer' => 'AI tools do not know your internal business rules, system dependencies, or undocumented client requests. Relying on generated code without understanding it often leads to silent errors, scale limits, and duplicate logic.'
                    ],
                    [
                        'question' => 'What is the most critical skill for enterprise developers?',
                        'answer' => 'The ability to understand the data lifecycle, trace operational consequences, verify edge cases, and design recovery procedures rather than just writing code that works on their own machine.'
                    ]
                ],
                'internal_links' => [
                    [
                        'label' => 'Learn about Verse Next software services',
                        'href' => '/services'
                    ],
                    [
                        'label' => 'Discuss your enterprise software project',
                        'href' => '/contact'
                    ]
                ],
                'status' => 'published',
                'is_featured' => true,
                'published_at' => now(),
            ]
        );
    }
}
