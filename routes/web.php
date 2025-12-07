<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    $user->load('roles'); // Load Spatie roles

    $data = [
        'user' => $user,
        'stats' => [
            'total_reports' => \App\Models\Report::count(),
            'pending_reports' => \App\Models\Report::where('status', 'pending')->count(),
            'in_progress_reports' => \App\Models\Report::where('status', 'in_progress')->count(),
            'resolved_reports' => \App\Models\Report::where('status', 'resolved')->count(),
            'user_reports' => $user->reports()->count(),
            'user_votes' => $user->votes()->count(),
            'user_comments' => $user->comments()->count(),
        ],
        'recent_reports' => \App\Models\Report::with(['user', 'images'])
            ->withCount('votes')
            ->latest()
            ->take(5)
            ->get(),
    ];

    return Inertia::render('Dashboard', $data);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/reports', [\App\Http\Controllers\Admin\AdminReportController::class, 'index'])->name('reports.index');
    Route::post('/reports/{report}/assign', [\App\Http\Controllers\Admin\AdminReportController::class, 'assign'])->name('reports.assign');
    Route::post('/reports/bulk-status', [\App\Http\Controllers\Admin\AdminReportController::class, 'bulkUpdateStatus'])->name('reports.bulk-status');
    Route::post('/reports/bulk-assign', [\App\Http\Controllers\Admin\AdminReportController::class, 'bulkAssign'])->name('reports.bulk-assign');
    Route::delete('/reports/bulk-delete', [\App\Http\Controllers\Admin\AdminReportController::class, 'bulkDelete'])->name('reports.bulk-delete');
});

require __DIR__ . '/auth.php';
