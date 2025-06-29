"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Key, Zap, Settings } from "lucide-react";
import { apiConfig } from "@/lib/api-config";
import { useLanguage } from "@/contexts/LanguageContext";

export function ApiConfigChecker() {
  const { language } = useLanguage();
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const isKeyConfigured = apiConfig.rapidApi?.key && apiConfig.rapidApi.key !== 'your_rapidapi_key_here';

  const testApiConnection = async () => {
    if (!isKeyConfigured) {
      setTestResult('error');
      setErrorMessage(language === 'zh' ? 'API 密钥未配置' : 'API key not configured');
      return;
    }

    setTestResult('testing');
    setErrorMessage("");

    try {
      // Test with a simple API call to a known account
      const response = await fetch(`https://${apiConfig.rapidApi?.host}/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': apiConfig.rapidApi?.key || '',
          'X-RapidAPI-Host': apiConfig.rapidApi?.host || ''
        },
        body: JSON.stringify({
          username: 'instagram' // Test with Instagram's official account
        })
      });

      if (response.ok) {
        setTestResult('success');
      } else {
        setTestResult('error');
        if (response.status === 401) {
          setErrorMessage(language === 'zh' ? 'API 密钥无效' : 'Invalid API key');
        } else if (response.status === 429) {
          setErrorMessage(language === 'zh' ? '请求频率超限' : 'Rate limit exceeded');
        } else {
          setErrorMessage(language === 'zh' ? `API 错误: ${response.status}` : `API Error: ${response.status}`);
        }
      }
    } catch (error) {
      setTestResult('error');
      setErrorMessage(language === 'zh' ? '网络连接失败' : 'Network connection failed');
    }
  };

  const getStatusDisplay = () => {
    if (!isKeyConfigured) {
      return {
        icon: AlertCircle,
        text: language === 'zh' ? 'API 密钥未配置' : 'API Key Not Configured',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300'
      };
    }

    switch (testResult) {
      case 'success':
        return {
          icon: CheckCircle,
          text: language === 'zh' ? 'API 连接成功' : 'API Connected Successfully',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-300'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: language === 'zh' ? 'API 连接失败' : 'API Connection Failed',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300'
        };
      case 'testing':
        return {
          icon: Settings,
          text: language === 'zh' ? '正在测试连接...' : 'Testing Connection...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-300'
        };
      default:
        return {
          icon: Key,
          text: language === 'zh' ? 'API 密钥已配置' : 'API Key Configured',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-300'
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <Card className={`mb-6 ${status.borderColor} ${status.bgColor}/30`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <StatusIcon className={`h-5 w-5 mr-2 ${status.color}`} />
          {language === 'zh' ? 'API 配置状态' : 'API Configuration Status'}
        </CardTitle>
        <CardDescription>
          {language === 'zh'
            ? '检查您的 RapidAPI 配置是否正确'
            : 'Check if your RapidAPI configuration is correct'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Display */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`${status.color} ${status.borderColor}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.text}
            </Badge>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <Zap className="h-3 w-3 mr-1" />
                {apiConfig.rapidApi?.host}
              </Badge>
            </div>
          </div>

          {/* Configuration Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">
                {language === 'zh' ? 'API 模式:' : 'API Mode:'}
              </span>
              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                {apiConfig.mode}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {language === 'zh' ? 'API 密钥:' : 'API Key:'}
              </span>
              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                {isKeyConfigured
                  ? `${apiConfig.rapidApi?.key?.substring(0, 10)}...`
                  : 'Not configured'
                }
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Configuration Instructions */}
          {!isKeyConfigured && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-blue-800 text-sm">
              <h4 className="font-semibold mb-2">
                {language === 'zh' ? '📝 配置步骤:' : '📝 Configuration Steps:'}
              </h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  {language === 'zh'
                    ? '访问 RapidAPI 网站获取您的 API 密钥'
                    : 'Visit RapidAPI website to get your API key'}
                </li>
                <li>
                  {language === 'zh'
                    ? '编辑项目根目录下的 .env.local 文件'
                    : 'Edit the .env.local file in the project root'}
                </li>
                <li>
                  {language === 'zh'
                    ? '将 "your_rapidapi_key_here" 替换为您的真实密钥'
                    : 'Replace "your_rapidapi_key_here" with your actual key'}
                </li>
                <li>
                  {language === 'zh'
                    ? '保存文件并重启开发服务器'
                    : 'Save the file and restart the development server'}
                </li>
              </ol>
            </div>
          )}

          {/* Test Connection Button */}
          {isKeyConfigured && (
            <Button
              onClick={testApiConnection}
              disabled={testResult === 'testing'}
              className="w-full"
              variant={testResult === 'success' ? 'outline' : 'default'}
            >
              {testResult === 'testing' && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              )}
              {language === 'zh'
                ? (testResult === 'testing' ? '测试中...' : '测试 API 连接')
                : (testResult === 'testing' ? 'Testing...' : 'Test API Connection')
              }
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
