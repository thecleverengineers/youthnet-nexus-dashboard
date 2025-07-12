
import { useState, useEffect } from 'react';

export function useInstallation() {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkInstallation = () => {
      const installed = localStorage.getItem('app_installed');
      const apiSecret = localStorage.getItem('api_secret');
      
      // App is considered installed if both flags are present
      const installationStatus = installed === 'true' && apiSecret && apiSecret.length === 10;
      
      setIsInstalled(installationStatus);
      setIsLoading(false);
    };

    checkInstallation();
  }, []);

  const markAsInstalled = () => {
    setIsInstalled(true);
  };

  const resetInstallation = () => {
    localStorage.removeItem('app_installed');
    localStorage.removeItem('api_secret');
    localStorage.removeItem('installation_date');
    setIsInstalled(false);
  };

  return {
    isInstalled,
    isLoading,
    markAsInstalled,
    resetInstallation,
  };
}
