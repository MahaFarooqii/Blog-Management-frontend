export interface Task {
    _id: string;
    title: string;
    description?: string;
    project?: { _id: string; title: string };
    assignee?: { _id: string; name: string; email: string };
    priority: "low" | "medium" | "high";
    status: "open" | "in-progress" | "resolved";
    createdAt: string;
    resolutions?: { _id: string }[];
}
export interface CreateTaskPayload {
    title: string;
    description?: string;
    project: string; // project ID
    assignee?: string; // user ID
    priority: "low" | "medium" | "high";
    status: "open" | "in-progress" | "resolved";
}