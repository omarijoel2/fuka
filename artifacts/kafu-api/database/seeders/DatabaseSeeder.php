<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CmsSeeder::class);
        $this->call(MediaMigrationSeeder::class);
        $this->call(DocumentsSeeder::class);
        $this->call(ResearchSeeder::class);
        $this->call(InternationalSeeder::class);
        $this->call(RepositorySeeder::class);
        $this->call(AdmissionsModuleSeeder::class);
        $this->call(KuccpsModuleSeeder::class);
        $this->call(GovernanceSeeder::class);
        $this->call(GallerySeeder::class);
        $this->call(DepartmentSeeder::class);
    }
}
