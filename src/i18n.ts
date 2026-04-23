import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      orders: 'Orders',
      suppliers: 'Suppliers',
      warehouseApp: 'WarehouseApp',

      // Login
      warehouseLogin: 'Warehouse Login',
      signInDescription: 'Sign in to manage inventory, orders, and suppliers',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      usernameRequired: 'Username is required',
      passwordRequired: 'Password is required',

      // Dashboard
      warehouseDashboard: 'Warehouse Dashboard',
      dashboardOverview: 'Overview of your warehouse operations',
      totalItems: 'Total Items',
      lowStockItems: 'Low Stock Items',
      pendingOrders: 'Pending Orders',
      totalSuppliers: 'Total Suppliers',
      recentOrders: 'Recent Orders',

      // Common
      logout: 'Logout',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      status: 'Status',
      actions: 'Actions',
      name: 'Name',
      quantity: 'Quantity',
      price: 'Price',
      date: 'Date',
      description: 'Description',
    },
  },
  ar: {
    translation: {
      // Navigation
      dashboard: 'لوحة التحكم',
      inventory: 'المخزون',
      orders: 'الطلبات',
      suppliers: 'الموردين',
      warehouseApp: 'تطبيق المستودع',

      // Login
      warehouseLogin: 'تسجيل الدخول للمستودع',
      signInDescription: 'سجل الدخول لإدارة المخزون والطلبات والموردين',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      usernameRequired: 'اسم المستخدم مطلوب',
      passwordRequired: 'كلمة المرور مطلوبة',

      // Dashboard
      warehouseDashboard: 'لوحة تحكم المستودع',
      dashboardOverview: 'نظرة عامة على عمليات المستودع',
      totalItems: 'إجمالي العناصر',
      lowStockItems: 'عناصر منخفضة المخزون',
      pendingOrders: 'الطلبات المعلقة',
      totalSuppliers: 'إجمالي الموردين',
      recentOrders: 'الطلبات الأخيرة',

      // Common
      logout: 'تسجيل الخروج',
      loading: 'جارٍ التحميل...',
      error: 'خطأ',
      success: 'نجح',
      cancel: 'إلغاء',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      add: 'إضافة',
      search: 'بحث',
      filter: 'تصفية',
      status: 'الحالة',
      actions: 'الإجراءات',
      name: 'الاسم',
      quantity: 'الكمية',
      price: 'السعر',
      date: 'التاريخ',
      description: 'الوصف',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;