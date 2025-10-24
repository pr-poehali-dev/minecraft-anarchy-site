import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api, type Privilege } from '@/lib/api';

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPrivileges();
  }, []);

  const loadPrivileges = async () => {
    try {
      const data = await api.privileges.list();
      setPrivileges(data);
    } catch (error) {
      console.error('Failed to load privileges');
    }
  };

  const handleBuyPrivilege = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPrivilege) return;

    const formData = new FormData(e.currentTarget);
    const playerName = formData.get('player_name') as string;
    const playerEmail = formData.get('player_email') as string;

    try {
      await api.orders.create(selectedPrivilege.id, playerName, playerEmail);
      toast({
        title: 'Заказ создан!',
        description: 'Мы свяжемся с вами в ближайшее время',
      });
      setBuyDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заказ',
        variant: 'destructive',
      });
    }
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ANARCHIST EMPIRE
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('home')}
              className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Главная
            </button>
            <button 
              onClick={() => scrollToSection('privileges')}
              className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'privileges' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Привилегии
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'faq' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              FAQ
            </button>
            <Button 
              onClick={() => window.location.href = '/admin'}
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Icon name="Shield" size={16} />
              Админ
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="container relative z-10 px-4 mx-auto text-center">
          <Badge className="mb-6 bg-accent/20 text-accent border-accent/50">
            <Icon name="Radio" size={14} className="mr-1" />
            ONLINE 24/7
          </Badge>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ANARCHIST EMPIRE
            </span>
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Настоящая анархия без правил. Выживай, строй, сражайся! Сервер работает 24/7
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              <Icon name="Pickaxe" size={20} />
              Играть сейчас
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2"
              onClick={() => scrollToSection('privileges')}
            >
              <Icon name="Crown" size={20} />
              Привилегии
            </Button>
          </div>

          <Card className="inline-block bg-card/50 backdrop-blur border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">IP адрес сервера:</p>
            <code className="text-2xl font-mono font-bold text-primary">
              play.anarchist-empire.ru
            </code>
          </Card>
        </div>

        <div className="container px-4 mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                <Icon name="Sword" size={24} className="text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">PvP анархия</h3>
              <p className="text-sm text-muted-foreground">
                Никаких правил. Выживание сильнейших
              </p>
            </Card>

            <Card className="p-6 text-center bg-card/50 backdrop-blur border-border hover:border-accent/50 transition-colors">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
                <Icon name="Zap" size={24} className="text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-bold">24/7 Uptime</h3>
              <p className="text-sm text-muted-foreground">
                Сервер работает круглосуточно без перебоев
              </p>
            </Card>

            <Card className="p-6 text-center bg-card/50 backdrop-blur border-border hover:border-secondary/50 transition-colors">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/20">
                <Icon name="Crown" size={24} className="text-secondary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Привилегии</h3>
              <p className="text-sm text-muted-foreground">
                Уникальные возможности для игроков
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="privileges" className="py-20 bg-background/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Привилегии
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Выберите привилегию и получите уникальные возможности на сервере
            </p>
          </div>

          {privileges.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground bg-card/50 px-6 py-4 rounded-lg border border-border">
                <Icon name="Construction" size={24} />
                <p>Привилегии добавляются администратором</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {privileges.map((privilege) => (
                <Card key={privilege.id} className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                      <Icon name="Crown" size={24} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{privilege.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{privilege.description}</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {privilege.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Icon name="Check" size={16} className="text-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-primary">{privilege.price} ₽</span>
                    </div>
                    <Dialog open={buyDialogOpen && selectedPrivilege?.id === privilege.id} onOpenChange={(open) => {
                      setBuyDialogOpen(open);
                      if (!open) setSelectedPrivilege(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full gap-2" 
                          onClick={() => setSelectedPrivilege(privilege)}
                        >
                          <Icon name="ShoppingCart" size={16} />
                          Купить
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Заказ привилегии: {privilege.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleBuyPrivilege} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="player_name">Ваш ник в игре</Label>
                            <Input id="player_name" name="player_name" required placeholder="Steve" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="player_email">Email для связи</Label>
                            <Input id="player_email" name="player_email" type="email" required placeholder="steve@minecraft.com" />
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">К оплате:</p>
                            <p className="text-2xl font-bold text-primary">{privilege.price} ₽</p>
                          </div>
                          <Button type="submit" className="w-full">Оформить заказ</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="container px-4 mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FAQ
              </span>
            </h2>
            <p className="text-muted-foreground">
              Часто задаваемые вопросы
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6 bg-card/50">
              <AccordionTrigger className="text-left hover:no-underline">
                Как зайти на сервер?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Используйте IP адрес: play.anarchist-empire.ru в вашем клиенте Minecraft
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-6 bg-card/50">
              <AccordionTrigger className="text-left hover:no-underline">
                Какая версия Minecraft поддерживается?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Сервер поддерживает последнюю версию Minecraft Java Edition
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-6 bg-card/50">
              <AccordionTrigger className="text-left hover:no-underline">
                Есть ли правила на сервере?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Нет! Это сервер анархии - никаких правил и ограничений
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-6 bg-card/50">
              <AccordionTrigger className="text-left hover:no-underline">
                Как купить привилегию?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Привилегии появятся на сайте. Следите за обновлениями!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Anarchist Empire. Администратор: skzry</p>
        </div>
      </footer>
    </div>
  );
}