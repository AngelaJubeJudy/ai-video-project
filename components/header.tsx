'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Video, History, Globe, Settings } from 'lucide-react';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  activeTab: 'generator' | 'history';
  onTabChange: (tab: 'generator' | 'history') => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [showApiDialog, setShowApiDialog] = useState(false);
  const currentLang = i18n.language.split('-')[0];

  const handleSetLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold gradient-text">{t('app.title')}</h1>
              <p className="text-sm text-gray-400 hidden sm:block">{t('app.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-2">
              <Button
                variant={activeTab === 'generator' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('generator')}
                className="flex items-center space-x-2"
              >
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.generator')}</span>
              </Button>
              <Button
                variant={activeTab === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('history')}
                className="flex items-center space-x-2"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.history')}</span>
              </Button>
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowApiDialog(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  API Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {/* 当前语言国旗，移动端/桌面端自适应 */}
                  <span className="text-xl">{LANGUAGES.find(l => l.code === currentLang)?.flag || '🌐'}</span>
                  <span className="ml-2 hidden sm:inline">{LANGUAGES.find(l => l.code === currentLang)?.name || 'Language'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleSetLanguage(lang.code)}
                    className={currentLang === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="ml-2 hidden sm:inline">{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ApiKeyDialog open={showApiDialog} onOpenChange={setShowApiDialog} />
    </header>
  );
}