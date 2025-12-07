<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportStatusRequest;
use App\Models\Activity;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    /**
     * Display a listing of reports with filters.
     */
    public function index(Request $request)
    {
        $query = Report::with(['user', 'images'])
            ->withCount('votes');

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Sort
        $sortBy = $request->get('sort', 'newest');
        switch ($sortBy) {
            case 'most_voted':
                $query->orderBy('votes_count', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $reports = $query->paginate(15);

        return response()->json($reports);
    }

    /**
     * Store a newly created report.
     */
    public function store(StoreReportRequest $request)
    {
        $validated = $request->validated();

        // Create report
        $report = auth()->user()->reports()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reports', 'public');
                $report->images()->create([
                    'path' => $path,
                    'alt' => $validated['title'],
                ]);
            }
        }

        // Log activity
        Activity::log('report_created', Report::class, $report->id, [
            'title' => $report->title,
            'category' => $report->category,
        ]);

        return response()->json([
            'message' => 'Report created successfully',
            'report' => $report->load(['images', 'user']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $report = Report::with(['user', 'images', 'comments.user'])
            ->withCount('votes')
            ->findOrFail($id);

        // Check if current user has voted
        $hasVoted = false;
        if (auth()->check()) {
            $hasVoted = $report->hasVotedBy(auth()->id());
        }

        return response()->json([
            'report' => $report,
            'has_voted' => $hasVoted,
        ]);
    }

    /**
     * Update report status (admin only).
     */
    public function updateStatus(UpdateReportStatusRequest $request, string $id)
    {
        $report = Report::findOrFail($id);
        $oldStatus = $report->status;

        $report->update([
            'status' => $request->status,
        ]);

        // Log activity
        Activity::log('report_status_changed', Report::class, $report->id, [
            'old_status' => $oldStatus,
            'new_status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Report status updated successfully',
            'report' => $report,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $report = Report::findOrFail($id);

        // Check authorization
        if (auth()->id() !== $report->user_id && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete images from storage
        foreach ($report->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $report->delete();

        // Log activity
        Activity::log('report_deleted', Report::class, $id, [
            'title' => $report->title,
        ]);

        return response()->json([
            'message' => 'Report deleted successfully',
        ]);
    }
}
