import { CreateAdminUser } from '@/components/admin/CreateAdminUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSetup() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Admin Setup</h1>
          <p className="mt-2 text-muted-foreground">
            Initial system configuration and administrator account creation
          </p>
        </div>

        <CreateAdminUser />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
            <CardDescription>Please read before creating the admin account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • The admin account will have full system access and permissions
            </p>
            <p className="text-sm text-muted-foreground">
              • Make sure to use a strong password (minimum 8 characters)
            </p>
            <p className="text-sm text-muted-foreground">
              • The email address will be used for login and system notifications
            </p>
            <p className="text-sm text-muted-foreground">
              • You can create additional admin accounts after initial setup
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}