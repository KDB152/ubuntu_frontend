// Configuration de la base de données
export const dbConfig = {
  host: process.env.DB_HOST || '51.77.195.224',
  user: process.env.DB_USERNAME || 'chrono_user',
  password: process.env.DB_PASSWORD || 'Abu3soib2004@',
  database: process.env.DB_NAME || 'chrono_carto'
};

// Configuration alternative pour le développement local
export const localDbConfig = {
  host: '51.77.195.224',
  user: 'chrono_user',
  password: 'Abu3soib2004@',
  database: 'chrono_carto'
};

