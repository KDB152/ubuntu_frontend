// API service for connecting to backend endpoints
const API_BASE_URL = 'http://localhost:3001';

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  
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

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
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
// Removed duplicate declaration of messagingAPI

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

  getParentByUserId: (userId: number) => apiRequest(`/parents/by-user/${userId}`),

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

// Settings API
export const settingsAPI = {
  // System Settings
  getSystemSettings: () => apiRequest('/settings/system'),
  
  getSystemSettingsAsObject: () => apiRequest('/settings/system/object'),
  
  getSystemSetting: (key: string) => apiRequest(`/settings/system/${key}`),
  
  getSystemSettingsByCategory: (category: string) => 
    apiRequest(`/settings/system/category/${category}`),
  
  setSystemSetting: (settingData: any) =>
    apiRequest('/settings/system', {
      method: 'POST',
      body: JSON.stringify(settingData),
    }),
  
  updateSystemSetting: (key: string, settingData: any) =>
    apiRequest(`/settings/system/${key}`, {
      method: 'PATCH',
      body: JSON.stringify(settingData),
    }),
  
  bulkUpdateSystemSettings: (settings: any[]) =>
    apiRequest('/settings/system/bulk', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    }),
  
  deleteSystemSetting: (key: string) =>
    apiRequest(`/settings/system/${key}`, {
      method: 'DELETE',
    }),
  
  initializeSystemSettings: () =>
    apiRequest('/settings/system/initialize', {
      method: 'POST',
    }),

  // User Preferences
  getUserPreferences: (userId: number) => apiRequest(`/settings/user/${userId}`),
  
  getUserPreferencesAsObject: (userId: number) => 
    apiRequest(`/settings/user/${userId}/object`),
  
  getUserPreference: (userId: number, key: string) => 
    apiRequest(`/settings/user/${userId}/${key}`),
  
  getUserPreferencesByCategory: (userId: number, category: string) => 
    apiRequest(`/settings/user/${userId}/category/${category}`),
  
  setUserPreference: (userId: number, preferenceData: any) =>
    apiRequest(`/settings/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify(preferenceData),
    }),
  
  updateUserPreference: (userId: number, key: string, preferenceData: any) =>
    apiRequest(`/settings/user/${userId}/${key}`, {
      method: 'PATCH',
      body: JSON.stringify(preferenceData),
    }),
  
  bulkUpdateUserPreferences: (userId: number, preferences: any[]) =>
    apiRequest(`/settings/user/${userId}/bulk`, {
      method: 'POST',
      body: JSON.stringify({ preferences }),
    }),
  
  deleteUserPreference: (userId: number, key: string) =>
    apiRequest(`/settings/user/${userId}/${key}`, {
      method: 'DELETE',
    }),
};

// Messaging API
export const messagingAPI = {
  // Conversations
  getConversations: (userId: number) =>
    apiRequest(`/messaging/conversations?userId=${userId}`),

  getConversation: (conversationId: number) =>
    apiRequest(`/messaging/conversations/${conversationId}`),

  createConversation: (conversationData: {
    participant1Id: number;
    participant2Id: number;
    title?: string;
    type?: 'direct' | 'group';
  }) =>
    apiRequest('/messaging/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    }),

  createOrGetConversation: (participant1Id: number, participant2Id: number) =>
    apiRequest('/messaging/conversations/create-or-get', {
      method: 'POST',
      body: JSON.stringify({ participant1Id, participant2Id }),
    }),

  deleteConversation: (conversationId: number) =>
    apiRequest(`/messaging/conversations/${conversationId}`, {
      method: 'DELETE',
    }),

  // Messages
  getMessages: (conversationId: number) =>
    apiRequest(`/messaging/conversations/${conversationId}/messages`),

  sendMessage: (messageData: {
    conversationId: number;
    senderId: number;
    content: string;
    messageType?: 'text' | 'image' | 'file' | 'audio';
  }) =>
    apiRequest('/messaging/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  uploadFile: (formData: FormData) => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE_URL}/messaging/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },

  markMessageAsRead: (messageId: number) =>
    apiRequest(`/messaging/messages/${messageId}/read`, {
      method: 'PATCH',
    }),

  deleteMessage: (messageId: number) =>
    apiRequest(`/messaging/messages/${messageId}`, {
      method: 'DELETE',
    }),

  // Contacts and Users
  getContacts: (userId: number) =>
    apiRequest(`/messaging/users/${userId}/contacts`),

  getAvailableRecipients: (userId: number) =>
    apiRequest(`/messaging/users/${userId}/available-recipients`),

  // Search
  searchMessages: (conversationId: number, query: string) =>
    apiRequest(`/messaging/search?conversationId=${conversationId}&query=${encodeURIComponent(query)}`),

  // Test
  test: () => apiRequest('/messaging/test'),
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

