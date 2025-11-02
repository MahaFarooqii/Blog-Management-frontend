export interface Project {
    _id: string;
    title: string;
    description: string;
    status: string;
    owner?: { name: string };
    createdAt: string;
}