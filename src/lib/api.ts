// API service for connecting to backend endpoints
const API_BASE_URL = 'http://localhost:3001';

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  verifyEmail: (token: string) =>
    apiRequest(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    }),

  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

// Admin API
export const adminAPI = {
  // Students management
  getStudents: (params?: { page?: number; limit?: number }) =>
    apiRequest(`/admin/students?${new URLSearchParams(params as any)}`),

  createStudent: (studentData: any) =>
    apiRequest('/admin/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  updateStudent: (id: number, studentData: any) =>
    apiRequest(`/admin/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(studentData),
    }),

  deleteStudent: (id: number) =>
    apiRequest(`/admin/students/${id}`, {
      method: 'DELETE',
    }),

  // Parents management
  getParents: (params?: { page?: number; limit?: number }) =>
    apiRequest(`/admin/parents?${new URLSearchParams(params as any)}`),

  createParent: (parentData: any) =>
    apiRequest('/admin/parents', {
      method: 'POST',
      body: JSON.stringify(parentData),
    }),

  updateParent: (id: number, parentData: any) =>
    apiRequest(`/admin/parents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(parentData),
    }),

  deleteParent: (id: number) =>
    apiRequest(`/admin/parents/${id}`, {
      method: 'DELETE',
    }),

  // User approval
  approveUser: (id: number, approve: boolean) =>
    apiRequest(`/admin/users/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ approve }),
    }),
};

// Quizzes API
export const quizzesAPI = {
  getQuizzes: (params?: {
    page?: number;
    limit?: number;
    subject?: string;
    level?: string;
    status?: string;
  }) => apiRequest(`/quizzes?${new URLSearchParams(params as any)}`),

  getQuiz: (id: number) => apiRequest(`/quizzes/${id}`),

  createQuiz: (quizData: any) =>
    apiRequest('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    }),

  updateQuiz: (id: number, quizData: any) =>
    apiRequest(`/quizzes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(quizData),
    }),

  deleteQuiz: (id: number) =>
    apiRequest(`/quizzes/${id}`, {
      method: 'DELETE',
    }),

  getQuizAttempts: (id: number) => apiRequest(`/quizzes/${id}/attempts`),

  submitQuizAttempt: (attemptData: any) =>
    apiRequest('/quizzes/attempts', {
      method: 'POST',
      body: JSON.stringify(attemptData),
    }),
};

// Messaging API
export const messagingAPI = {
  getConversations: (userId: number) =>
    apiRequest(`/messaging/conversations?userId=${userId}`),

  getConversation: (id: number) => apiRequest(`/messaging/conversations/${id}`),

  createConversation: (conversationData: any) =>
    apiRequest('/messaging/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    }),

  getMessages: (conversationId: number) =>
    apiRequest(`/messaging/conversations/${conversationId}/messages`),

  sendMessage: (messageData: any) =>
    apiRequest('/messaging/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  markMessageAsRead: (messageId: number) =>
    apiRequest(`/messaging/messages/${messageId}/read`, {
      method: 'PATCH',
    }),

  deleteConversation: (id: number) =>
    apiRequest(`/messaging/conversations/${id}`, {
      method: 'DELETE',
    }),

  deleteMessage: (id: number) =>
    apiRequest(`/messaging/messages/${id}`, {
      method: 'DELETE',
    }),

  getContacts: (userId: number) => apiRequest(`/messaging/users/${userId}/contacts`),

  searchMessages: (conversationId: number, query: string) =>
    apiRequest(`/messaging/search?conversationId=${conversationId}&query=${query}`),
};

// Files API
export const filesAPI = {
  getFiles: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
  }) => apiRequest(`/files?${new URLSearchParams(params as any)}`),

  getFile: (id: number) => apiRequest(`/files/${id}`),

  uploadFile: (file: File, metadata: any) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    return apiRequest('/files/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },

  updateFile: (id: number, updateData: any) =>
    apiRequest(`/files/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),

  deleteFile: (id: number) =>
    apiRequest(`/files/${id}`, {
      method: 'DELETE',
    }),

  getCategories: () => apiRequest('/files/categories'),

  getFileTypes: () => apiRequest('/files/types'),

  bulkDelete: (ids: number[]) =>
    apiRequest('/files/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  bulkMove: (ids: number[], category: string) =>
    apiRequest('/files/bulk-move', {
      method: 'POST',
      body: JSON.stringify({ ids, category }),
    }),

  searchFiles: (query: string) => apiRequest(`/files/search?query=${query}`),

  getFileStats: () => apiRequest('/files/stats'),

  downloadFile: (id: number) =>
    apiRequest(`/files/download/${id}`, {
      method: 'POST',
    }),

  shareFile: (id: number, users: number[]) =>
    apiRequest(`/files/share/${id}`, {
      method: 'POST',
      body: JSON.stringify({ users }),
    }),
};

// Users API
export const usersAPI = {
  getUsers: (params?: { page?: number; limit?: number; role?: string }) =>
    apiRequest(`/users?${new URLSearchParams(params as any)}`),

  getUser: (id: number) => apiRequest(`/users/${id}`),

  updateUser: (id: number, userData: any) =>
    apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),

  deleteUser: (id: number) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Students API
export const studentsAPI = {
  getStudents: (params?: { page?: number; limit?: number }) =>
    apiRequest(`/students?${new URLSearchParams(params as any)}`),

  getStudent: (id: number) => apiRequest(`/students/${id}`),

  updateStudent: (id: number, studentData: any) =>
    apiRequest(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(studentData),
    }),

  deleteStudent: (id: number) =>
    apiRequest(`/students/${id}`, {
      method: 'DELETE',
    }),
};

// Parents API
export const parentsAPI = {
  getParents: (params?: { page?: number; limit?: number }) =>
    apiRequest(`/parents?${new URLSearchParams(params as any)}`),

  getParent: (id: number) => apiRequest(`/parents/${id}`),

  updateParent: (id: number, parentData: any) =>
    apiRequest(`/parents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(parentData),
    }),

  deleteParent: (id: number) =>
    apiRequest(`/parents/${id}`, {
      method: 'DELETE',
    }),
};

// Progress API
export const progressAPI = {
  getProgress: (studentId: number) => apiRequest(`/progress/student/${studentId}`),

  updateProgress: (studentId: number, progressData: any) =>
    apiRequest(`/progress/student/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(progressData),
    }),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (userId: number) => apiRequest(`/notifications/user/${userId}`),

  markAsRead: (id: number) =>
    apiRequest(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  deleteNotification: (id: number) =>
    apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    }),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => apiRequest('/analytics/dashboard'),

  getUserStats: (userId: number) => apiRequest(`/analytics/user/${userId}`),

  getQuizStats: (quizId?: number) =>
    apiRequest(`/analytics/quizzes${quizId ? `/${quizId}` : ''}`),

  getProgressStats: (timeframe: string) =>
    apiRequest(`/analytics/progress?timeframe=${timeframe}`),
};

export default {
  auth: authAPI,
  admin: adminAPI,
  quizzes: quizzesAPI,
  messaging: messagingAPI,
  files: filesAPI,
  users: usersAPI,
  students: studentsAPI,
  parents: parentsAPI,
  progress: progressAPI,
  notifications: notificationsAPI,
  analytics: analyticsAPI,
};

