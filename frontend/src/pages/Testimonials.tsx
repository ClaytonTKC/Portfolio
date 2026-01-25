import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Placeholder approved testimonials (would come from API)
const approvedTestimonials = [
    {
        id: '1',
        name: 'Sarah Johnson',
        role: 'CTO, Tech Startup',
        content: 'Working with Clay was an absolute pleasure. His technical expertise and problem-solving skills are outstanding. He delivered our project ahead of schedule and exceeded all expectations.',
        rating: 5,
    },
    {
        id: '2',
        name: 'Michael Chen',
        role: 'Product Manager, Enterprise Co.',
        content: 'Clay\'s ability to translate complex requirements into elegant solutions is remarkable. He\'s not just a developer, but a true partner who cares about the success of the project.',
        rating: 5,
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        role: 'Founder, Design Agency',
        content: 'Exceptional work! Clay brought our vision to life with beautiful, performant code. His attention to detail and user experience sensibility made all the difference.',
        rating: 5,
    },
];

export const TestimonialsPage: React.FC = () => {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        message: '',
        rating: 5,
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder - would submit to backend for admin approval
        console.log('Testimonial submitted:', formData);
        setSubmitted(true);
        setFormData({ name: '', role: '', message: '', rating: 5 });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="section min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 pt-8">
                    <h1 className="section-title">{t('testimonials.title')}</h1>
                    <p className="section-subtitle">{t('testimonials.subtitle')}</p>
                </div>

                {/* Approved Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {approvedTestimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="flex flex-col">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-lg ${i < testimonial.rating
                                            ? 'text-yellow-400'
                                            : 'text-[var(--color-surface-light)]'
                                            }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-[var(--color-text)] italic mb-4 flex-1">
                                "{testimonial.content}"
                            </p>
                            <div className="border-t border-[var(--glass-border)] pt-4">
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    {testimonial.role}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Submit Testimonial Section */}
                <div className="max-w-2xl mx-auto">
                    {!showForm && !submitted && (
                        <div className="text-center">
                            <Button
                                variant="primary"
                                onClick={() => setShowForm(true)}
                            >
                                {t('testimonials.submit')}
                            </Button>
                        </div>
                    )}

                    {submitted && (
                        <Card hover={false} className="text-center">
                            <div className="text-4xl mb-4">✅</div>
                            <p className="text-lg text-[var(--color-text)]">
                                {t('testimonials.form.success')}
                            </p>
                            <Button
                                variant="secondary"
                                className="mt-4"
                                onClick={() => {
                                    setSubmitted(false);
                                    setShowForm(false);
                                }}
                            >
                                Close
                            </Button>
                        </Card>
                    )}

                    {showForm && !submitted && (
                        <Card hover={false}>
                            <h2 className="text-xl font-semibold mb-6 text-center">
                                {t('testimonials.submit')}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {t('testimonials.form.name')}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Clay Smith"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {t('testimonials.form.role')}
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="CEO, Example Corp"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {t('testimonials.form.rating')}
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                className={`text-2xl transition-colors ${star <= formData.rating
                                                    ? 'text-yellow-400'
                                                    : 'text-[var(--color-surface-light)]'
                                                    }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {t('testimonials.form.message')}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="form-input resize-none"
                                        placeholder="Share your experience..."
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" variant="primary" className="flex-1">
                                        {t('testimonials.form.submit')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
