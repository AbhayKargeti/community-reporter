<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Comment;
use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoReportsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();
        $staff1 = User::where('email', 'staff@example.com')->first();
        $staff2 = User::where('email', 'john.staff@example.com')->first();
        $citizen1 = User::where('email', 'john@example.com')->first();
        $citizen2 = User::where('email', 'jane@example.com')->first();

        // Create sample reports
        $report1 = Report::create([
            'user_id' => $citizen1->id,
            'title' => 'Broken Street Light on Main St',
            'description' => 'The street light at the corner of Main St and 5th Ave has been out for two weeks. It\'s very dark at night and unsafe for pedestrians.',
            'category' => 'Infrastructure',
            'status' => 'pending',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'address' => 'Main St & 5th Ave, New York, NY',
        ]);

        $report2 = Report::create([
            'user_id' => $citizen2->id,
            'assigned_to' => $staff1->id,
            'title' => 'Pothole on Highway 101',
            'description' => 'Large pothole causing damage to vehicles. Needs immediate attention.',
            'category' => 'Roads',
            'status' => 'assessed',
            'latitude' => 37.7749,
            'longitude' => -122.4194,
            'address' => 'Highway 101, San Francisco, CA',
        ]);

        $report3 = Report::create([
            'user_id' => $citizen1->id,
            'assigned_to' => $staff2->id,
            'title' => 'Graffiti on Community Center Wall',
            'description' => 'Vandalism on the north wall of the community center. Should be cleaned up.',
            'category' => 'Vandalism',
            'status' => 'in_progress',
            'latitude' => 34.0522,
            'longitude' => -118.2437,
            'address' => '123 Community Dr, Los Angeles, CA',
        ]);

        $report4 = Report::create([
            'user_id' => $citizen2->id,
            'assigned_to' => $staff1->id,
            'title' => 'Illegal Dumping in Park',
            'description' => 'Someone has dumped construction waste in Central Park. Needs cleanup crew.',
            'category' => 'Environment',
            'status' => 'resolved',
            'latitude' => 40.7829,
            'longitude' => -73.9654,
            'address' => 'Central Park, New York, NY',
        ]);

        $report5 = Report::create([
            'user_id' => $citizen1->id,
            'title' => 'Broken Playground Equipment',
            'description' => 'Swing set chain is broken at neighborhood playground. Safety hazard for children.',
            'category' => 'Parks & Recreation',
            'status' => 'pending',
            'latitude' => 34.0407,
            'longitude' => -118.2468,
            'address' => 'Oak Park, Los Angeles, CA',
        ]);

        // Add votes
        ReportVote::create(['report_id' => $report1->id, 'user_id' => $citizen2->id]);
        ReportVote::create(['report_id' => $report1->id, 'user_id' => $admin->id]);
        ReportVote::create(['report_id' => $report2->id, 'user_id' => $citizen1->id]);
        ReportVote::create(['report_id' => $report2->id, 'user_id' => $admin->id]);
        ReportVote::create(['report_id' => $report3->id, 'user_id' => $citizen2->id]);
        ReportVote::create(['report_id' => $report5->id, 'user_id' => $citizen2->id]);

        // Add comments
        Comment::create([
            'report_id' => $report1->id,
            'user_id' => $citizen2->id,
            'body' => 'I noticed this too! It\'s been out for a while now.',
        ]);

        Comment::create([
            'report_id' => $report1->id,
            'user_id' => $admin->id,
            'body' => 'Thank you for reporting. We\'ve forwarded this to the utilities department.',
        ]);

        Comment::create([
            'report_id' => $report2->id,
            'user_id' => $staff1->id,
            'body' => 'Assessment completed. Repair crew scheduled for next week.',
        ]);

        Comment::create([
            'report_id' => $report3->id,
            'user_id' => $staff2->id,
            'body' => 'Cleaning crew has been dispatched. Expected completion in 2 days.',
        ]);

        Comment::create([
            'report_id' => $report4->id,
            'user_id' => $staff1->id,
            'body' => 'Cleanup completed. Area is now clear. Thank you for reporting.',
        ]);

        // Add activities
        Activity::create(['user_id' => $citizen1->id, 'action' => 'report_created', 'model_type' => Report::class, 'model_id' => $report1->id, 'meta' => ['title' => $report1->title], 'created_at' => now()]);
        Activity::create(['user_id' => $citizen2->id, 'action' => 'report_created', 'model_type' => Report::class, 'model_id' => $report2->id, 'meta' => ['title' => $report2->title], 'created_at' => now()]);
        Activity::create(['user_id' => $admin->id, 'action' => 'report_assigned', 'model_type' => Report::class, 'model_id' => $report2->id, 'meta' => ['assigned_to' => $staff1->name], 'created_at' => now()]);
        Activity::create(['user_id' => $admin->id, 'action' => 'report_status_changed', 'model_type' => Report::class, 'model_id' => $report2->id, 'meta' => ['old_status' => 'pending', 'new_status' => 'assessed'], 'created_at' => now()]);
        Activity::create(['user_id' => $citizen1->id, 'action' => 'report_created', 'model_type' => Report::class, 'model_id' => $report3->id, 'meta' => ['title' => $report3->title], 'created_at' => now()]);
        Activity::create(['user_id' => $admin->id, 'action' => 'report_assigned', 'model_type' => Report::class, 'model_id' => $report3->id, 'meta' => ['assigned_to' => $staff2->name], 'created_at' => now()]);
        Activity::create(['user_id' => $staff2->id, 'action' => 'report_status_changed', 'model_type' => Report::class, 'model_id' => $report3->id, 'meta' => ['old_status' => 'assessed', 'new_status' => 'in_progress'], 'created_at' => now()]);
        Activity::create(['user_id' => $citizen2->id, 'action' => 'report_created', 'model_type' => Report::class, 'model_id' => $report4->id, 'meta' => ['title' => $report4->title], 'created_at' => now()]);
        Activity::create(['user_id' => $admin->id, 'action' => 'report_assigned', 'model_type' => Report::class, 'model_id' => $report4->id, 'meta' => ['assigned_to' => $staff1->name], 'created_at' => now()]);
        Activity::create(['user_id' => $staff1->id, 'action' => 'report_status_changed', 'model_type' => Report::class, 'model_id' => $report4->id, 'meta' => ['old_status' => 'in_progress', 'new_status' => 'resolved'], 'created_at' => now()]);

        $this->command->info('Demo reports created successfully!');
    }
}
