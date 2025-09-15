import React, { useState } from 'react';
import { DeployPlan } from '@/core/types';
import { Step1StackStandard } from './wizard/Step1StackStandard';
import { Step2Basics } from './wizard/Step2Basics';
import { Step3Rules } from './wizard/Step3Rules';
import { Step4Preview } from './wizard/Step4Preview';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardProps {
  onComplete: (plan: DeployPlan) => void;
}

export const Wizard: React.FC<WizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deployPlan, setDeployPlan] = useState<Partial<DeployPlan>>({
    stack: 'EVM',
    standard: 'ERC-20',
    network: 'polygon-amoy'
  });

  const updatePlan = (updates: Partial<DeployPlan>) => {
    setDeployPlan(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (deployPlan.stack && deployPlan.standard && deployPlan.network && deployPlan.tokenConfig) {
      onComplete(deployPlan as DeployPlan);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1StackStandard
            plan={deployPlan}
            onUpdate={updatePlan}
          />
        );
      case 2:
        return (
          <Step2Basics
            plan={deployPlan}
            onUpdate={updatePlan}
          />
        );
      case 3:
        return (
          <Step3Rules
            plan={deployPlan}
            onUpdate={updatePlan}
          />
        );
      case 4:
        return (
          <Step4Preview
            plan={deployPlan as DeployPlan}
            onDeploy={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return deployPlan.stack && deployPlan.standard && deployPlan.network;
      case 2:
        return deployPlan.tokenConfig && 
               deployPlan.tokenConfig.name && 
               deployPlan.tokenConfig.propertyURI &&
               ((deployPlan.stack === 'EVM' && 'symbol' in deployPlan.tokenConfig && deployPlan.tokenConfig.symbol) ||
                (deployPlan.stack === 'Stellar' && 'assetCode' in deployPlan.tokenConfig && deployPlan.tokenConfig.assetCode));
      case 3:
        return true; // Rules are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {step}
              </div>
              {step < 4 && (
                <div className={`
                  w-16 h-0.5 mx-2
                  ${currentStep > step ? 'bg-primary' : 'bg-muted'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Stack & Standard</span>
          <span>Basics</span>
          <span>Rules</span>
          <span>Preview & Deploy</span>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            Deploy Token
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
