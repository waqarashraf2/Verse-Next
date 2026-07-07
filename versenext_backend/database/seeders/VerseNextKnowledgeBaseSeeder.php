<?php

namespace Database\Seeders;

use App\Models\KnowledgeBaseEntry;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VerseNextKnowledgeBaseSeeder extends Seeder
{
    public function run(): void
    {
        $topics = [
            'website' => [
                'Website Development',
                'Business Website Design',
                'Corporate Website',
                'Landing Page Design',
                'Portfolio Website',
                'Service Website',
                'Laravel Website',
                'Next.js Website',
                'Responsive Web Design',
                'Website Redesign',
            ],
            'ecommerce' => [
                'Ecommerce Store',
                'Product Catalog',
                'Checkout Experience',
                'Order Management',
                'Payment Gateway',
                'Inventory Flow',
                'Customer Accounts',
                'Store SEO',
                'Conversion Tracking',
                'Marketplace Features',
            ],
            'login_portal' => [
                'Login Section',
                'Signup Section',
                'User Dashboard',
                'Admin Dashboard',
                'Role Based Access',
                'Secure Authentication',
                'Password Reset',
                'Profile Management',
                'Protected Pages',
                'Client Portal',
            ],
            'articles' => [
                'Article Section',
                'Blog Structure',
                'SEO Article',
                'Content Categories',
                'Author Pages',
                'Reading Time',
                'Featured Article',
                'Internal Linking',
                'Article Schema',
                'Publishing Workflow',
            ],
            'seo' => [
                'Technical SEO',
                'Metadata Structure',
                'Schema Markup',
                'Sitemap Setup',
                'Robots File',
                'Page Speed',
                'Keyword Mapping',
                'Local SEO',
                'Service Page SEO',
                'Search Console Setup',
            ],
            'ai_solution' => [
                'AI Assistant',
                'FAQ Automation',
                'Lead Routing',
                'Support Workflow',
                'Knowledge Base Chat',
                'Business Automation',
                'AI Recommendations',
                'Content Assistant',
                'Internal AI Tools',
                'Smart Forms',
            ],
            'digital_marketing' => [
                'Lead Generation',
                'Campaign Landing Page',
                'Analytics Setup',
                'Retargeting Flow',
                'Social Media Campaign',
                'Creative Testing',
                'Ad Tracking',
                'Marketing Funnel',
                'Conversion Audit',
                'Growth Strategy',
            ],
            'mobile_app' => [
                'Mobile App Planning',
                'Android App',
                'iOS App',
                'Cross Platform App',
                'Push Notifications',
                'App Dashboard',
                'User Accounts',
                'App API',
                'Mobile UX',
                'App Maintenance',
            ],
            'founder' => [
                'Waqar Ashraf',
                'Verse Next CEO',
                'versenext.com',
                'Company Leadership',
                'Business Vision',
                'Professional Team',
                'Client Communication',
                'Digital Product Direction',
                'Service Quality',
                'Project Consultation',
            ],
            'chatbot_answer' => [
                'Service Discussion',
                'Meeting First',
                'Professional Chat',
                'Meeting First Chat',
                'No Contact Form in Chat',
                'Admin Online',
                'Auto Reply',
                'Email Reminder',
                'Roman Urdu Support',
                'Helpful Website Guidance',
            ],
        ];

        KnowledgeBaseEntry::whereIn('type', array_keys($topics))->delete();

        $angles = [
            'structure',
            'planning',
            'professional workflow',
            'business value',
            'SEO readiness',
            'user experience',
            'admin management',
            'security',
            'performance',
            'conversion focus',
        ];

        $answerTemplates = [
            'Verse Next handles {topic} with a professional discovery-first process. We discuss the service, business goal, required pages, content flow, and technical structure before moving toward a project roadmap.',
            '{topic} should feel clean, fast, secure, and easy to manage. Verse Next focuses on practical sections, responsive UI, SEO structure, and admin-friendly workflows instead of unnecessary complexity.',
            'For {topic}, the right approach is to understand the business model first. After that, Verse Next can suggest the correct website sections, login flow, content structure, and automation options.',
            '{topic} can be connected with articles, service pages, metadata, schema, sitemap, and clear navigation so the website is built for both visitors and search engines.',
            'Verse Next can explain {topic} in a meeting and then prepare a tailored roadmap. The chat is for service guidance and should not collect personal details.',
        ];

        $count = 0;

        foreach ($topics as $type => $items) {
            foreach ($items as $topicIndex => $topic) {
                foreach ($angles as $angleIndex => $angle) {
                    for ($variant = 1; $variant <= 1; $variant++) {
                        $template = $answerTemplates[($topicIndex + $angleIndex + $variant) % count($answerTemplates)];
                        $title = "{$topic} {$angle} answer {$variant}";
                        $summary = str_replace('{topic}', $topic, $template);

                        KnowledgeBaseEntry::updateOrCreate(
                            ['slug' => Str::slug("{$type}-{$title}")],
                            [
                                'type' => $type,
                                'title' => $title,
                                'summary' => $summary,
                                'content' => $summary.' This answer supports professional service discussion for versenext.com and keeps commercial details for the meeting stage.',
                                'data' => [
                                    'topic' => $topic,
                                    'angle' => $angle,
                                    'variant' => $variant,
                                    'company' => 'Verse Next',
                                    'ceo' => 'Waqar Ashraf',
                                ],
                                'is_active' => true,
                                'sort_order' => $count,
                            ]
                        );

                        $count++;
                    }
                }
            }
        }

    }
}
