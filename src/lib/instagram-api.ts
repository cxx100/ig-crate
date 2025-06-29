import { apiConfig, type ApiMode } from './api-config';

// API Response Types
interface RapidApiProfileResponse {
  result?: RapidApiProfile;
  data?: RapidApiProfile;
  user?: RapidApiProfile;
  username?: string;
  full_name?: string;
  biography?: string;
  profile_pic_url?: string;
  profile_pic_url_hd?: string;
  profile_pic_url_wrapped?: string;
  profile_pic_url_hd_wrapped?: string;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
  is_verified?: boolean;
  is_private?: boolean;
  external_url?: string;
  business_address?: string;
  is_business_account?: boolean;
  is_professional_account?: boolean;
  account_type?: string;
  edge_owner_to_timeline_media?: {
    count?: number;
    edges?: RapidApiPostEdge[];
  };
  edge_followed_by?: {
    count: number;
  };
  edge_follow?: {
    count: number;
  };
}

interface RapidApiProfile {
  id?: string;
  username?: string;
  pk?: string;
  name?: string;
  full_name?: string;
  biography?: string;
  bio?: string;
  profile_pic_url?: string;
  profile_pic_url_hd?: string;
  profile_pic_url_wrapped?: string;
  profile_pic_url_hd_wrapped?: string;
  profile_picture?: string;
  hd_profile_pic_url_info?: {
    url: string;
  };
  follower_count?: number;
  followers?: number;
  following_count?: number;
  following?: number;
  media_count?: number;
  posts?: number;
  is_verified?: boolean;
  is_private?: boolean;
  external_url?: string;
  website?: string;
  business_address?: string;
  location?: string;
  is_business_account?: boolean;
  is_professional_account?: boolean;
  account_type?: string;
  edge_owner_to_timeline_media?: {
    count?: number;
    edges?: RapidApiPostEdge[];
  };
  edge_followed_by?: {
    count: number;
  };
  edge_follow?: {
    count: number;
  };
}

interface RapidApiPostsResponse {
  data?: RapidApiPostData[];
  posts?: RapidApiPostData[];
}

interface RapidApiPostEdge {
  node: RapidApiPostData;
}

interface RapidApiPostData {
  id?: string;
  pk?: string;
  shortcode?: string;
  display_url?: string;
  image_versions2?: {
    candidates?: Array<{ url: string }>;
  };
  thumbnail_url?: string;
  media_url?: string;
  caption?: string | { text: string };
  edge_media_to_caption?: {
    edges: Array<{
      node: { text: string };
    }>;
  };
  like_count?: number;
  likes?: number;
  comment_count?: number;
  comments?: number;
  node?: RapidApiPostData;
}

interface CustomApiResponse {
  username: string;
  full_name: string;
  bio: string;
  profile_picture_url: string;
  followers: string;
  following: string;
  posts_count: string;
  is_verified: boolean;
  is_private: boolean;
  recent_posts: Array<{
    image_url: string;
    link: string;
    id: string;
    caption?: string;
    likes_count?: string;
    comments_count?: string;
  }>;
  website?: string;
  location?: string;
  account_type?: 'personal' | 'business' | 'creator';
}

interface ErrorWithMessage {
  message?: string;
}

export interface InstagramProfile {
  username: string;
  full_name: string;
  bio: string;
  profile_picture_url: string;
  followers: string;
  following: string;
  posts_count: string;
  is_verified: boolean;
  is_private: boolean;
  recent_posts: Array<{
    image_url: string;
    link: string;
    id: string;
    caption?: string;
    likes_count?: string;
    comments_count?: string;
  }>;
  website?: string;
  location?: string;
  account_type?: 'personal' | 'business' | 'creator';
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

class InstagramApiService {
  private readonly apiConfig = apiConfig;

