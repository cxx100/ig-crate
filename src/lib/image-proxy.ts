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
  if (!originalUrl || originalUrl.startsWith('data:') || originalUrl.startsWith('blob:')) {
    return originalUrl;
  }

  // 添加调试日志
  if (typeof window !== 'undefined') {
    console.log('Original URL:', originalUrl);
  }

  // 清理URL，移除可能的查询参数
  const cleanUrl = originalUrl.split('?')[0];
  
  // 构建代理参数 - 使用最简单的方式
  const params = new URLSearchParams();
  params.set('url', cleanUrl);
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format && options.format !== 'auto') params.set('output', options.format);
  
  // 尝试多个代理服务
  const proxyServices = [
    // 简单的CORS代理
    `https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`,
    
    // 另一个CORS代理
    `https://cors-anywhere.herokuapp.com/${cleanUrl}`,
    
    // images.weserv.nl（可能被某些地区屏蔽）
    `https://images.weserv.nl/?${params.toString()}`,
    
    // 直接使用原始URL作为最后的备选
    originalUrl
  ];
  
  const proxiedUrl = proxyServices[0]; // 使用第一个代理服务
  
  // 添加调试日志
  if (typeof window !== 'undefined') {
    console.log('Proxied URL:', proxiedUrl);
  }
  
  return proxiedUrl;
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

/**
 * 创建带有故障转移的图片元素
 */
export function createFallbackImageSrc(originalUrl: string, options: ImageProxyOptions = {}): string[] {
  if (!originalUrl || !needsProxy(originalUrl)) {
    return [originalUrl];
  }

  const cleanUrl = originalUrl.split('?')[0];
  const encodedUrl = encodeURIComponent(cleanUrl);
  
  const params = new URLSearchParams();
  params.set('url', cleanUrl);
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());

  return [
    // 第一选择：allorigins
    `https://api.allorigins.win/raw?url=${encodedUrl}`,
    
    // 第二选择：images.weserv.nl
    `https://images.weserv.nl/?${params.toString()}`,
    
    // 第三选择：尝试直接访问（可能失败）
    originalUrl,
    
    // 第四选择：通过cors-anywhere（需要用户主动启用）
    `https://cors-anywhere.herokuapp.com/${cleanUrl}`
  ];
}