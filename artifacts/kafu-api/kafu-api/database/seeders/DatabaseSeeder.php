<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Order matters — seeders that depend on CMS users (author_id = 1)
     * must run after CmsSeeder.
     */
    public function run(): void
    {
        // ── Core CMS infrastructure (users, media, documents) ─────────────────
        $this->call(CmsSeeder::class);
        $this->call(MediaMigrationSeeder::class);
        $this->call(DocumentsSeeder::class);

        // ── Content (all depend on author_id = 1 from CmsSeeder) ──────────────
        $this->call(ContentMigrationSeeder::class);
        $this->call(NewsEventsAnnouncementsSeeder::class);
        $this->call(OpportunitiesSeeder::class);

        // ── Research & International ───────────────────────────────────────────
        $this->call(ResearchSeeder::class);
        $this->call(InternationalSeeder::class);

        // ── Repository ────────────────────────────────────────────────────────
        $this->call(RepositorySeeder::class);

        // ── Admissions & KUCCPS ───────────────────────────────────────────────
        $this->call(AdmissionsModuleSeeder::class);
        $this->call(KuccpsModuleSeeder::class);
        $this->call(SampleApplicationsSeeder::class);

        // ── Governance, Gallery, Departments, Campuses ────────────────────────
        $this->call(GovernanceSeeder::class);
        $this->call(GallerySeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(CampusSeeder::class);

        // ── Site-wide configuration (CMS back-office settings) ────────────────
        $this->call(SiteConfigSeeder::class);
    }
}
