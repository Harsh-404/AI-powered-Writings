<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Article;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;

class ScrapeBeyondChats extends Command
{
    protected $signature = 'scrape:beyondchats';
    protected $description = 'Scrape 5 oldest articles from BeyondChats';

    public function handle()
{
    $this->info('SCRAPER STARTED');

    $client = new \GuzzleHttp\Client([
        'timeout' => 30,
        'verify' => false
    ]);

    // Manually provided oldest article URLs
    $urls = [
        'https://beyondchats.com/blogs/virtual-assistant/',
        'https://beyondchats.com/blogs/live-chatbot/',
        'https://beyondchats.com/blogs/lead-generation-chatbots/',
        'https://beyondchats.com/blogs/chatbots-for-small-business-growth/',
        'https://beyondchats.com/blogs/customer-service-platforms/',
    ];

    foreach ($urls as $url) {

        if (\App\Models\Article::where('source_url', $url)->exists()) {
            $this->info("Skipped (exists): $url");
            continue;
        }

        $html = $client->get($url)->getBody()->getContents();
        $crawler = new \Symfony\Component\DomCrawler\Crawler($html);

        $title = $crawler->filter('h1')->first()->text();
        
        // Try multiple selectors to get the actual article content
        $content = $crawler->filter('.entry-content, .post-content, article .content, .blog-content, .content-area')->first()->text();
        
        if (empty($content)) {
            $content = $crawler->filter('article')->text();
        }
        
        if (empty($content)) {
            $content = $crawler->filter('main')->text();
        }

        \App\Models\Article::create([
            'title' => $title,
            'content' => $content,
            'source_url' => $url,
            'type' => 'original'
        ]);

        $this->info("Saved: $title");
    }

    $this->info('SCRAPER FINISHED');
}


//     public function handle()
//     {
//         $this->info('SCRAPER STARTED');
//         $client = new Client();
//         $this->info('FETCHING BLOG PAGE...');

//         $html = $client->get('https://beyondchats.com/blogs/virtual-assistant/')->getBody()->getContents();

//         $this->info('HTML LENGTH: ' . strlen($html));

//         $crawler = new Crawler($html);
//         $allLinks = $crawler->filter('a')->count();
// $this->info("TOTAL <a> TAGS: $allLinks");

//         $links = $crawler
//             ->filter('.blog-card a')
//             ->each(fn ($node) => $node->attr('href'));

//         $oldest = array_slice(array_reverse($links), 0, 5);

//         foreach ($oldest as $url) {
//             if (Article::where('source_url', $url)->exists()) continue;

//             $articleHtml = $client->get($url)->getBody();
//             $articleCrawler = new Crawler($articleHtml);

//             $title = $articleCrawler->filter('h1')->text();
//             $content = $articleCrawler->filter('.blog-content')->text();

//             Article::create([
//                 'title' => $title,
//                 'content' => $content,
//                 'source_url' => $url,
//                 'type' => 'original'
//             ]);

//             $this->info("Saved: $title");
//         }
//     }
}
