import { useState, useEffect } from 'react';

interface TouchIDStatusProps {
  isVisible: boolean;
}

export const TouchIDStatus: React.FC<TouchIDStatusProps> = ({ isVisible }) => {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowPulse(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowPulse(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
        {/* Touch ID Icon com animação */}
        <div className="relative mb-6">
          <div 
            className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
              showPulse ? 'animate-pulse' : ''
            }`}
          >
            <svg 
              className="w-10 h-10 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 1.61-.36 3.11-1.05 4.34-.67 1.21-1.14 1.77-2.01 2.64-.18.18-.43.18-.61 0-.87-.87-1.33-1.43-2.01-2.64C7.89 17.76 7.53 16.26 7.53 14.65c0-2.42 2.06-4.39 4.57-4.39s4.57 1.97 4.57 4.39c0 1.61-.36 3.11-1.05 4.34-.67 1.21-1.14 1.77-2.01 2.64-.09.1-.22.15-.35.15z"/>
            </svg>
          </div>
          
          {/* Pulsos animados */}
          {showPulse && (
            <>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-blue-400 animate-ping"></div>
              <div className="absolute inset-0 w-24 h-24 mx-auto -m-2 rounded-full border border-blue-300 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>

        {/* Texto */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Autenticação Touch ID
        </h3>
        <p className="text-gray-600 mb-4">
          Use o Touch ID para autenticar sua passkey
        </p>

        {/* Instruções específicas do macOS */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            💡 <strong>macOS:</strong> Coloque o dedo no sensor Touch ID ou use o Apple Watch
          </p>
        </div>

        {/* Indicator de status */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Aguardando autenticação...</span>
        </div>
      </div>
    </div>
  );
};
