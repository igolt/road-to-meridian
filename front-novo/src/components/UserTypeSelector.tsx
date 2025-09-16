import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import type { StellarUserType } from '../types';

interface UserTypeSelectorProps {
  onSelect: (userType: StellarUserType) => void;
}

const userTypes: StellarUserType[] = [
  {
    type: 'empresa',
    name: 'Empresa',
    description: 'Crie e gerencie tokens de imóveis para tokenização de ativos imobiliários',
    icon: '🏢'
  },
  {
    type: 'investidor',
    name: 'Investidor',
    description: 'Investe em tokens de imóveis e gerencie seu portfólio de ativos tokenizados',
    icon: '💰'
  }
];

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Stellar Real Estate
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha como você deseja usar nossa plataforma de tokenização de imóveis na rede Stellar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {userTypes.map((userType) => (
            <Card 
              key={userType.type}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500"
              onClick={() => onSelect(userType)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {userType.icon}
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  {userType.name}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {userType.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(userType);
                  }}
                >
                  Selecionar {userType.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Powered by Stellar Network</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
