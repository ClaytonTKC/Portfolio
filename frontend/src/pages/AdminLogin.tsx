import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth.service';

export const AdminLogin: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(formData);

            // Store token and user info
            localStorage.setItem('admin_token', response.token);
            localStorage.setItem('admin_user', JSON.stringify(response.admin));

            // Redirect to dashboard
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="section min-h-screen flex items-center justify-center gradient-bg">
            <div className="container mx-auto px-6">
                <div className="max-w-md mx-auto">
                    <div className="glass-card p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                <span className="text-3xl">🔐</span>
                            </div>
                            <h1 className="text-2xl font-bold">{t('admin.login')}</h1>
                            <p className="text-[var(--color-text-muted)] mt-2">
                                Sign in to manage your portfolio
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    {t('admin.email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="admin@example.com"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    {t('admin.password')}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : t('admin.signIn')}
                            </Button>
                        </form>
                    </div>

                    {/* Back to home */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm"
                        >
                            ← Back to Portfolio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
