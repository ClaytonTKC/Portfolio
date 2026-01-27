import client from '../api/client';

export interface Project {
    id?: string;
    title: string;
    description: string;
    imageUrl?: string;
    liveUrl?: string;
    codeUrl?: string;
    tags?: string[];
    featured?: boolean;
    sortOrder?: number;
}

export interface Skill {
    id?: string;
    name: string;
    icon?: string;
    proficiency: number;
    category?: string;
    sortOrder?: number;
}

export const contentService = {
    // Projects
    async createProject(project: Project): Promise<Project> {
        const response = await client.post<Project>('/admin/projects', project);
        return response.data;
    },

    // Skills
    async createSkill(skill: Skill): Promise<Skill> {
        const response = await client.post<Skill>('/admin/skills', skill);
        return response.data;
    },

    // Public Data Fetching
    async getProjects(): Promise<Project[]> {
        const response = await client.get<Project[]>('/public/projects');
        return response.data;
    },

    async getSkills(): Promise<Skill[]> {
        const response = await client.get<Skill[]>('/public/skills');
        return response.data;
    }
};
