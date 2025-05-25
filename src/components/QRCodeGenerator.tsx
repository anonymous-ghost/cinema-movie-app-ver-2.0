import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: string;
  includeMargin?: boolean;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  level = 'L',
  includeMargin = true,
  imageSettings,
}) => {

  return (
    <div style={{ background: bgColor, padding: includeMargin ? '10px' : '0', display: 'inline-block', borderRadius: '8px' }}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level as 'L' | 'M' | 'Q' | 'H'}
        includeMargin={includeMargin}
        imageSettings={imageSettings}
      />
    </div>
  );
};

export default QRCodeGenerator;

// Helper function to get QR code as data URL
export const getQRCodeAsDataURL = (element: HTMLElement | null): string => {
  if (!element) return '';
  
  const canvas = element.querySelector('canvas');
  if (canvas) {
    return canvas.toDataURL('image/png');
  }
  return '';
};
