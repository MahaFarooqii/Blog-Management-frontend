import React, { useEffect, useState } from "react";
import API from "../api/axios";

interface Ticket {
    _id: string;
    task?: { title: string };
    createdBy?: { name: string };
    assignedTo?: { name: string };
    status: string;
    notes?: string;
    createdAt: string;
}

const Tickets: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const { data } = await API.get("/tickets");
                setTickets(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch tickets");
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-gray-700 text-lg">Loading tickets...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tickets</h1>

            {tickets.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">No tickets found.</div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Task
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Created By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Assigned To
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Notes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                        {ticket.task?.title || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {ticket.createdBy?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {ticket.assignedTo?.name || "Unassigned"}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${ticket.status === "resolved"
                                                ? "bg-blue-100 text-blue-700"
                                                : ticket.status === "in-progress"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {ticket.notes || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Tickets;
