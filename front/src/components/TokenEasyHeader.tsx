import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Settings } from 'lucide-react';

export const TokenEasyHeader: React.FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TE</span>
              </div>
              <h1 className="text-xl font-bold">TokenEasy</h1>
            </div>
            <div className="hidden md:block text-sm text-muted-foreground">
              Real World Asset Tokenization Platform
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ready to Deploy</span>
            </div>

            {/* Wallet Connection Placeholder */}
            <Button variant="outline" size="sm" disabled>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
