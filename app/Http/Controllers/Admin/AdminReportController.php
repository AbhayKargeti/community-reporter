<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        // Check admin permission
        if (!$request->user()->hasRole(['admin', 'staff'])) {
            abort(403, 'Unauthorized');
        }

        $query = Report::with(['user:id,name,email', 'assignedTo:id,name,email'])
            ->withCount('votes');

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%")
                    ->orWhere('location', 'like', "%{$request->search}%");
            });
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $reports = $query->paginate(15)->withQueryString();

        // Get staff users for assignment dropdown
        $staffUsers = User::role('staff')->get(['id', 'name']);

        // Get statistics
        $stats = [
            'total' => Report::count(),
            'pending' => Report::where('status', 'pending')->count(),
            'in_progress' => Report::where('status', 'in_progress')->count(),
            'resolved' => Report::where('status', 'resolved')->count(),
            'unassigned' => Report::whereNull('assigned_to')->count(),
        ];

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
            'staffUsers' => $staffUsers,
            'stats' => $stats,
            'filters' => $request->only(['status', 'category', 'assigned_to', 'search', 'date_from', 'date_to', 'sort_by', 'sort_order']),
        ]);
    }

    public function assign(Request $request, Report $report)
    {
        if (!$request->user()->hasPermissionTo('assign reports')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $report->update([
            'assigned_to' => $request->assigned_to,
        ]);

        // Log activity
        \App\Models\Activity::log('assign_report', $report->id, [
            'assigned_to' => $request->assigned_to,
            'assigned_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Report assigned successfully');
    }

    public function bulkUpdateStatus(Request $request)
    {
        if (!$request->user()->hasPermissionTo('change report status')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'report_ids' => 'required|array',
            'report_ids.*' => 'exists:reports,id',
            'status' => 'required|in:pending,assessed,in_progress,resolved,rejected',
        ]);

        Report::whereIn('id', $request->report_ids)->update([
            'status' => $request->status,
        ]);

        // Log activities
        foreach ($request->report_ids as $reportId) {
            \App\Models\Activity::log('bulk_status_update', $reportId, [
                'new_status' => $request->status,
                'updated_by' => $request->user()->id,
            ]);
        }

        return back()->with('success', count($request->report_ids) . ' reports updated successfully');
    }

    public function bulkAssign(Request $request)
    {
        if (!$request->user()->hasPermissionTo('assign reports')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'report_ids' => 'required|array',
            'report_ids.*' => 'exists:reports,id',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        Report::whereIn('id', $request->report_ids)->update([
            'assigned_to' => $request->assigned_to,
        ]);

        // Log activities
        foreach ($request->report_ids as $reportId) {
            \App\Models\Activity::log('bulk_assign', $reportId, [
                'assigned_to' => $request->assigned_to,
                'assigned_by' => $request->user()->id,
            ]);
        }

        return back()->with('success', count($request->report_ids) . ' reports assigned successfully');
    }

    public function bulkDelete(Request $request)
    {
        if (!$request->user()->hasPermissionTo('delete all reports')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'report_ids' => 'required|array',
            'report_ids.*' => 'exists:reports,id',
        ]);

        Report::whereIn('id', $request->report_ids)->delete();

        return back()->with('success', count($request->report_ids) . ' reports deleted successfully');
    }
}
