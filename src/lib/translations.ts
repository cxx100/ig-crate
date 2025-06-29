export type Language = 'en' | 'zh';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    about: string;
    github: string;
    language: string;
    login: string;
    register: string;
    logout: string;
    profile: string;
  };

  // Header
  header: {
    title: string;
    subtitle: string;
  };

  // Privacy notice
  privacy: {
    title: string;
    content: string;
  };

  // Search section
  search: {
    title: string;
    description: string;
    placeholder: string;
    button: string;
    searching: string;
    errors: {
      invalidUsername: string;
      fetchError: string;
      apiNotConfigured: string;
      userNotFound: string;
      rateLimit: string;
      unauthorized: string;
      forbidden: string;
      serverError: string;
      networkError: string;
    };
  };

  // Profile display
  profile: {
    verified: string;
    private: string;
    stats: {
      posts: string;
      followers: string;
      following: string;
    };
    recentPosts: string;
    privateAccount: string;
    privateAccountDesc: string;
  };

  // Footer
  footer: {
    disclaimer: string;
  };

  // Languages
  languages: {
    english: string;
    chinese: string;
  };

  // Authentication
  auth: {
    // Common
    email: string;
    password: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    forgotPassword: string;

    // Login
    login: {
      title: string;
      description: string;
    };
    loginButton: string;
    loggingIn: string;
    loginLink: string;

    // Register
    register: {
      title: string;
      description: string;
    };
    registerButton: string;
    registering: string;
    registerLink: string;
    registerSuccess: string;

    // Forgot Password
    forgotPasswordDescription: string;
    sendResetEmail: string;
    sendingResetEmail: string;
    passwordResetSuccess: string;
    backToLogin: string;

    // Account related
    noAccount: string;
    haveAccount: string;

    // Profile
    welcomeBack: string;
    myProfile: string;
    savedProfiles: string;
    accountSettings: string;

    // Errors
    errors: {
      allFieldsRequired: string;
      emailRequired: string;
      passwordsMismatch: string;
      passwordTooShort: string;
      loginFailed: string;
      registerFailed: string;
      passwordResetFailed: string;
    }
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      github: 'GitHub',
      language: 'Language',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'My Profile',
    },
    header: {
      title: 'Instagram Profile Viewer',
      subtitle: 'View public Instagram profile information anonymously',
    },
    privacy: {
      title: 'Privacy Notice:',
      content: 'This tool only displays publicly available Instagram profile information. We don\'t store any personal data and cannot access private account content.',
    },
    search: {
      title: 'Search Profile',
      description: 'Enter an Instagram username (e.g. @username) or full profile link',
      placeholder: '@username or https://instagram.com/username',
      button: 'View Profile',
      searching: 'Searching...',
      errors: {
        invalidUsername: 'Please enter a valid Instagram username or profile link',
        fetchError: 'Unable to fetch profile. Please check the username and try again.',
        apiNotConfigured: 'API not configured. Please configure your RapidAPI key.',
        userNotFound: 'User not found. The username may not exist or the account is private.',
        rateLimit: 'Rate limit exceeded. Please try again later or upgrade your API plan.',
        unauthorized: 'API authentication failed. Please check your RapidAPI key.',
        forbidden: 'Access forbidden. Your API plan may not include this feature.',
        serverError: 'Server error. The API service is experiencing issues.',
        networkError: 'Network error. Please check your internet connection.',
      },
    },
    profile: {
      verified: 'Verified',
      private: 'Private',
      stats: {
        posts: 'Posts',
        followers: 'Followers',
        following: 'Following',
      },
      recentPosts: 'Recent Posts',
      privateAccount: 'Private Account',
      privateAccountDesc: 'This account\'s posts are only visible to followers',
    },
    footer: {
      disclaimer: 'This tool is for viewing public information only and complies with Instagram\'s Terms of Service and Privacy Policy',
    },
    languages: {
      english: 'English',
      chinese: '中文',
    },
    auth: {
      // Common
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      forgotPassword: 'Forgot password?',

      // Login
      login: {
        title: 'Login',
        description: 'Enter your email and password to access your account',
      },
      loginButton: 'Login',
      loggingIn: 'Logging in...',
      loginLink: 'Login now',

      // Register
      register: {
        title: 'Create an Account',
        description: 'Register to save your favorite profiles and access premium features',
      },
      registerButton: 'Register',
      registering: 'Registering...',
      registerLink: 'Register now',
      registerSuccess: 'Registration successful! Check your email to confirm your account.',

      // Forgot Password
      forgotPasswordDescription: 'Enter your email to receive password reset instructions',
      sendResetEmail: 'Send Reset Email',
      sendingResetEmail: 'Sending reset email...',
      passwordResetSuccess: 'Password reset instructions have been sent to your email.',
      backToLogin: 'Back to Login',

      // Account related
      noAccount: 'Don\'t have an account?',
      haveAccount: 'Already have an account?',

      // Profile
      welcomeBack: 'Welcome back',
      myProfile: 'My Profile',
      savedProfiles: 'Saved Profiles',
      accountSettings: 'Account Settings',

      // Errors
      errors: {
        allFieldsRequired: 'All fields are required',
        emailRequired: 'Email is required',
        passwordsMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 6 characters',
        loginFailed: 'Login failed. Please check your email and password.',
        registerFailed: 'Registration failed. Please try again.',
        passwordResetFailed: 'Failed to send reset email. Please try again.',
      }
    }
  },
  zh: {
    nav: {
      home: '首页',
      about: '关于',
      github: 'GitHub',
      language: '语言',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      profile: '我的资料',
    },
    header: {
      title: 'Instagram 资料查看器',
      subtitle: '匿名查看公开的 Instagram 用户资料信息',
    },
    privacy: {
      title: '隐私保护提示：',
      content: '此工具仅显示公开可见的 Instagram 资料信息。我们不会存储任何个人数据，也无法查看私密账号的内容。',
    },
    search: {
      title: '搜索用户资料',
      description: '输入 Instagram 用户名（如 @username）或完整个人主页链接',
      placeholder: '@username 或 https://instagram.com/username',
      button: '查看资料',
      searching: '查询中...',
      errors: {
        invalidUsername: '请输入有效的 Instagram 用户名或链接',
        fetchError: '无法获取用户资料，请检查用户名是否正确',
        apiNotConfigured: 'API 未配置。请配置您的 RapidAPI 密钥。',
        userNotFound: '用户不存在。用户名可能不存在或账户为私密状态。',
        rateLimit: '请求频率超限。请稍后再试或升级您的 API 套餐。',
        unauthorized: 'API 认证失败。请检查您的 RapidAPI 密钥。',
        forbidden: '访问被禁止。您的 API 套餐可能不包含此功能。',
        serverError: '服务器错误。API 服务正在经历问题。',
        networkError: '网络错误。请检查您的网络连接。',
      },
    },
    profile: {
      verified: '已验证',
      private: '私密账号',
      stats: {
        posts: '帖子',
        followers: '粉丝',
        following: '关注',
      },
      recentPosts: '最近帖子',
      privateAccount: '私密账号',
      privateAccountDesc: '此账号的帖子仅对关注者可见',
    },
    footer: {
      disclaimer: '此工具仅用于查看公开信息，遵守 Instagram 服务条款和隐私政策',
    },
    languages: {
      english: 'English',
      chinese: '中文',
    },
    auth: {
      // Common
      email: '邮箱',
      password: '密码',
      emailPlaceholder: '请输入您的邮箱',
      passwordPlaceholder: '请输入您的密码',
      confirmPassword: '确认密码',
      confirmPasswordPlaceholder: '请再次输入密码',
      forgotPassword: '忘记密码？',

      // Login
      login: {
        title: '登录',
        description: '输入您的邮箱和密码以访问您的账户',
      },
      loginButton: '登录',
      loggingIn: '登录中...',
      loginLink: '立即登录',

      // Register
      register: {
        title: '创建账户',
        description: '注册以保存您喜爱的资料并使用高级功能',
      },
      registerButton: '注册',
      registering: '注册中...',
      registerLink: '立即注册',
      registerSuccess: '注册成功！请检查您的邮箱以确认账户。',

      // Forgot Password
      forgotPasswordDescription: '输入您的邮箱以接收密码重置说明',
      sendResetEmail: '发送重置邮件',
      sendingResetEmail: '正在发送重置邮件...',
      passwordResetSuccess: '密码重置说明已发送到您的邮箱。',
      backToLogin: '返回登录',

      // Account related
      noAccount: '还没有账户？',
      haveAccount: '已有账户？',

      // Profile
      welcomeBack: '欢迎回来',
      myProfile: '我的资料',
      savedProfiles: '已保存的资料',
      accountSettings: '账户设置',

      // Errors
      errors: {
        allFieldsRequired: '请填写所有字段',
        emailRequired: '请输入邮箱',
        passwordsMismatch: '两次输入的密码不匹配',
        passwordTooShort: '密码必须至少包含6个字符',
        loginFailed: '登录失败。请检查您的邮箱和密码。',
        registerFailed: '注册失败。请重试。',
        passwordResetFailed: '无法发送重置邮件。请重试。',
      }
    }
  },
};

export const getTranslation = (language: Language): Translations => {
  return translations[language];
};
