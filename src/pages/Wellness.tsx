
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Search, ExternalLink, Video, FileText, Link as LinkIcon } from 'lucide-react';
import { wellnessService, WellnessContent } from '@/services/wellnessService';
import { toast } from 'sonner';

const Wellness = () => {
  const [content, setContent] = useState<WellnessContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<WellnessContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWellnessContent();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = content.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredContent(filtered);
    } else {
      setFilteredContent(content);
    }
  }, [searchQuery, content]);

  const fetchWellnessContent = async () => {
    try {
      const data = await wellnessService.getWellnessContent();
      setContent(data);
      setFilteredContent(data);
    } catch (error) {
      console.error('Error fetching wellness content:', error);
      toast.error('Error al cargar el contenido de bienestar');
    } finally {
      setIsLoading(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'link': return <LinkIcon className="h-5 w-5" />;
      case 'article': return <FileText className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video';
      case 'link': return 'Enlace';
      case 'article': return 'Artículo';
      default: return 'Contenido';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Cargando contenido de bienestar...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bienestar</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar contenido de bienestar..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContent.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'No se encontró contenido' : 'No hay contenido de bienestar disponible'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContent.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {getContentIcon(item.content_type)}
                      <span className="ml-1">{getContentTypeLabel(item.content_type)}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col space-y-4">
                  {item.content && (
                    <p className="text-sm text-gray-700 line-clamp-4">{item.content}</p>
                  )}
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    {item.url ? (
                      <Button 
                        onClick={() => window.open(item.url, '_blank')}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver contenido
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Sin enlace disponible
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wellness;
