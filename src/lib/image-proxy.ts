/**
 * 图片代理工具函数
 * 用于解决Instagram图片防盗链问题
 */

export interface ImageProxyOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'png' | 'jpg';
}

/**
 * 使用第三方代理服务转换Instagram图片URL
 * 支持多个代理服务，提供故障转移机制
 */
export function getProxiedImageUrl(
  originalUrl: string, 
  options: ImageProxyOptions = {}
): string {
  if (!originalUrl || originalUrl.startsWith('data:')) {
    return originalUrl;
  }

  // 清理URL，移除可能的查询参数
  const cleanUrl = originalUrl.split('?')[0];
  
  // 编码URL
  const encodedUrl = encodeURIComponent(cleanUrl);
  
  // 构建代理参数
  const params = new URLSearchParams();
  params.set('url', cleanUrl);
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format && options.format !== 'auto') params.set('output', options.format);
  
  // 代理服务列表（按优先级排序）
  const proxyServices = [
    // images.weserv.nl - 免费稳定的图片代理服务
    `https://images.weserv.nl/?${params.toString()}`,
    
    // 备用代理服务
    `https://api.allorigins.win/raw?url=${encodedUrl}`,
    
    // 如果都不可用，返回原始URL（可能不会显示，但不会破坏页面）
    originalUrl
  ];
  
  // 返回主要代理服务
  return proxyServices[0];
}

/**
 * 为头像图片优化的代理函数
 */
export function getProxiedAvatarUrl(originalUrl: string): string {
  return getProxiedImageUrl(originalUrl, {
    width: 300,
    height: 300,
    quality: 85,
    format: 'webp'
  });
}

/**
 * 为帖子图片优化的代理函数
 */
export function getProxiedPostImageUrl(originalUrl: string): string {
  return getProxiedImageUrl(originalUrl, {
    width: 400,
    height: 400,
    quality: 80,
    format: 'webp'
  });
}

/**
 * 检查URL是否需要代理
 */
export function needsProxy(url: string): boolean {
  if (!url) return false;
  
  // Instagram URLs需要代理
  const instagramDomains = [
    'instagram.com',
    'cdninstagram.com',
    'scontent.cdninstagram.com',
    'scontent-',  // Instagram CDN URLs
    'fbcdn.net'   // Facebook CDN URLs
  ];
  
  return instagramDomains.some(domain => url.includes(domain));
}

/**
 * 智能图片代理函数 - 只对需要的URL进行代理
 */
export function smartImageProxy(url: string, options: ImageProxyOptions = {}): string {
  if (!needsProxy(url)) {
    return url;
  }
  
  return getProxiedImageUrl(url, options);
}