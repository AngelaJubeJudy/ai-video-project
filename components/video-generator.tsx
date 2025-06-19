'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { ImageUpload } from '@/components/image-upload';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Loader2, Play } from 'lucide-react';

export function VideoGenerator() {
  const { t } = useTranslation();
  const [startImage, setStartImage] = useState<File | null>(null);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [cfgScale, setCfgScale] = useState([0.5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const aspectRatios = [
    { value: '16:9', label: '16:9', description: 'Landscape' },
    { value: '9:16', label: '9:16', description: 'Portrait' },
    { value: '1:1', label: '1:1', description: 'Square' }
  ];

  const handleGenerate = async () => {
    if (!startImage) {
      toast.error('Please upload a start image');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    const apiKey = localStorage.getItem('replicate_api_key');
    if (!apiKey) {
      toast.error(t('api.key.required'));
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Convert images to base64 for API
      const startImageBase64 = await fileToBase64(startImage);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 2000);

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          startImage: startImageBase64,
          prompt,
          negativePrompt,
          aspectRatio,
          cfgScale: cfgScale[0],
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const result = await response.json();
      setProgress(100);

      // Save to history
      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        prompt,
        negativePrompt,
        aspectRatio,
        cfgScale: cfgScale[0],
        videoUrl: result.url,
        startImage: startImageBase64,
      };

      const history = JSON.parse(localStorage.getItem('video_history') || '[]');
      history.unshift(historyItem);
      localStorage.setItem('video_history', JSON.stringify(history));

      // Download video
      const a = document.createElement('a');
      a.href = result.url;
      a.download = `ai-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success(t('success.generation'));
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(t('error.generation'));
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">{t('app.title')}</h2>
        <p className="text-gray-400">{t('app.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Uploads */}
        <div className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>{t('upload.start.title')}</span>
                <span className="text-red-400">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                file={startImage}
                onFileChange={setStartImage}
                description={t('upload.start.description')}
              />
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>{t('upload.reference.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                files={referenceImages}
                onFilesChange={setReferenceImages}
                description={t('upload.reference.description')}
                multiple
                maxFiles={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>{t('prompt.title')} *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t('prompt.placeholder')}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>{t('negative.prompt.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t('negative.prompt.placeholder')}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>{t('aspect.ratio.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={aspectRatio} onValueChange={setAspectRatio}>
                <div className="grid grid-cols-3 gap-4">
                  {aspectRatios.map((ratio) => (
                    <div key={ratio.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={ratio.value} id={ratio.value} />
                      <Label htmlFor={ratio.value} className="cursor-pointer">
                        <div className="text-center">
                          <div className="font-medium">{ratio.label}</div>
                          <div className="text-xs text-gray-400">{ratio.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>{t('cfg.scale.title')}</CardTitle>
              <p className="text-sm text-gray-400">{t('cfg.scale.description')}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={cfgScale}
                  onValueChange={setCfgScale}
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-400">
                  Value: {cfgScale[0]}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generate Button */}
      <Card className="glass-effect">
        <CardContent className="p-6">
          {isGenerating && (
            <div className="mb-4 space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-gray-400">
                {t('generating')} {progress}%
              </p>
            </div>
          )}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !startImage || !prompt.trim()}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('generating')}
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                {t('generate.button')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}