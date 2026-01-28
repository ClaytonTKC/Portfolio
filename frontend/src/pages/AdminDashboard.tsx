import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AddProjectModal } from '../components/admin/AddProjectModal';
import { AddSkillModal } from '../components/admin/AddSkillModal';

export const AdminDashboard: React.FC = () => {
    const [activeModal, setActiveModal] = useState<'project' | 'skill' | null>(null);

    const pendingTestimonials = [
        { id: '1', name: 'New User', content: 'Great portfolio!', date: '2 hours ago' },
        { id: '2', name: 'Client X', content: 'Amazing work on our project...', date: '1 day ago' },
    ];

    const recentMessages = [
        { id: '1', name: 'Clay Smith', email: 'Clay@example.com', subject: 'Project inquiry', date: '1 hour ago' },
        { id: '2', name: 'Jane Doe', email: 'jane@example.com', subject: 'Collaboration opportunity', date: '3 hours ago' },
    ];

    return (
        <>
            {/* Quick Actions */}
            <Card hover={false}>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="primary"
                        onClick={() => setActiveModal('project')}
                    >
                        Add Project
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setActiveModal('skill')}
                    >
                        Add Skill
                    </Button>
                    <Button variant="secondary">Update Resume</Button>
                    <Button variant="secondary">Edit Contact Info</Button>
                </div>
            </Card>

            {/* Pending Testimonials */}
            <Card hover={false}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Pending Testimonials</h2>
                    <span className="text-sm text-[var(--color-warning)] bg-[var(--color-warning)]/20 px-2 py-1 rounded-full">
                        {pendingTestimonials.length} pending
                    </span>
                </div>
                <div className="space-y-4">
                    {pendingTestimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="flex items-start justify-between p-4 bg-[var(--color-surface)] rounded-lg"
                        >
                            <div className="flex-1">
                                <p className="font-medium">{testimonial.name}</p>
                                <p className="text-sm text-[var(--color-text-muted)] line-clamp-1">
                                    {testimonial.content}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                    {testimonial.date}
                                </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button className="px-3 py-1 text-sm bg-[var(--color-success)] text-white rounded-md hover:opacity-90">
                                    Approve
                                </button>
                                <button className="px-3 py-1 text-sm bg-[var(--color-error)] text-white rounded-md hover:opacity-90">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Recent Messages */}
            <Card hover={false}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Messages</h2>
                    <a href="/admin/messages" className="text-sm text-[var(--color-primary)] hover:underline">
                        View All
                    </a>
                </div>
                <div className="space-y-3">
                    {recentMessages.map((message) => (
                        <div
                            key={message.id}
                            className="flex items-center justify-between py-3 border-b border-[var(--glass-border)] last:border-0"
                        >
                            <div>
                                <p className="font-medium">{message.name}</p>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    {message.subject}
                                </p>
                            </div>
                            <span className="text-sm text-[var(--color-text-muted)]">
                                {message.date}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Modals */}
            <AddProjectModal
                isOpen={activeModal === 'project'}
                onClose={() => setActiveModal(null)}
            />
            <AddSkillModal
                isOpen={activeModal === 'skill'}
                onClose={() => setActiveModal(null)}
            />
        </>
    );
};
