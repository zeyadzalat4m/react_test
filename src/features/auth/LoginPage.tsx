import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useLogin, isAuthenticated } from '../../hooks/useAuth';

const loginSchema = z.object({
  username: z.string().min(1, 'usernameRequired'),
  password: z.string().min(1, 'passwordRequired'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'ziad',
      password: 'password',
    },
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('warehouseLogin')}
          </h2>
          <p className={`mt-2 text-center text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('signInDescription')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                {t('username')}
              </label>
              <input
                {...register('username')}
                id="username"
                type="text"
                autoComplete="username"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('username')}
              />
              {errors.username && (
                <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t(errors.username.message || '')}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('password')}
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('password')}
              />
              {errors.password && (
                <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t(errors.password.message || '')}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                t('login')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
