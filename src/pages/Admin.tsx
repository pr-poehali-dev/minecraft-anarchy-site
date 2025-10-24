import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'skzry' && password === 'R.ofical.1') {
      setIsAuthenticated(true);
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать в админ-панель!',
      });
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверные учетные данные',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Icon name="Shield" size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Админ-панель</h1>
            <p className="text-muted-foreground">
              Войдите для управления сервером
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите логин"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>

          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться на главную
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={24} className="text-primary" />
            <span className="text-xl font-bold">Админ-панель</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Администратор: {username}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsAuthenticated(false);
                setUsername('');
                setPassword('');
              }}
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <div className="container px-4 py-8 mx-auto">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">
              <Icon name="FileText" size={16} className="mr-2" />
              Контент
            </TabsTrigger>
            <TabsTrigger value="privileges">
              <Icon name="Crown" size={16} className="mr-2" />
              Привилегии
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Icon name="ShoppingCart" size={16} className="mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="admins">
              <Icon name="Users" size={16} className="mr-2" />
              Администраторы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Редактирование контента</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Заголовок главной страницы</Label>
                  <Input
                    id="hero-title"
                    defaultValue="ANARCHIST EMPIRE"
                    placeholder="Введите заголовок"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Подзаголовок</Label>
                  <Input
                    id="hero-subtitle"
                    defaultValue="24/7 Minecraft Anarchy Server"
                    placeholder="Введите подзаголовок"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-description">Описание</Label>
                  <Input
                    id="hero-description"
                    defaultValue="Настоящая анархия без правил. Выживай, строй, сражайся!"
                    placeholder="Введите описание"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server-ip">IP адрес сервера</Label>
                  <Input
                    id="server-ip"
                    defaultValue="play.anarchist-empire.ru"
                    placeholder="Введите IP адрес"
                  />
                </div>

                <Button className="gap-2">
                  <Icon name="Save" size={16} />
                  Сохранить изменения
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="privileges" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Привилегии</h2>
                <Button className="gap-2">
                  <Icon name="Plus" size={16} />
                  Добавить привилегию
                </Button>
              </div>

              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Crown" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Привилегии пока не добавлены</p>
                <p className="text-sm">Нажмите кнопку выше для создания первой привилегии</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Заказы</h2>

              <div className="text-center py-12 text-muted-foreground">
                <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Заказов пока нет</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Администраторы</h2>
                <Button className="gap-2">
                  <Icon name="UserPlus" size={16} />
                  Добавить администратора
                </Button>
              </div>

              <div className="space-y-4">
                <Card className="p-4 flex items-center justify-between border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">skzry</p>
                      <p className="text-sm text-muted-foreground">Главный администратор</p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
