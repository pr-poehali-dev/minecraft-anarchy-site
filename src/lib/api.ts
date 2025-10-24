import funcUrls from '../../backend/func2url.json';

const API_URLS = {
  auth: funcUrls.auth,
  admins: funcUrls.admins,
  orders: funcUrls.orders,
  privileges: funcUrls.privileges,
  content: funcUrls.content,
  faqs: funcUrls.faqs,
};

export interface LoginResponse {
  success: boolean;
  admin?: {
    id: number;
    username: string;
  };
  error?: string;
}

export interface Admin {
  id: number;
  username: string;
  created_at: string;
  created_by: string;
}

export interface Privilege {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_active: boolean;
  image_url?: string;
}

export interface Order {
  id: number;
  privilege_id: number;
  privilege_name: string;
  player_name: string;
  player_email: string;
  player_phone: string;
  status: string;
  created_at: string;
}

export interface ContentData {
  [key: string]: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order_index: number;
}

export const api = {
  auth: {
    login: async (username: string, password: string): Promise<LoginResponse> => {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      return response.json();
    },
  },

  admins: {
    list: async (): Promise<Admin[]> => {
      const response = await fetch(API_URLS.admins);
      return response.json();
    },
    
    create: async (username: string, password: string, created_by: string): Promise<{ success: boolean; id?: number; error?: string }> => {
      const response = await fetch(API_URLS.admins, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, created_by }),
      });
      return response.json();
    },
  },

  privileges: {
    list: async (): Promise<Privilege[]> => {
      const response = await fetch(API_URLS.privileges);
      return response.json();
    },
    
    create: async (data: { name: string; description: string; price: number; features: string[]; image_url?: string }): Promise<{ success: boolean; id?: number; error?: string }> => {
      const response = await fetch(API_URLS.privileges, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    delete: async (id: number): Promise<{ success: boolean }> => {
      const response = await fetch(`${API_URLS.privileges}?id=${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  orders: {
    list: async (): Promise<Order[]> => {
      const response = await fetch(API_URLS.orders);
      return response.json();
    },
    
    create: async (privilege_id: number, player_name: string, player_phone: string, player_email?: string): Promise<{ success: boolean; order_id?: number }> => {
      const response = await fetch(API_URLS.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privilege_id, player_name, player_phone, player_email }),
      });
      return response.json();
    },
    
    updateStatus: async (order_id: number, status: string): Promise<{ success: boolean }> => {
      const response = await fetch(API_URLS.orders, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id, status }),
      });
      return response.json();
    },
  },

  content: {
    get: async (): Promise<ContentData> => {
      const response = await fetch(API_URLS.content);
      return response.json();
    },
    
    update: async (key: string, value: string): Promise<{ success: boolean }> => {
      const response = await fetch(API_URLS.content, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });
      return response.json();
    },
  },

  faqs: {
    list: async (): Promise<FAQ[]> => {
      const response = await fetch(API_URLS.faqs);
      return response.json();
    },
    
    create: async (question: string, answer: string, order_index: number): Promise<{ success: boolean; id?: number }> => {
      const response = await fetch(API_URLS.faqs, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, answer, order_index }),
      });
      return response.json();
    },
    
    update: async (id: number, question: string, answer: string): Promise<{ success: boolean }> => {
      const response = await fetch(API_URLS.faqs, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, question, answer }),
      });
      return response.json();
    },
    
    delete: async (id: number): Promise<{ success: boolean }> => {
      const response = await fetch(`${API_URLS.faqs}?id=${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },
};