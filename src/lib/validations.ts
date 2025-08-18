export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message;
    }

    if (value && rule.minLength && value.toString().length < rule.minLength) {
      return rule.message;
    }

    if (value && rule.maxLength && value.toString().length > rule.maxLength) {
      return rule.message;
    }

    if (value && rule.pattern && !rule.pattern.test(value.toString())) {
      return rule.message;
    }

    if (value && rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }

  return null;
};

export const validateForm = (data: Record<string, any>, schema: ValidationSchema): ValidationResult => {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
};

// Validation schemas
export const loginSchema: ValidationSchema = {
  email: [
    { required: true, message: 'L\'email est requis' },
    { pattern: patterns.email, message: 'Format d\'email invalide' },
  ],
  password: [
    { required: true, message: 'Le mot de passe est requis' },
    { minLength: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
  ],
};

export const registerSchema: ValidationSchema = {
  firstName: [
    { required: true, message: 'Le prénom est requis' },
    { pattern: patterns.name, message: 'Le prénom doit contenir uniquement des lettres (2-50 caractères)' },
  ],
  lastName: [
    { required: true, message: 'Le nom est requis' },
    { pattern: patterns.name, message: 'Le nom doit contenir uniquement des lettres (2-50 caractères)' },
  ],
  email: [
    { required: true, message: 'L\'email est requis' },
    { pattern: patterns.email, message: 'Format d\'email invalide' },
  ],
  password: [
    { required: true, message: 'Le mot de passe est requis' },
    { minLength: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
    { 
      pattern: patterns.password, 
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial' 
    },
  ],
  confirmPassword: [
    { required: true, message: 'La confirmation du mot de passe est requise' },
  ],
  phone: [
    { pattern: patterns.phone, message: 'Format de téléphone invalide' },
  ],
  role: [
    { required: true, message: 'Le rôle est requis' },
    { 
      custom: (value) => ['student', 'parent'].includes(value), 
      message: 'Rôle invalide' 
    },
  ],
  acceptTerms: [
    { 
      custom: (value) => value === true, 
      message: 'Vous devez accepter les conditions d\'utilisation' 
    },
  ],
};

export const forgotPasswordSchema: ValidationSchema = {
  email: [
    { required: true, message: 'L\'email est requis' },
    { pattern: patterns.email, message: 'Format d\'email invalide' },
  ],
};

export const resetPasswordSchema: ValidationSchema = {
  password: [
    { required: true, message: 'Le mot de passe est requis' },
    { minLength: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
    { 
      pattern: patterns.password, 
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial' 
    },
  ],
  confirmPassword: [
    { required: true, message: 'La confirmation du mot de passe est requise' },
  ],
};

// Custom validation functions
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateAge = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 13;
  }
  
  return age >= 13;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

