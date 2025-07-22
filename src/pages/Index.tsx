
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { DashboardRouter } from '@/components/dashboard/DashboardRouter';

const Index = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardRouter />
      </Layout>
    </ProtectedRoute>
  );
};

export { Index };
export default Index;
