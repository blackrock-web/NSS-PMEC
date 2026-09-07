import type {
  ApiResponse,
  User,
  TenantConfig,
  EventItem,
  Activity,
  Achievement,
  GalleryPhoto,
  ReportItem,
  TeamMember,
  VolunteerApplication,
  VolunteerFormData,
  ContactMessageRecord,
  ContactFormData,
  AuditLogEntry,
  StorageQuota,
  GlobalSearchResult,
  ApplicationStatus,
} from '../types';

const TOKEN_STORAGE_KEY = 'nss_auth_token';
const COLLEGE_ID_KEY = 'nss_college_id';

export function getStoredToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getActiveCollegeId(): string {
  return (typeof window !== 'undefined' && localStorage.getItem(COLLEGE_ID_KEY)) || 'unit-04-05';
}

export function setActiveCollegeId(collegeId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COLLEGE_ID_KEY, collegeId);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const collegeId = getActiveCollegeId();

  const headers: Record<string, string> = {
    'x-college-id': collegeId,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set json content type if not uploading FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok && !data.error) {
      data.error = `HTTP ${res.status}: ${res.statusText}`;
    }
    return data;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network request failed';
    return {
      success: false,
      error: msg,
    };
  }
}

export const api = {
  auth: {
    login: (body: { email: string; password?: string; role?: 'admin' | 'superadmin'; idToken?: string }) =>
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getMe: () => request<{ user: User }>('/auth/me'),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  tenant: {
    getConfig: () => request<TenantConfig>('/tenant/config'),
    updateConfig: (data: Partial<TenantConfig>) =>
      request<TenantConfig>('/tenant/config', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    listTenants: () => request<TenantConfig[]>('/tenant/admin/tenants'),
    listAll: () => request<TenantConfig[]>('/tenant/admin/tenants'),
    provisionTenant: (data: {
      id: string;
      collegeName: string;
      collegeFullName: string;
      universityAffiliation: string;
      programmeOfficerName: string;
      email: string;
      phone: string;
    }) =>
      request<TenantConfig>('/tenant/admin/tenants', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    provision: (data: {
      id: string;
      collegeName: string;
      collegeFullName: string;
      universityAffiliation: string;
      programmeOfficerName: string;
      email: string;
      phone: string;
    }) =>
      request<TenantConfig>('/tenant/admin/tenants', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  events: {
    list: (params?: { status?: string; category?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request<EventItem[]>(`/events${query ? `?${query}` : ''}`);
    },
    get: (idOrSlug: string) => request<EventItem>(`/events/${idOrSlug}`),
    create: (data: Partial<EventItem>) =>
      request<EventItem>('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<EventItem>) =>
      request<EventItem>(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/events/${id}`, {
        method: 'DELETE',
      }),
  },

  activities: {
    list: (params?: { category?: string; featured?: boolean }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<Activity[]>(`/activities${query ? `?${query}` : ''}`);
    },
    get: (idOrSlug: string) => request<Activity>(`/activities/${idOrSlug}`),
    create: (data: Partial<Activity>) =>
      request<Activity>('/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Activity>) =>
      request<Activity>(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/activities/${id}`, {
        method: 'DELETE',
      }),
  },

  gallery: {
    list: (params?: { category?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request<GalleryPhoto[]>(`/gallery${query ? `?${query}` : ''}`);
    },
    create: (data: Partial<GalleryPhoto>) =>
      request<GalleryPhoto>('/gallery', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/gallery/${id}`, {
        method: 'DELETE',
      }),
  },

  achievements: {
    list: () => request<Achievement[]>('/achievements'),
    create: (data: Partial<Achievement>) =>
      request<Achievement>('/achievements', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Achievement>) =>
      request<Achievement>(`/achievements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/achievements/${id}`, {
        method: 'DELETE',
      }),
  },

  reports: {
    list: () => request<ReportItem[]>('/reports'),
    create: (data: Partial<ReportItem>) =>
      request<ReportItem>('/reports', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/reports/${id}`, {
        method: 'DELETE',
      }),
  },

  team: {
    list: () => request<TeamMember[]>('/team'),
    create: (data: Partial<TeamMember>) =>
      request<TeamMember>('/team', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<TeamMember>) =>
      request<TeamMember>(`/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/team/${id}`, {
        method: 'DELETE',
      }),
  },

  volunteers: {
    submit: (data: VolunteerFormData) =>
      request<VolunteerApplication>('/volunteers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    apply: (data: VolunteerFormData) =>
      request<VolunteerApplication>('/volunteers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    listAdmin: (params?: { status?: string; department?: string; academicYear?: string; search?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request<VolunteerApplication[]>(`/volunteers/admin${query ? `?${query}` : ''}`);
    },
    updateStatus: (id: string, status: ApplicationStatus, reviewNotes?: string) =>
      request<VolunteerApplication>(`/volunteers/admin/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reviewNotes }),
      }),
  },

  contact: {
    submit: (data: ContactFormData) =>
      request<ContactMessageRecord>('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    listAdmin: (params?: { status?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request<ContactMessageRecord[]>(`/contact/admin${query ? `?${query}` : ''}`);
    },
    reply: (id: string, replyNotes: string, status?: string) =>
      request<ContactMessageRecord>(`/contact/admin/${id}/reply`, {
        method: 'PUT',
        body: JSON.stringify({ replyNotes, status }),
      }),
  },

  uploads: {
    uploadImage: async (file: File, subfolder: 'images' | 'gallery' = 'images') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subfolder', subfolder);
      return request<{ url: string; fileId: string; filename: string }>('/uploads/image', {
        method: 'POST',
        body: formData,
      });
    },
    uploadPdf: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return request<{ url: string; fileId: string; filename: string; fileSize: string; pages: number }>(
        '/uploads/pdf',
        {
          method: 'POST',
          body: formData,
        }
      );
    },
    getStorageUsage: () => request<StorageQuota>('/uploads/storage'),
  },

  audit: {
    list: () => request<AuditLogEntry[]>('/audit'),
  },

  search: (q: string) => {
    const query = new URLSearchParams({ q }).toString();
    return request<GlobalSearchResult[]>(`/search?${query}`);
  },
};
