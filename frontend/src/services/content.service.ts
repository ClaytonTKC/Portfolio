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

export interface Experience {
    id?: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string[];
    sortOrder?: number;
}

export interface Education {
    id?: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate?: string;
    description: string;
    sortOrder?: number;
}

export interface Hobby {
    id?: string;
    name: string;
    icon: string;
    description: string;
    sortOrder?: number;
}

export const contentService = {
    // Projects
    async createProject(project: Project): Promise<Project> {
        const response = await client.post<Project>('/admin/projects', project);
        return response.data;
    },

    async updateProject(id: string, project: Project): Promise<Project> {
        const response = await client.put<Project>(`/admin/projects/${id}`, project);
        return response.data;
    },

    async deleteProject(id: string): Promise<void> {
        await client.delete(`/admin/projects/${id}`);
    },

    // Skills
    async createSkill(skill: Skill): Promise<Skill> {
        const response = await client.post<Skill>('/admin/skills', skill);
        return response.data;
    },

    async updateSkill(id: string, skill: Skill): Promise<Skill> {
        const response = await client.put<Skill>(`/admin/skills/${id}`, skill);
        return response.data;
    },

    async deleteSkill(id: string): Promise<void> {
        await client.delete(`/admin/skills/${id}`);
    },

    // Public Data Fetching
    async getProjects(): Promise<Project[]> {
        const response = await client.get<Project[]>('/public/projects');
        return response.data;
    },

    async getSkills(): Promise<Skill[]> {
        const response = await client.get<Skill[]>('/public/skills');
        return response.data;
    },

    async getExperiences(): Promise<Experience[]> {
        const response = await client.get<Experience[]>('/public/experience');
        return response.data;
    },

    async getEducation(): Promise<Education[]> {
        const response = await client.get<Education[]>('/public/education');
        return response.data;
    },

    async getHobbies(): Promise<Hobby[]> {
        const response = await client.get<Hobby[]>('/public/hobbies');
        return response.data;
    },

    // Experience
    async createExperience(experience: Experience): Promise<Experience> {
        const response = await client.post<Experience>('/admin/experience', experience);
        return response.data;
    },

    async updateExperience(id: string, experience: Experience): Promise<Experience> {
        const response = await client.put<Experience>(`/admin/experience/${id}`, experience);
        return response.data;
    },

    async deleteExperience(id: string): Promise<void> {
        await client.delete(`/admin/experience/${id}`);
    },

    // Education
    async createEducation(education: Education): Promise<Education> {
        const response = await client.post<Education>('/admin/education', education);
        return response.data;
    },

    async updateEducation(id: string, education: Education): Promise<Education> {
        const response = await client.put<Education>(`/admin/education/${id}`, education);
        return response.data;
    },

    async deleteEducation(id: string): Promise<void> {
        await client.delete(`/admin/education/${id}`);
    },

    // Hobbies
    async createHobby(hobby: Hobby): Promise<Hobby> {
        const response = await client.post<Hobby>('/admin/hobbies', hobby);
        return response.data;
    },

    async updateHobby(id: string, hobby: Hobby): Promise<Hobby> {
        const response = await client.put<Hobby>(`/admin/hobbies/${id}`, hobby);
        return response.data;
    },

    async deleteHobby(id: string): Promise<void> {
        await client.delete(`/admin/hobbies/${id}`);
    }
};