  async getProfile(username: string, language: 'en' | 'zh' = 'en'): Promise<InstagramProfile> {
    try {
      switch (this.apiConfig.mode) {
        case 'rapidapi':
          return await this.fetchFromRapidApi(username);
        case 'custom':
          return await this.fetchFromCustomApi(username);
        default:
          return await this.fetchFromMockApi(username, language);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async fetchFromRapidApi(username: string): Promise<InstagramProfile> {
    if (!this.apiConfig.rapidApi?.key) {
      throw new Error('RapidAPI key not configured');
    }

    // Extract username from Instagram URL if provided
    let cleanUsername = username.trim();

    // If it's a URL, extract the username
    if (cleanUsername.includes('instagram.com/')) {
      const match = cleanUsername.match(/instagram\.com\/([^\/\?]+)/);
      cleanUsername = match ? match[1] : '';
      if (!cleanUsername) {
        throw new Error('Invalid Instagram URL');
      }
    }

    // Remove @ if present
    cleanUsername = cleanUsername.replace(/^@/, '');

    try {
      console.log(`Fetching profile for username: ${cleanUsername}`);
      console.log(`API Host: ${this.apiConfig.rapidApi.host}`);

      // Always use the profile endpoint
      const endpoint = `https://${this.apiConfig.rapidApi.host}/api/instagram/profile`;
      const requestBody = { username: cleanUsername };

      console.log(`Endpoint: ${endpoint}`);
      console.log("Request body:", requestBody);

      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.apiConfig.rapidApi.key,
          'X-RapidAPI-Host': this.apiConfig.rapidApi.host
        },
        body: JSON.stringify(requestBody)
      };

      const response = await fetch(endpoint, options);
      const responseText = await response.text();

      console.log(`Response status: ${response.status}`);
      console.log(`Response preview: ${responseText.substring(0, 200)}...`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User not found: ${cleanUsername}`);
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }
        throw new Error(`API request failed: ${response.status} - ${responseText.substring(0, 100)}`);
      }

      let profileData: RapidApiProfileResponse;
      try {
        profileData = JSON.parse(responseText);
        console.log('Successfully parsed profile data');
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid API response format');
      }

      // Instagram120 API doesn't have a separate posts endpoint,
      // posts data should be included in the profile response
      return this.transformRapidApiResponse(profileData, null);
    } catch (error: unknown) {
      console.error('RapidAPI Error:', error);
      throw error;
    }
  }

  private async fetchFromCustomApi(username: string): Promise<InstagramProfile> {
    if (!this.apiConfig.customApi?.baseUrl) {
      throw new Error('Custom API URL not configured');
    }

    const url = new URL(`${this.apiConfig.customApi.baseUrl}/profile/${username}`);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.apiConfig.customApi.apiKey) {
      headers.Authorization = `Bearer ${this.apiConfig.customApi.apiKey}`;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: CustomApiResponse = await response.json();
    return this.transformCustomApiResponse(data);
  }

  private async fetchFromMockApi(username: string, language: 'en' | 'zh'): Promise<InstagramProfile> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Simulate some API failures
    if (Math.random() < 0.1) {
      throw new Error('User not found');
    }

    return this.generateRealisticMockData(username, language);
  }

  private generateRealisticMockData(username: string, language: 'en' | 'zh'): InstagramProfile {
    const profiles = language === 'zh' ? this.getChineseProfiles() : this.getEnglishProfiles();
    const selectedProfile = profiles[Math.floor(Math.random() * profiles.length)];

    // Generate realistic follower counts
    const followerVariations = ['1.2K', '5.8K', '12.3K', '45.7K', '123K', '567K', '1.2M', '3.4M'];
    const followingVariations = ['234', '567', '891', '1.2K', '2.3K', '4.5K'];
    const postVariations = ['23', '67', '145', '234', '456', '789', '1.2K'];

    return {
      username: `@${username}`,
      full_name: selectedProfile.full_name,
      bio: selectedProfile.bio,
      profile_picture_url: selectedProfile.profile_picture_url,
      followers: followerVariations[Math.floor(Math.random() * followerVariations.length)],
      following: followingVariations[Math.floor(Math.random() * followingVariations.length)],
      posts_count: postVariations[Math.floor(Math.random() * postVariations.length)],
      is_verified: Math.random() > 0.7,
      is_private: Math.random() > 0.85,
      website: selectedProfile.website,
      location: selectedProfile.location,
      account_type: selectedProfile.account_type,
      recent_posts: this.generateRecentPosts(12)
    };
  }

  private getEnglishProfiles() {
    return [
      {
        full_name: "Alex Johnson",
        bio: "Digital creator 📱 | Travel photographer 🌍 | Coffee enthusiast ☕ | Living life one adventure at a time ✈️",
        profile_picture_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        website: "alexjohnson.com",
        location: "New York, NY",
        account_type: 'creator' as const
      },
      {
        full_name: "Sarah Chen",
        bio: "Fashion designer ✨ | Sustainable living advocate 🌱 | NYC based 🗽 | Creating a better tomorrow 💚",
        profile_picture_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        website: "sarahchen.design",
        location: "New York, NY",
        account_type: 'business' as const
      },
      {
        full_name: "Mike Rodriguez",
        bio: "Fitness coach 💪 | Nutrition expert 🥗 | Helping you reach your goals 🎯 | Train hard, stay humble 🙏",
        profile_picture_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        website: "mikefit.com",
        location: "Los Angeles, CA",
        account_type: 'creator' as const
      },
      {
        full_name: "Emma Thompson",
        bio: "Food blogger 🍽️ | Recipe creator 👩‍🍳 | Cookbook author 📚 | Sharing delicious moments daily ❤️",
        profile_picture_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        website: "emmacooks.blog",
        location: "San Francisco, CA",
        account_type: 'creator' as const
      }
    ];
  }

  private getChineseProfiles() {
    return [
      {
        full_name: "李小明",
        bio: "数码创作者 📱 | 旅行摄影师 📸 | 咖啡爱好者 ☕ | 用镜头记录美好生活 ✨",
        profile_picture_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        website: "lixiaoming.cn",
        location: "北京市",
        account_type: 'creator' as const
      },
      {
        full_name: "王小美",
        bio: "时尚设计师 ✨ | 可持续生活倡导者 🌱 | 上海时尚周常客 👗 | 创造美好明天 💚",
        profile_picture_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        website: "wangxiaomei.design",
        location: "上海市",
        account_type: 'business' as const
      },
      {
        full_name: "张健身",
        bio: "健身教练 💪 | 营养专家 🥗 | 帮你实现健身目标 🎯 | 努力训练，保持谦逊 🙏",
        profile_picture_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        website: "zhangjianshen.com",
        location: "深圳市",
        account_type: 'creator' as const
      },
      {
        full_name: "陈美食",
        bio: "美食博主 🍽️ | 食谱创作者 👩‍🍳 | 美食书作者 📚 | 每日分享美味时光 ❤️",
        profile_picture_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        website: "chenmeishi.blog",
        location: "广州市",
        account_type: 'creator' as const
      }
    ];
  }

  private generateRecentPosts(count: number) {
    const postTypes = [
      'photo-1506905925346-21bda4d32df4', // landscape
      'photo-1493770348161-369560ae357d', // food
      'photo-1511367461989-f85a21fda167', // profile
      'photo-1469334031218-e382a71b716b', // architecture
      'photo-1506794778202-cad84cf45f1d', // portrait
      'photo-1454372182658-c712e4c5a1db', // nature
      'photo-1498050108023-c5249f4df085', // technology
      'photo-1517849845537-4d257902454a', // pets
    ];

    return Array.from({ length: count }, (_, i) => {
      const photoId = postTypes[Math.floor(Math.random() * postTypes.length)];
      const randomId = Math.floor(Math.random() * 1000000);

      return {
        id: `post_${i}_${randomId}`,
        image_url: `https://images.unsplash.com/${photoId}?w=300&h=300&fit=crop&random=${randomId}`,
        link: `https://instagram.com/p/mock_${i}_${randomId}`,
        likes_count: this.generateRandomCount(),
        comments_count: this.generateRandomCount(true)
      };
    });
  }

