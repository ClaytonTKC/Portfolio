import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { contentService, type Testimonial } from '../services/content.service';

export const TestimonialsPage: React.FC = () => {
    const { t } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        message: '',
        rating: 5,
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await contentService.getApprovedTestimonials();
                setTestimonials(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch testimonials:', error);
                setTestimonials([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth; // Scroll one full screen width/item
            const maxScroll = container.scrollWidth - container.clientWidth;

            if (direction === 'left') {
                if (container.scrollLeft <= 5) { // Threshold for start
                    // Loop to end
                    container.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            } else {
                if (container.scrollLeft >= maxScroll - 5) { // Threshold for end
                    // Loop to start
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }
    };

    const displayTestimonials = testimonials;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await contentService.createTestimonial({
                authorName: formData.name,
                authorRole: formData.role,
                content: formData.message,
                rating: formData.rating,
                authorEmail: 'guest@example.com' // Optional: Add email field to form if needed
            });
            setSubmitted(true);
            setFormData({ name: '', role: '', message: '', rating: 5 });
        } catch (error) {
            console.error('Failed to submit testimonial:', error);
            alert('Failed to submit testimonial. Please try again.');
        }
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

                {/* Testimonials Carousel */}
                <div className="relative group mb-16">
                    {displayTestimonials.length > 1 && (
                        <>
                            {/* Navigation Buttons */}
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--color-text)] shadow-lg hover:bg-[var(--color-primary)] hover:text-white transition-all opacity-100"
                                aria-label="Previous testimonial"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--color-text)] shadow-lg hover:bg-[var(--color-primary)] hover:text-white transition-all opacity-100"
                                aria-label="Next testimonial"
                            >
                                →
                            </button>
                        </>
                    )}

                    {/* Carousel Container */}
                    {isLoading ? (
                        <Card className="text-center py-10" hover={false}>
                            <p className="text-[var(--color-text-muted)]">Loading testimonials...</p>
                        </Card>
                    ) : displayTestimonials.length === 0 ? (
                        <Card className="text-center py-10" hover={false}>
                            <p className="text-[var(--color-text-muted)]">{t('testimonials.empty')}</p>
                        </Card>
                    ) : (
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-6 pb-4 px-2"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {displayTestimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id || index}
                                    className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center flex"
                                >
                                    <Card className="flex flex-col w-full h-full">
                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-lg ${i < (testimonial.rating || 5)
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
                                            <p className="font-semibold">{testimonial.authorName || testimonial.name}</p>
                                            <p className="text-sm text-[var(--color-text-muted)]">
                                                {testimonial.authorRole}
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
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
                                        placeholder={t('placeholders.name')}
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
                                        placeholder={t('placeholders.role')}
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
                                        placeholder={t('placeholders.testimonial')}
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
                                        {t('common.cancel')}
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
