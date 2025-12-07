<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Activity;
use App\Models\Comment;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Store a new comment on a report.
     */
    public function store(StoreCommentRequest $request, $reportId)
    {
        $report = Report::findOrFail($reportId);

        $comment = $report->comments()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        // Log activity
        Activity::log('comment_created', Comment::class, $comment->id, [
            'report_id' => $reportId,
        ]);

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment->load('user'),
        ], 201);
    }

    /**
     * Delete a comment.
     */
    public function destroy($commentId)
    {
        $comment = Comment::findOrFail($commentId);

        // Check authorization
        if (auth()->id() !== $comment->user_id && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        // Log activity
        Activity::log('comment_deleted', Comment::class, $commentId);

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }
}
