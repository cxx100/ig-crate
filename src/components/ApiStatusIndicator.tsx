"use client";

import { Badge } from "@/components/ui/badge";
import { apiConfig } from "@/lib/api-config";
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, TestTube, Globe } from "lucide-react";

export function ApiStatusIndicator() {
  const { language } = useLanguage();

  const getStatusInfo = () => {
    switch (apiConfig.mode) {
      case 'rapidapi':
        return {
          icon: Zap,
          label: language === 'zh' ? '实时 API' : 'Live API',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-300'
        };
      case 'custom':
        return {
          icon: Globe,
          label: language === 'zh' ? '自定义 API' : 'Custom API',
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-300'
        };
      default:
        return {
          icon: TestTube,
          label: language === 'zh' ? '演示模式' : 'Demo Mode',
          variant: 'outline' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
    }
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  return (
    <Badge variant={status.variant} className={`text-xs ${status.className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {status.label}
    </Badge>
  );
}
