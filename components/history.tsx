'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/language-provider';
import { Download, Trash2, Play } from 'lucide-react';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  timestamp: string;
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  cfgScale: number;
  videoUrl: string;
  startImage: string;
}

export function History() {
  const { t } = useLanguage();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('video_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const downloadVideo = async (url: string, id: string) => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-video-${id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download video');
    }
  };

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('video_history', JSON.stringify(updatedHistory));
    toast.success('Item deleted');
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem('video_history');
    toast.success('History cleared');
  };

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('history.empty')}</h3>
          <p className="text-gray-500">Start generating videos to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">{t('history.title')}</h2>
        <Button variant="destructive" onClick={clearAll}>
          <Trash2 className="h-4 w-4 mr-2" />
          {t('clear.all')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {history.map((item) => (
          <Card key={item.id} className="glass-effect">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm line-clamp-2">{item.prompt}</CardTitle>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <img
                  src={item.startImage}
                  alt="Start image"
                  className="w-12 h-12 rounded object-cover ml-2"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Ratio: {item.aspectRatio}</span>
                  <span>CFG: {item.cfgScale}</span>
                </div>
                
                {item.negativePrompt && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Negative:</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{item.negativePrompt}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => downloadVideo(item.videoUrl, item.id)}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {t('download')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}