import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api, type Admin as AdminType, type Privilege, type Order, type ContentData } from '@/lib/api';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<AdminType | null>(null);
  const { toast } = useToast();

  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(false);

  const [newAdminDialog, setNewAdminDialog] = useState(false);
  const [newPrivilegeDialog, setNewPrivilegeDialog] = useState(false);

  const loadData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const [adminsData, privilegesData, ordersData, contentData] = await Promise.all([
        api.admins.list(),
        api.privileges.list(),
        api.orders.list(),
        api.content.get(),
      ]);
      
      setAdmins(adminsData);
      setPrivileges(privilegesData);
      setOrders(ordersData);
      setContent(contentData);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await api.auth.login(username, password);
      
      if (result.success && result.admin) {
        setIsAuthenticated(true);
        setCurrentAdmin(result.admin as AdminType);
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
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти в систему',
        variant: 'destructive',
      });
    }
  };

  const handleContentUpdate = async (key: string, value: string) => {
    try {
      await api.content.update(key, value);
      toast({
        title: 'Сохранено',
        description: 'Контент успешно обновлен',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить контент',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePrivilege = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const featuresText = formData.get('features') as string;
    const features = featuresText.split('\n').filter(f => f.trim());
    const imageUrl = formData.get('image_url') as string;
    
    try {
      await api.privileges.create({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        features,
        image_url: imageUrl || undefined,
      });
      
      toast({
        title: 'Создано',
        description: 'Привилегия успешно добавлена',
      });
      
      setNewPrivilegeDialog(false);
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать привилегию',
        variant: 'destructive',
      });
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await api.admins.create(
        formData.get('username') as string,
        formData.get('password') as string,
        currentAdmin?.username || 'system'
      );
      
      if (result.success) {
        toast({
          title: 'Создано',
          description: 'Администратор успешно добавлен',
        });
        
        setNewAdminDialog(false);
        loadData();
      } else {
        toast({
          title: 'Ошибка',
          description: result.error || 'Не удалось создать администратора',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать администратора',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePrivilege = async (id: number) => {
    try {
      await api.privileges.delete(id);
      toast({
        title: 'Удалено',
        description: 'Привилегия удалена',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить привилегию',
        variant: 'destructive',
      });
    }
  };

  const handleOrderStatusChange = async (orderId: number, status: string) => {
    try {
      await api.orders.updateStatus(orderId, status);
      toast({
        title: 'Обновлено',
        description: 'Статус заказа изменен',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
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
              Администратор: {currentAdmin?.username}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsAuthenticated(false);
                setCurrentAdmin(null);
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
              Привилегии ({privileges.length})
            </TabsTrigger>

            <TabsTrigger value="orders">
              <Icon name="ShoppingCart" size={16} className="mr-2" />
              Заказы ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="admins">
              <Icon name="Users" size={16} className="mr-2" />
              Администраторы ({admins.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Редактирование контента</h2>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                let hasChanges = false;
                
                for (const [key, originalValue] of Object.entries(content)) {
                  const newValue = formData.get(key) as string;
                  if (newValue && newValue !== originalValue) {
                    await handleContentUpdate(key, newValue);
                    hasChanges = true;
                  }
                }
                
                if (hasChanges) {
                  toast({
                    title: 'Сохранено',
                    description: 'Все изменения успешно применены',
                  });
                }
              }} className="space-y-4">
                {Object.entries(content).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{key}</Label>
                    <Input
                      id={key}
                      name={key}
                      defaultValue={value}
                    />
                  </div>
                ))}
                <Button type="submit" className="gap-2">
                  <Icon name="Save" size={16} />
                  Сохранить изменения
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="privileges" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Привилегии</h2>
                <Dialog open={newPrivilegeDialog} onOpenChange={setNewPrivilegeDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Icon name="Plus" size={16} />
                      Добавить привилегию
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новая привилегия</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreatePrivilege} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="priv-name">Название</Label>
                        <Input id="priv-name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priv-desc">Описание</Label>
                        <Input id="priv-desc" name="description" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priv-price">Цена (руб.)</Label>
                        <Input id="priv-price" name="price" type="number" step="0.01" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priv-features">Возможности (по одной на строку)</Label>
                        <Textarea id="priv-features" name="features" rows={5} placeholder="Fly mode&#10;Kit access&#10;Home teleport" />
                      </div>
                      <Button type="submit" className="w-full">Создать</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {privileges.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Crown" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Привилегии пока не добавлены</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {privileges.map((priv) => (
                    <Card key={priv.id} className="p-4">
                      <div className="flex items-start gap-4 justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{priv.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{priv.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {priv.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary">{feature}</Badge>
                            ))}
                          </div>
                          <p className="text-lg font-bold text-primary">{priv.price} ₽</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeletePrivilege(priv.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Заказы</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Заказов пока нет</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{order.privilege_name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Игрок: {order.player_name}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            Телефон: {order.player_phone || 'не указан'} | Email: {order.player_email || 'не указан'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={order.status === 'pending' ? 'secondary' : order.status === 'completed' ? 'default' : 'destructive'}>
                            {order.status}
                          </Badge>
                          {order.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleOrderStatusChange(order.id, 'completed')}
                            >
                              Выполнить
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Администраторы</h2>
                <Dialog open={newAdminDialog} onOpenChange={setNewAdminDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Icon name="UserPlus" size={16} />
                      Добавить администратора
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новый администратор</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-username">Логин</Label>
                        <Input id="admin-username" name="username" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Пароль</Label>
                        <Input id="admin-password" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full">Создать</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {admins.map((admin) => (
                  <Card key={admin.id} className="p-4 flex items-center justify-between border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name="User" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{admin.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Добавлен: {admin.created_by} | {new Date(admin.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}