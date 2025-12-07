<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create regular users
        $user1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Create sample reports
        $report1 = Report::create([
            'user_id' => $user1->id,
            'title' => 'Broken Street Light on Main St',
            'description' => 'The street light at the corner of Main St and 5th Ave has been out for two weeks. It\'s very dark at night and unsafe for pedestrians.',
            'category' => 'Infrastructure',
            'status' => 'pending',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'address' => 'Main St & 5th Ave, New York, NY',
        ]);

        $report2 = Report::create([
            'user_id' => $user2->id,
            'title' => 'Pothole on Highway 101',
            'description' => 'Large pothole causing damage to vehicles. Needs immediate attention.',
            'category' => 'Roads',
            'status' => 'assessed',
            'latitude' => 37.7749,
            'longitude' => -122.4194,
            'address' => 'Highway 101, San Francisco, CA',
        ]);

        $report3 = Report::create([
            'user_id' => $user1->id,
            'title' => 'Graffiti on Community Center Wall',
            'description' => 'Vandalism on the north wall of the community center. Should be cleaned up.',
            'category' => 'Vandalism',
            'status' => 'in_progress',
            'latitude' => 34.0522,
            'longitude' => -118.2437,
            'address' => '123 Community Dr, Los Angeles, CA',
        ]);

        // Add votes
        ReportVote::create(['report_id' => $report1->id, 'user_id' => $user2->id]);
        ReportVote::create(['report_id' => $report1->id, 'user_id' => $admin->id]);
        ReportVote::create(['report_id' => $report2->id, 'user_id' => $user1->id]);

        // Add comments
        Comment::create([
            'report_id' => $report1->id,
            'user_id' => $user2->id,
            'body' => 'I noticed this too! It\'s been out for a while now.',
        ]);

        Comment::create([
            'report_id' => $report1->id,
            'user_id' => $admin->id,
            'body' => 'Thank you for reporting. We\'ve forwarded this to the utilities department.',
        ]);

        Comment::create([
            'report_id' => $report2->id,
            'user_id' => $admin->id,
            'body' => 'Assessment completed. Repair crew scheduled for next week.',
        ]);

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Admin: admin@example.com / password');
        $this->command->info('User 1: john@example.com / password');
        $this->command->info('User 2: jane@example.com / password');
    }
}