  private generateRandomCount(isComments = false): string {
    const max = isComments ? 500 : 5000;
    const count = Math.floor(Math.random() * max) + 1;

    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  // Helper method to handle wrapped URLs
  private processWrappedUrl(url: string | undefined): string {
    if (!url) return '';

    // If it's a wrapped URL (starts with /api/instagram/get), extract the actual URL from uri parameter
    if (url.startsWith('/api/instagram/get')) {
      try {
        // Extract the uri parameter from the URL
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const encodedUri = urlParams.get('uri');

        if (encodedUri) {
          // Decode the URI parameter to get the actual Instagram URL
          return decodeURIComponent(encodedUri);
        }
      } catch (error) {
        console.error('Error parsing wrapped URL:', error);
      }
    }

    return url;
  }

  private transformRapidApiResponse(profileData: RapidApiProfileResponse, postsData?: RapidApiPostsResponse | null): InstagramProfile {
    // Handle different possible response structures from RapidAPI
    const profileData_ = profileData.result || profileData.data || profileData.user || profileData;

    // Cast to RapidApiProfile to access all properties
    const profile = profileData_ as RapidApiProfile & RapidApiProfileResponse;

    // Extract posts from either the profile response or separate posts response
    const posts = postsData?.data || postsData?.posts || profile.edge_owner_to_timeline_media?.edges || [];

    // Handle different field names for follower/following/post counts
    const followerCount = profile.edge_followed_by?.count || profile.follower_count || profile.followers || 0;
    const followingCount = profile.edge_follow?.count || profile.following_count || profile.following || 0;
    const postsCount = profile.edge_owner_to_timeline_media?.count || profile.media_count || profile.posts || posts.length || 0;

    // Handle wrapped profile picture URLs
    const profilePicUrl = this.processWrappedUrl(profile.profile_pic_url_hd_wrapped) ||
                          this.processWrappedUrl(profile.profile_pic_url_wrapped) ||
                          profile.profile_pic_url_hd ||
                          profile.profile_pic_url ||
                          profile.profile_picture ||
                          profile.hd_profile_pic_url_info?.url ||
                          '';

    return {
      username: `@${profile.username || profile.pk || ''}`,
      full_name: profile.full_name || profile.name || profile.username || '',
      bio: profile.biography || profile.bio || '',
      profile_picture_url: profilePicUrl,
      followers: this.formatCount(followerCount),
      following: this.formatCount(followingCount),
      posts_count: this.formatCount(postsCount),
      is_verified: profile.is_verified || false,
      is_private: profile.is_private || false,
      website: profile.external_url || profile.website || '',
      location: profile.business_address || profile.location || '',
      account_type: this.getAccountType(profile),
      recent_posts: this.transformPosts(posts)
    };
  }

  private getAccountType(profile: RapidApiProfile): 'personal' | 'business' | 'creator' {
    if (profile.is_business_account || profile.account_type === 'business') return 'business';
    if (profile.is_professional_account || profile.account_type === 'creator') return 'creator';
    return 'personal';
  }

  private transformPosts(posts: RapidApiPostData[] | RapidApiPostEdge[]): InstagramProfile['recent_posts'] {
    if (!Array.isArray(posts)) return [];

    return posts.slice(0, 12).map((post: RapidApiPostData | RapidApiPostEdge, index: number) => {
      // Handle different post structures
      const postNode = 'node' in post ? post.node : post;

      if (!postNode) {
        return {
          id: `post_${index}`,
          image_url: '',
          link: '',
          caption: '',
          likes_count: '0',
          comments_count: '0'
        };
      }

      const mediaId = postNode.id || postNode.pk || `post_${index}`;

      return {
        id: mediaId,
        image_url: this.getPostImageUrl(postNode),
        link: `https://instagram.com/p/${postNode.shortcode || mediaId}`,
        caption: this.getPostCaption(postNode),
        likes_count: this.formatCount(postNode.like_count || postNode.likes || 0),
        comments_count: this.formatCount(postNode.comment_count || postNode.comments || 0)
      };
    });
  }

  private getPostImageUrl(post: RapidApiPostData): string {
    // Try different possible image URL fields
    return post.display_url ||
           post.image_versions2?.candidates?.[0]?.url ||
           post.thumbnail_url ||
           post.media_url ||
           `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 600000000000) + 500000000000}?w=300&h=300&fit=crop`;
  }

  private getPostCaption(post: RapidApiPostData): string {
    if (post.caption) {
      return typeof post.caption === 'string' ? post.caption : post.caption.text;
    }
    if (post.edge_media_to_caption?.edges?.[0]?.node?.text) {
      return post.edge_media_to_caption.edges[0].node.text;
    }
    return '';
  }

  private transformCustomApiResponse(data: CustomApiResponse): InstagramProfile {
    // Transform custom API response to our format
    return data;
  }

  private formatCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  private handleError(error: unknown): ApiError {
    const errorMessage = this.isErrorWithMessage(error) ? error.message?.toLowerCase() || '' : '';

    // RapidAPI specific errors
    if (errorMessage.includes('not configured')) {
      return {
        code: 'API_NOT_CONFIGURED',
        message: 'API not configured',
        details: 'Please configure your RapidAPI key in the environment variables.'
      };
    }

    if (errorMessage.includes('user not found') || errorMessage.includes('404') || errorMessage.includes('unable to fetch instagram profile')) {
      return {
        code: 'USER_NOT_FOUND',
        message: 'Unable to fetch Instagram profile',
        details: 'This could be because: 1) The username does not exist, 2) The account is private, or 3) The API endpoint has changed. Please verify the username and try again.'
      };
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return {
        code: 'RATE_LIMIT',
        message: 'Rate limit exceeded',
        details: 'Too many requests. Please try again later or check your API plan limits.'
      };
    }

    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      return {
        code: 'UNAUTHORIZED',
        message: 'API authentication failed',
        details: 'Invalid RapidAPI key or insufficient permissions. Please check your API configuration.'
      };
    }

    if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
      return {
        code: 'FORBIDDEN',
        message: 'Access forbidden',
        details: 'Your API plan may not include access to this endpoint or user data.'
      };
    }

    if (errorMessage.includes('500') || errorMessage.includes('server error')) {
      return {
        code: 'SERVER_ERROR',
        message: 'Server error',
        details: 'The Instagram API service is experiencing issues. Please try again later.'
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error',
        details: 'Unable to connect to the API service. Please check your internet connection.'
      };
    }

    // Generic API errors
    if (errorMessage.includes('api')) {
      return {
        code: 'API_ERROR',
        message: 'API service error',
        details: 'The Instagram API service encountered an error. Please try again.'
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      details: this.isErrorWithMessage(error) ? error.message || 'Please try again later.' : 'Please try again later.'
    };
  }

  private isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  }
}

export const instagramApi = new InstagramApiService();
