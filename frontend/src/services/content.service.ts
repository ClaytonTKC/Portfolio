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

export interface Testimonial {
    id: string;
    name: string;
    content: string;
    date: string;
    status?: 'pending' | 'approved' | 'rejected';
    authorName?: string;
    authorRole?: string;
    authorEmail?: string;
    rating?: number;
    createdAt?: string;
}

export interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    content: string;
    date: string;
    read?: boolean;
    createdAt?: string;
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
        return response.data || [];
    },

    async getSkills(): Promise<Skill[]> {
        const response = await client.get<Skill[]>('/public/skills');
        return response.data || [];
    },

    async getExperiences(): Promise<Experience[]> {
        const response = await client.get<Experience[]>('/public/experience');
        return response.data || [];
    },

    async getEducation(): Promise<Education[]> {
        const response = await client.get<Education[]>('/public/education');
        return response.data || [];
    },

    async getHobbies(): Promise<Hobby[]> {
        const response = await client.get<Hobby[]>('/public/hobbies');
        return response.data || [];
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
    },

    // Testimonials & Messages (Mocked for now)
    // Testimonials
    async getPendingTestimonials(): Promise<Testimonial[]> {
        const response = await client.get<Testimonial[]>('/admin/testimonials');
        return response.data.filter(t => t.status === 'pending');
    },

    async getAllTestimonials(): Promise<Testimonial[]> {
        const response = await client.get<Testimonial[]>('/admin/testimonials');
        return response.data;
    },

    async approveTestimonial(id: string): Promise<void> {
        await client.put(`/admin/testimonials/${id}/approve`);
    },

    async rejectTestimonial(id: string): Promise<void> {
        await client.put(`/admin/testimonials/${id}/reject`);
    },

    async deleteTestimonial(id: string): Promise<void> {
        await client.delete(`/admin/testimonials/${id}`);
    },

    async createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
        const response = await client.post<Testimonial>('/public/testimonials', testimonial);
        return response.data;
    },

    async getApprovedTestimonials(): Promise<Testimonial[]> {
        const response = await client.get<Testimonial[]>('/public/testimonials');
        return response.data;
    },

    // Messages
    async getRecentMessages(): Promise<Message[]> {
        const response = await client.get<Message[]>('/admin/messages');
        return response.data.slice(0, 5); // Return only recent 5
    },

    async getMessages(): Promise<Message[]> {
        const response = await client.get<Message[]>('/admin/messages');
        return response.data;
    },

    async createMessage(message: Partial<Message>): Promise<Message> {
        const response = await client.post<Message>('/public/contact', message);
        return response.data;
    },

    async markMessageRead(id: string): Promise<void> {
        await client.put(`/admin/messages/${id}/read`);
    },

    async deleteMessage(id: string): Promise<void> {
        await client.delete(`/admin/messages/${id}`);
    }
};
