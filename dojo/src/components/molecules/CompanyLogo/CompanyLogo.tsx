import React from 'react';
import { Text } from '../../atoms/Text/Text';
import { COMPANY_INFO } from '../../constants/navigation';

interface CompanyLogoProps {
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <Text variant="heading" className="text-[#001740]">
            {COMPANY_INFO.NAME}
          </Text>
          <Text variant="heading" className="text-[#001740] ml-3">
            {COMPANY_INFO.SUBTITLE}
          </Text>
        </div>
      </div>
    </div>
  );
};