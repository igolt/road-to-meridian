import React, { useState } from 'react';
import { UserTypeSelector } from './components/UserTypeSelector';
import { EmpresaDashboard } from './components/EmpresaDashboard';
import { InvestidorDashboard } from './components/InvestidorDashboard';
import { StellarUserType } from './types';
import './App.css';

type AppState = 'selection' | 'empresa' | 'investidor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('selection');
  const [selectedUserType, setSelectedUserType] = useState<StellarUserType | null>(null);

  const handleUserTypeSelect = (userType: StellarUserType) => {
    setSelectedUserType(userType);
    setCurrentState(userType.type);
  };

  const handleBackToSelection = () => {
    setCurrentState('selection');
    setSelectedUserType(null);
  };

  const renderCurrentView = () => {
    switch (currentState) {
      case 'empresa':
        return <EmpresaDashboard onBack={handleBackToSelection} />;
      case 'investidor':
        return <InvestidorDashboard onBack={handleBackToSelection} />;
      default:
        return <UserTypeSelector onSelect={handleUserTypeSelect} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;