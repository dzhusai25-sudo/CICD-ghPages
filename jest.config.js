/**
 * Jest configuration
 * @type {import('jest').Config}
 */
const config = {
  // Среда тестирования (необходима для работы с DOM)
  testEnvironment: 'jsdom',

  // Автоматически очищать моки перед каждым тестом
  clearMocks: true,

  // Покрытие кода
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text'],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Мокирование CSS-файлов (решает ошибку с импортом стилей)
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },

  // Шаблоны для сбора покрытия (включая подпапки)
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js', // Исключаем тестовые файлы
    '!src/**/index.js', // Исключаем индексные файлы, если нужно
  ],

  // Игнорировать node_modules при трансформации
  transformIgnorePatterns: ['/node_modules/'],
};

module.exports = config;
