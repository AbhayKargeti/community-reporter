import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useState } from "react";

interface Report {
    id: number;
    title: string;
    description: string;
    location: string;
    category: string;
    status: string;
    created_at: string;
    votes_count: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    assigned_to?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface Staff {
    id: number;
    name: string;
}

interface Stats {
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
    unassigned: number;
}

interface Filters {
    status?: string;
    category?: string;
    assigned_to?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: string;
}

export default function AdminReportsIndex({
    auth,
    reports,
    staffUsers,
    stats,
    filters,
}: PageProps<{
    reports: {
        data: Report[];
        links: any;
        current_page: number;
        last_page: number;
    };
    staffUsers: Staff[];
    stats: Stats;
    filters: Filters;
}>) {
    const [selectedReports, setSelectedReports] = useState<number[]>([]);
    const [bulkStatus, setBulkStatus] = useState("");
    const [bulkAssignTo, setBulkAssignTo] = useState("");
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    const handleFilter = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route("admin.reports.index"), newFilters, {
            preserveState: true,
        });
    };

    const handleSelectAll = () => {
        if (selectedReports.length === reports.data.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(reports.data.map((r) => r.id));
        }
    };

    const handleSelectReport = (id: number) => {
        if (selectedReports.includes(id)) {
            setSelectedReports(selectedReports.filter((rid) => rid !== id));
        } else {
            setSelectedReports([...selectedReports, id]);
        }
    };

    const handleBulkAction = (action: "status" | "assign" | "delete") => {
        if (selectedReports.length === 0) {
            alert("Please select at least one report");
            return;
        }

        if (action === "status" && !bulkStatus) {
            alert("Please select a status");
            return;
        }

        if (action === "assign" && !bulkAssignTo) {
            alert("Please select a staff member");
            return;
        }

        if (action === "delete") {
            if (
                !confirm(
                    `Are you sure you want to delete ${selectedReports.length} report(s)?`
                )
            ) {
                return;
            }
        }

        const data: any = { report_ids: selectedReports };
        if (action === "status") data.status = bulkStatus;
        if (action === "assign") data.assigned_to = bulkAssignTo;

        router.post(route(`admin.reports.bulk-${action}`), data, {
            onSuccess: () => {
                setSelectedReports([]);
                setBulkStatus("");
                setBulkAssignTo("");
            },
        });
    };

    const handleAssign = (reportId: number, assignedTo: string) => {
        router.post(route("admin.reports.assign", reportId), {
            assigned_to: assignedTo || null,
        });
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800",
            assessed: "bg-blue-100 text-blue-800",
            in_progress: "bg-purple-100 text-purple-800",
            resolved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            road: "bg-orange-100 text-orange-800",
            water: "bg-blue-100 text-blue-800",
            electricity: "bg-yellow-100 text-yellow-800",
            sanitation: "bg-green-100 text-green-800",
            safety: "bg-red-100 text-red-800",
            other: "bg-gray-100 text-gray-800",
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin - Reports Management
                </h2>
            }
        >
            <Head title="Admin Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-5">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">
                                Total Reports
                            </div>
                            <div className="text-2xl font-bold text-gray-800">
                                {stats.total}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">Pending</div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.pending}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">
                                In Progress
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                                {stats.in_progress}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">
                                Resolved
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.resolved}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">
                                Unassigned
                            </div>
                            <div className="text-2xl font-bold text-orange-600">
                                {stats.unassigned}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={localFilters.search || ""}
                                    onChange={(e) =>
                                        handleFilter("search", e.target.value)
                                    }
                                    placeholder="Title, description, location..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={localFilters.status || ""}
                                    onChange={(e) =>
                                        handleFilter("status", e.target.value)
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="assessed">Assessed</option>
                                    <option value="in_progress">
                                        In Progress
                                    </option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={localFilters.category || ""}
                                    onChange={(e) =>
                                        handleFilter("category", e.target.value)
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All</option>
                                    <option value="road">Road</option>
                                    <option value="water">Water</option>
                                    <option value="electricity">
                                        Electricity
                                    </option>
                                    <option value="sanitation">
                                        Sanitation
                                    </option>
                                    <option value="safety">Safety</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assigned To
                                </label>
                                <select
                                    value={localFilters.assigned_to || ""}
                                    onChange={(e) =>
                                        handleFilter(
                                            "assigned_to",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All</option>
                                    <option value="unassigned">
                                        Unassigned
                                    </option>
                                    {staffUsers.map((staff) => (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedReports.length > 0 && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg mb-6 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-indigo-800">
                                    {selectedReports.length} report(s) selected
                                </span>
                                <div className="flex gap-2">
                                    <select
                                        value={bulkStatus}
                                        onChange={(e) =>
                                            setBulkStatus(e.target.value)
                                        }
                                        className="rounded-md border-indigo-300 text-sm"
                                    >
                                        <option value="">
                                            Change Status...
                                        </option>
                                        <option value="assessed">
                                            Assessed
                                        </option>
                                        <option value="in_progress">
                                            In Progress
                                        </option>
                                        <option value="resolved">
                                            Resolved
                                        </option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
                                    </select>
                                    <button
                                        onClick={() =>
                                            handleBulkAction("status")
                                        }
                                        disabled={!bulkStatus}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        Apply
                                    </button>

                                    <select
                                        value={bulkAssignTo}
                                        onChange={(e) =>
                                            setBulkAssignTo(e.target.value)
                                        }
                                        className="rounded-md border-indigo-300 text-sm ml-4"
                                    >
                                        <option value="">Assign To...</option>
                                        {staffUsers.map((staff) => (
                                            <option
                                                key={staff.id}
                                                value={staff.id}
                                            >
                                                {staff.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() =>
                                            handleBulkAction("assign")
                                        }
                                        disabled={!bulkAssignTo}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        Assign
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleBulkAction("delete")
                                        }
                                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 ml-4"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reports Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedReports.length ===
                                                reports.data.length
                                            }
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Report
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Reporter
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Assigned To
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Votes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.data.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedReports.includes(
                                                    report.id
                                                )}
                                                onChange={() =>
                                                    handleSelectReport(
                                                        report.id
                                                    )
                                                }
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {report.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {report.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                                    report.status
                                                )}`}
                                            >
                                                {report.status.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(
                                                    report.category
                                                )}`}
                                            >
                                                {report.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {report.user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={
                                                    report.assigned_to?.id || ""
                                                }
                                                onChange={(e) =>
                                                    handleAssign(
                                                        report.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="text-sm rounded-md border-gray-300"
                                            >
                                                <option value="">
                                                    Unassigned
                                                </option>
                                                {staffUsers.map((staff) => (
                                                    <option
                                                        key={staff.id}
                                                        value={staff.id}
                                                    >
                                                        {staff.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {report.votes_count}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(
                                                report.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {reports.links && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Page {reports.current_page} of{" "}
                                        {reports.last_page}
                                    </div>
                                    <div className="flex gap-2">
                                        {reports.links.map(
                                            (link: any, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            router.visit(
                                                                link.url
                                                            );
                                                        }
                                                    }}
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        link.active
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                                    } ${
                                                        !link.url
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
