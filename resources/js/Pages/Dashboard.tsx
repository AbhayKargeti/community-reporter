import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    roles?: Array<{ name: string }>;
}

interface Report {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    created_at: string;
    votes_count: number;
    user: {
        name: string;
    };
    images: Array<{
        path: string;
    }>;
}

interface Stats {
    total_reports: number;
    pending_reports: number;
    in_progress_reports: number;
    resolved_reports: number;
    user_reports: number;
    user_votes: number;
    user_comments: number;
}

interface DashboardProps {
    user: User;
    stats: Stats;
    recent_reports: Report[];
}

export default function Dashboard({
    user,
    stats,
    recent_reports,
}: DashboardProps) {
    const isAdmin =
        user.role === "admin" || user.roles?.some((r) => r.name === "admin");
    const isStaff =
        user.role === "staff" || user.roles?.some((r) => r.name === "staff");
    const hasAdminAccess = isAdmin || isStaff;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800",
            assessed: "bg-blue-100 text-blue-800",
            in_progress: "bg-purple-100 text-purple-800",
            resolved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {isAdmin
                            ? "Admin Dashboard"
                            : isStaff
                            ? "Staff Dashboard"
                            : "Dashboard"}
                    </h2>
                    <div className="flex gap-3">
                        {hasAdminAccess && (
                            <Link
                                href={route("admin.reports.index")}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Manage Reports
                            </Link>
                        )}
                        <Link
                            href="/reports/create"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            + Create Report
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Message */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">
                                Welcome back, {user.name}!
                            </h3>
                            <p className="text-indigo-100">
                                {isAdmin
                                    ? "Monitor and manage community reports from your admin dashboard."
                                    : isStaff
                                    ? "Manage assigned reports and help resolve community issues."
                                    : "Track your reports and help improve your community."}
                            </p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Reports */}
                        {isAdmin && (
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-6 w-6 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Reports
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {stats.total_reports}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pending Reports */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-yellow-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {isAdmin
                                                    ? "Pending"
                                                    : "My Reports"}
                                            </dt>
                                            <dd className="text-3xl font-semibold text-gray-900">
                                                {isAdmin
                                                    ? stats.pending_reports
                                                    : stats.user_reports}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* In Progress */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-purple-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {isAdmin
                                                    ? "In Progress"
                                                    : "My Votes"}
                                            </dt>
                                            <dd className="text-3xl font-semibold text-gray-900">
                                                {isAdmin
                                                    ? stats.in_progress_reports
                                                    : stats.user_votes}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resolved */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {isAdmin
                                                    ? "Resolved"
                                                    : "My Comments"}
                                            </dt>
                                            <dd className="text-3xl font-semibold text-gray-900">
                                                {isAdmin
                                                    ? stats.resolved_reports
                                                    : stats.user_comments}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Recent Reports
                            </h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {recent_reports.length > 0 ? (
                                recent_reports.map((report) => (
                                    <li
                                        key={report.id}
                                        className="p-6 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex items-start space-x-4">
                                            {/* Image Thumbnail */}
                                            {report.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${report.images[0].path}`}
                                                    alt={report.title}
                                                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <svg
                                                        className="h-8 w-8 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Report Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <Link
                                                            href={`/reports/${report.id}`}
                                                            className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition"
                                                        >
                                                            {report.title}
                                                        </Link>
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                            {report.description}
                                                        </p>
                                                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <svg
                                                                    className="h-4 w-4 mr-1"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                    />
                                                                </svg>
                                                                {
                                                                    report.user
                                                                        .name
                                                                }
                                                            </span>
                                                            <span className="flex items-center">
                                                                <svg
                                                                    className="h-4 w-4 mr-1"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                                                    />
                                                                </svg>
                                                                {
                                                                    report.category
                                                                }
                                                            </span>
                                                            <span className="flex items-center">
                                                                <svg
                                                                    className="h-4 w-4 mr-1"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                                </svg>
                                                                {
                                                                    report.votes_count
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                            report.status
                                                        )}`}
                                                    >
                                                        {report.status.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="p-6 text-center text-gray-500">
                                    No reports yet. Be the first to create one!
                                </li>
                            )}
                        </ul>
                        {recent_reports.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <Link
                                    href="/reports"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
                                >
                                    View all reports →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Admin/Staff Quick Actions */}
                    {hasAdminAccess && (
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Quick Actions
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <Link
                                        href={route("admin.reports.index")}
                                        className="flex flex-col items-center justify-center px-4 py-4 border-2 border-indigo-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 transition group"
                                    >
                                        <svg
                                            className="h-8 w-8 mb-2 text-indigo-500 group-hover:text-indigo-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                            />
                                        </svg>
                                        <span className="font-semibold">
                                            All Reports
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            Manage & filter
                                        </span>
                                    </Link>
                                    <Link
                                        href={
                                            route("admin.reports.index") +
                                            "?status=pending"
                                        }
                                        className="flex flex-col items-center justify-center px-4 py-4 border-2 border-yellow-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-yellow-50 hover:border-yellow-300 transition group"
                                    >
                                        <svg
                                            className="h-8 w-8 mb-2 text-yellow-500 group-hover:text-yellow-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span className="font-semibold">
                                            Pending
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            Review new reports
                                        </span>
                                    </Link>
                                    <Link
                                        href={
                                            route("admin.reports.index") +
                                            "?assigned_to=unassigned"
                                        }
                                        className="flex flex-col items-center justify-center px-4 py-4 border-2 border-orange-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:border-orange-300 transition group"
                                    >
                                        <svg
                                            className="h-8 w-8 mb-2 text-orange-500 group-hover:text-orange-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                            />
                                        </svg>
                                        <span className="font-semibold">
                                            Unassigned
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            Assign to staff
                                        </span>
                                    </Link>
                                    <Link
                                        href={
                                            route("admin.reports.index") +
                                            "?status=in_progress"
                                        }
                                        className="flex flex-col items-center justify-center px-4 py-4 border-2 border-purple-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition group"
                                    >
                                        <svg
                                            className="h-8 w-8 mb-2 text-purple-500 group-hover:text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                        <span className="font-semibold">
                                            In Progress
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            Track active work
                                        </span>
                                    </Link>
                                </div>
                                {isAdmin && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                        <Link
                                            href="/admin/users"
                                            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <svg
                                                className="h-5 w-5 mr-2 text-blue-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                />
                                            </svg>
                                            Manage Users
                                        </Link>
                                        <Link
                                            href="/admin/activities"
                                            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <svg
                                                className="h-5 w-5 mr-2 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                                />
                                            </svg>
                                            Activity Log
                                        </Link>
                                        <Link
                                            href="/admin/analytics"
                                            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <svg
                                                className="h-5 w-5 mr-2 text-indigo-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                            Analytics
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
