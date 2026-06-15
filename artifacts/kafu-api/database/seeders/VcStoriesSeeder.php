<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CmsContent;
use Carbon\Carbon;

class VcStoriesSeeder extends Seeder
{
    public function run(): void
    {
        $stories = [
            [
                'slug'           => 'from-knowledge-to-climate-action-greener-future-kenya',
                'title'          => 'From Knowledge to Climate Action: How Kaimosi Friends University is Shaping a Greener Future for Kenya',
                'summary'        => 'Kaimosi Friends University is turning research and learning into tangible environmental impact, championing climate action and sustainability initiatives that are helping shape a greener future for Kenya. Read the full feature on Scholar Media Africa.',
                'category'       => 'Research & Innovation',
                'featured_image' => '/images/uploads/campus-main.jpg',
                'tags'           => ['Climate Action', 'Sustainability', 'Research', 'Environment'],
                'featured'       => false,
                'published_at'   => '2026-06-12 09:00:00',
                'body'           => '<p>Kaimosi Friends University continues to position itself at the forefront of environmental stewardship in Kenya, translating academic knowledge into practical climate action. From sustainability research to community-driven green initiatives, the university is demonstrating how higher education institutions can lead the transition to a more resilient and environmentally conscious future.</p><p>This feature, published by Scholar Media Africa, explores the university\'s contribution to climate resilience, conservation, and sustainable development across the region.</p>',
                'structured_data' => [
                    'external_url'   => 'https://scholarmedia.africa/environment/from-knowledge-to-climate-action-how-kaimosi-friends-university-is-shaping-a-greener-future-for-kenya/',
                    'external_label' => 'Read the full story on Scholar Media Africa',
                ],
            ],
            [
                'slug'           => 'vc-prof-mwita-one-year-in-office',
                'title'          => 'Prof. Peter Mwita Marks One Year as Vice-Chancellor of Kaimosi Friends University',
                'summary'        => 'A look back at Vice-Chancellor Prof. Peter Nyamuhanga Mwita\'s first year at the helm of Kaimosi Friends University, highlighting institutional milestones, growth, and the vision guiding the university forward.',
                'category'       => 'Leadership',
                'featured_image' => '/images/uploads/vc-cbe-training.jpg',
                'tags'           => ['Vice-Chancellor', 'Leadership', 'Milestones'],
                'featured'       => false,
                'published_at'   => '2026-06-10 09:00:00',
                'body'           => '<p>Vice-Chancellor Prof. Peter Nyamuhanga Mwita marks one year leading Kaimosi Friends University. In this video, the university reflects on the achievements, growth, and strategic direction realised during his first year in office.</p>',
                'structured_data' => [
                    'video_url' => 'https://youtu.be/Q3oME6i4TB8',
                ],
            ],
        ];

        foreach ($stories as $data) {
            if (CmsContent::where('slug', $data['slug'])->exists()) {
                continue;
            }
            CmsContent::create(array_merge([
                'type'       => 'news',
                'status'     => 'published',
                'is_deleted' => false,
                'author_id'  => 1,
            ], $data));
        }
    }
}
