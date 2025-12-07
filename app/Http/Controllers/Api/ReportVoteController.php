<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Report;
use App\Models\ReportVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportVoteController extends Controller
{
    /**
     * Toggle vote for a report (upvote/unvote).
     */
    public function toggle(Request $request, $reportId)
    {
        $report = Report::findOrFail($reportId);
        $userId = auth()->id();

        // Check if user already voted
        $existingVote = ReportVote::where('report_id', $reportId)
            ->where('user_id', $userId)
            ->first();

        if ($existingVote) {
            // Unvote
            $existingVote->delete();

            Activity::log('report_unvoted', Report::class, $reportId);

            return response()->json([
                'message' => 'Vote removed successfully',
                'voted' => false,
                'votes_count' => $report->votesCount(),
            ]);
        } else {
            // Vote
            ReportVote::create([
                'report_id' => $reportId,
                'user_id' => $userId,
            ]);

            Activity::log('report_voted', Report::class, $reportId);

            return response()->json([
                'message' => 'Vote added successfully',
                'voted' => true,
                'votes_count' => $report->votesCount(),
            ]);
        }
    }
}
