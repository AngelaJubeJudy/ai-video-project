'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'app.title': 'AI Video Generator',
    'app.subtitle': 'Transform your images into stunning videos with AI',
    'nav.generator': 'Generator',
    'nav.history': 'History',
    'nav.language': 'Language',
    'upload.start.title': 'Start Image',
    'upload.start.description': 'Upload the main image for your video',
    'upload.reference.title': 'Reference Images',
    'upload.reference.description': 'Upload 1-4 reference images (optional)',
    'prompt.title': 'Prompt',
    'prompt.placeholder': 'Describe your video...',
    'negative.prompt.title': 'Negative Prompt',
    'negative.prompt.placeholder': 'What to avoid in the video...',
    'aspect.ratio.title': 'Aspect Ratio',
    'cfg.scale.title': 'CFG Scale',
    'cfg.scale.description': 'Higher values make the model follow your prompt more strictly',
    'generate.button': 'Generate Video',
    'generating': 'Generating...',
    'drag.drop': 'Drag & drop or click to upload',
    'supported.formats': 'Supported: JPG, PNG, WebP (Max 10MB)',
    'history.title': 'Generation History',
    'history.empty': 'No videos generated yet',
    'download': 'Download',
    'delete': 'Delete',
    'clear.all': 'Clear All',
    'error.upload': 'Error uploading file',
    'error.generation': 'Error generating video',
    'success.generation': 'Video generated successfully!',
    'api.key.required': 'API key is required',
    'api.key.placeholder': 'Enter your Replicate API key',
    'api.key.save': 'Save API Key',
    'settings': 'Settings'
  },
  zh: {
    'app.title': 'AI视频生成器',
    'app.subtitle': '用AI将图片转换为精美视频',
    'nav.generator': '生成器',
    'nav.history': '历史记录',
    'nav.language': '语言',
    'upload.start.title': '起始图片',
    'upload.start.description': '上传视频的主要图片',
    'upload.reference.title': '参考图片',
    'upload.reference.description': '上传1-4张参考图片（可选）',
    'prompt.title': '提示词',
    'prompt.placeholder': '描述您的视频...',
    'negative.prompt.title': '负面提示词',
    'negative.prompt.placeholder': '视频中要避免的内容...',
    'aspect.ratio.title': '纵横比',
    'cfg.scale.title': 'CFG缩放',
    'cfg.scale.description': '数值越高，模型越严格遵循您的提示词',
    'generate.button': '生成视频',
    'generating': '生成中...',
    'drag.drop': '拖拽或点击上传',
    'supported.formats': '支持：JPG、PNG、WebP（最大10MB）',
    'history.title': '生成历史',
    'history.empty': '还没有生成任何视频',
    'download': '下载',
    'delete': '删除',
    'clear.all': '清空全部',
    'error.upload': '文件上传错误',
    'error.generation': '视频生成错误',
    'success.generation': '视频生成成功！',
    'api.key.required': '需要API密钥',
    'api.key.placeholder': '输入您的Replicate API密钥',
    'api.key.save': '保存API密钥',
    'settings': '设置'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && translations[saved]) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}