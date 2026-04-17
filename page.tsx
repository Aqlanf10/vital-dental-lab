'use client';

import React, { useState, useCallback, lazy, Suspense } from 'react';
import { StoreProvider, useStore } from '@/lib/store';
import { Sidebar, Header } from '@/components/dental/layout/SidebarHeader';
import SplashScreen from '@/components/dental/layout/SplashScreen';
import { useSmartNotifications } from '@/hooks/use-smart-notifications';
import { PermissionGuard, AccessDenied } from '@/components/dental/shared/PermissionGuard';
import type { Permission } from '@/lib/types';

// Page permission mapping
const PAGE_PERMISSIONS: Record<string, Permission> = {
  cases: 'cases.view',
  'case-form': 'cases.create',
  'case-details': 'cases.view',
  doctors: 'doctors.view',
  'doctor-cases': 'cases.view',
  billing: 'billing.view',
  reports: 'reports.view',
  analytics: 'analytics.view',
  'activity-log': 'activity.view',
  users: 'users.view',
  technicians: 'users.view',
  'work-types': 'settings.view',
  settings: 'settings.view',
  'ai-delivery-estimator': 'ai.view',
  'predictive-analytics': 'analytics.view',
  'quality-system': 'cases.view',
  'stl-viewer': 'cases.view',
  integrations: 'settings.view',
  'api-docs': 'settings.view',
  branches: 'branches.view',
  equipment: 'equipment.view',
  inventory: 'inventory.view',
  satisfaction: 'satisfaction.view',
  'task-queue': 'tasks.view',
  'user-roles': 'users.manage',
};
import Dashboard from '@/components/dental/dashboard/Dashboard';
import CaseList from '@/components/dental/cases/CaseList';
import CaseForm from '@/components/dental/cases/CaseForm';
import CaseDetails from '@/components/dental/cases/CaseDetails';
import DoctorList from '@/components/dental/doctors/DoctorList';
import DoctorPortal from '@/components/dental/doctors/DoctorPortal';
import DoctorCases from '@/components/dental/doctors/DoctorCases';
import SettingsPage from '@/components/dental/settings/Settings';
import BillingList from '@/components/dental/billing/BillingList';
import Analytics from '@/components/dental/analytics/Analytics';
import Roadmap from '@/components/dental/roadmap/Roadmap';
import About from '@/components/dental/about/About';
import ActivityLogPage from '@/components/dental/activity/ActivityLog';
import UserManagement from '@/components/dental/users/UserManagement';
import RoleManagement from '@/components/dental/users/RoleManagement';
import TechniciansManager from '@/components/dental/technicians/TechniciansManager';
import WorkTypesManager from '@/components/dental/worktypes/WorkTypesManager';
import ReportsPage from '@/components/dental/reports/ReportsPage';
import TaskQueue from '@/components/dental/technicians/TaskQueue';
import LabChatbot from '@/components/dental/ai/LabChatbot';
import PWAInstallPrompt from '@/components/dental/shared/PWAInstallPrompt';
import ServiceWorkerRegistration from '@/components/dental/shared/ServiceWorkerRegistration';
import AIDeliveryEstimator from '@/components/dental/ai/AIDeliveryEstimator';
import PredictiveAnalytics from '@/components/dental/ai/PredictiveAnalytics';
import QualitySystem from '@/components/dental/ai/QualitySystem';
import STLViewer from '@/components/dental/ai/STLViewer';
import IntegrationsHub from '@/components/dental/integrations/IntegrationsHub';
import OpenAPIDoc from '@/components/dental/api/OpenAPIDoc';
import BranchManager from '@/components/dental/branches/BranchManager';
import DualEntryScreen from '@/components/dental/auth/DualEntryScreen';
import EquipmentManager from '@/components/dental/equipment/EquipmentManager';
import InventoryManager from '@/components/dental/inventory/InventoryManager';
import SatisfactionManager from '@/components/dental/satisfaction/SatisfactionManager';
import GlobalSearch from '@/components/dental/search/GlobalSearch';
import AdvancedDashboard from '@/components/dental/dashboard/AdvancedDashboard';
import TemplateManager from '@/components/dental/templates/TemplateManager';
import ScheduleManager from '@/components/dental/calendar/ScheduleManager';
import AuditTrail from '@/components/dental/audit/AuditTrail';
import BatchOperations from '@/components/dental/batch/BatchOperations';
import CustomFieldsManager from '@/components/dental/fields/CustomFieldsManager';
import AdvancedDoctorPortal from '@/components/dental/doctors/AdvancedDoctorPortal';

function AppContent() {
  const { state, navigate } = useStore();
  const [showSplash, setShowSplash] = useState(true);

  // Smart notifications - auto-check for overdue items
  useSmartNotifications();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Dual entry screen IS the login — doctor or admin/lab must authenticate to access the system
  if (!state.branchSelected) {
    return <DualEntryScreen />;
  }

  // Page-specific skeleton loaders
  const ChartSkeleton = (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded-lg w-40" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 bg-gray-100 rounded-xl" />
        <div className="h-72 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-64 bg-gray-100 rounded-xl" />
    </div>
  );

  const TableSkeleton = (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded-lg w-48" />
        <div className="h-9 w-28 bg-gray-200 rounded-lg" />
      </div>
      <div className="flex gap-3">
        <div className="h-9 w-36 bg-gray-100 rounded-lg" />
        <div className="h-9 w-36 bg-gray-100 rounded-lg" />
        <div className="h-9 w-36 bg-gray-100 rounded-lg" />
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-100 flex gap-4 px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-20" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-50">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-100 rounded w-16" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const CardsSkeleton = (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded-lg w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );

  const ContentSkeleton = (
    <div className="space-y-4 animate-pulse">
      <div className="h-40 bg-gray-100 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-gray-100 rounded-xl" />
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-64 bg-gray-100 rounded-xl" />
    </div>
  );

  const renderPage = () => {
    const page = state.currentPage;
    const requiredPermission = PAGE_PERMISSIONS[page];

    const renderInner = () => {
      switch (page) {
        case 'dashboard':
          return <Dashboard />;
        case 'cases':
          return <CaseList />;
        case 'case-form':
          return <CaseForm />;
        case 'case-details':
          return <CaseDetails />;
        case 'doctors':
          return <DoctorList />;
        case 'doctor-portal':
          return <DoctorPortal />;
        case 'doctor-cases':
          return <DoctorCases />;
        case 'settings':
          return <SettingsPage />;
        case 'billing':
          return <BillingList />;
        case 'task-queue':
          return <Suspense fallback={TableSkeleton}><TaskQueue /></Suspense>;
        case 'analytics':
          return <Suspense fallback={ChartSkeleton}><Analytics /></Suspense>;
        case 'activity-log':
          return <Suspense fallback={TableSkeleton}><ActivityLogPage /></Suspense>;
        case 'users':
          return <Suspense fallback={TableSkeleton}><UserManagement /></Suspense>;
        case 'user-roles':
          return <Suspense fallback={TableSkeleton}><RoleManagement /></Suspense>;
        case 'technicians':
          return <Suspense fallback={CardsSkeleton}><TechniciansManager /></Suspense>;
        case 'work-types':
          return <Suspense fallback={CardsSkeleton}><WorkTypesManager /></Suspense>;
        case 'roadmap':
          return <Suspense fallback={ContentSkeleton}><Roadmap /></Suspense>;
        case 'about':
          return <Suspense fallback={ContentSkeleton}><About /></Suspense>;
        case 'reports':
          return <Suspense fallback={ChartSkeleton}><ReportsPage /></Suspense>;
        case 'ai-delivery-estimator':
          return <Suspense fallback={ContentSkeleton}><AIDeliveryEstimator /></Suspense>;
        case 'predictive-analytics':
          return <Suspense fallback={ChartSkeleton}><PredictiveAnalytics /></Suspense>;
        case 'quality-system':
          return <Suspense fallback={TableSkeleton}><QualitySystem /></Suspense>;
        case 'stl-viewer':
          return <Suspense fallback={CardsSkeleton}><STLViewer /></Suspense>;
        case 'integrations':
          return <Suspense fallback={ContentSkeleton}><IntegrationsHub /></Suspense>;
        case 'api-docs':
          return <Suspense fallback={ContentSkeleton}><OpenAPIDoc /></Suspense>;
        case 'branches':
          return <Suspense fallback={ContentSkeleton}><BranchManager /></Suspense>;
        case 'equipment':
          return <Suspense fallback={CardsSkeleton}><EquipmentManager /></Suspense>;
        case 'inventory':
          return <Suspense fallback={TableSkeleton}><InventoryManager /></Suspense>;
        case 'satisfaction':
          return <Suspense fallback={ContentSkeleton}><SatisfactionManager /></Suspense>;
        case 'global-search':
          return <Suspense fallback={ContentSkeleton}><GlobalSearch /></Suspense>;
        case 'advanced-dashboard':
          return <Suspense fallback={ChartSkeleton}><AdvancedDashboard /></Suspense>;
        case 'template-manager':
          return <Suspense fallback={CardsSkeleton}><TemplateManager /></Suspense>;
        case 'schedule-manager':
          return <Suspense fallback={ContentSkeleton}><ScheduleManager /></Suspense>;
        case 'audit-trail':
          return <Suspense fallback={TableSkeleton}><AuditTrail /></Suspense>;
        case 'batch-operations':
          return <Suspense fallback={TableSkeleton}><BatchOperations /></Suspense>;
        case 'custom-fields':
          return <Suspense fallback={ContentSkeleton}><CustomFieldsManager /></Suspense>;
        case 'advanced-doctor-portal':
          return <Suspense fallback={ContentSkeleton}><AdvancedDoctorPortal /></Suspense>;
        default:
          return state.currentUser?.role === 'admin' ? <Dashboard /> : <DoctorPortal />;
      }
    };

    // Apply permission guard for pages that require specific permissions
    if (requiredPermission) {
      return (
        <PermissionGuard
          permission={requiredPermission}
          fallback={<AccessDenied />}
        >
          {renderInner()}
        </PermissionGuard>
      );
    }

    // Pages without permission requirements (dashboard, doctor-portal, about, roadmap)
    return renderInner();
  };

  return (
    <>
      <ServiceWorkerRegistration />
      <PWAInstallPrompt />
      <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {renderPage()}
        </main>
        <footer className="border-t border-gray-100 bg-white px-4 lg:px-6 py-4 mt-auto">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 overflow-hidden rounded">
                <img src="/lab-logo.png" alt="Vital Dental Lab" className="w-full h-full object-contain" />
              </div>
              <span className="text-purple-600 font-bold text-sm">Vital Dental Lab</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">نظام إدارة المعمل السني السحابي</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">الإصدار 7.0.0</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة</span>
              <span className="text-gray-300">-</span>
              <span>التصميم والتطوير بالكامل</span>
              <button onClick={() => navigate('about')} className="text-purple-600 font-semibold hover:text-purple-800 transition-colors">دكتور عقلان الكامل</button>
              <span className="text-amber-500">
                <svg className="w-3 h-3 inline" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-300">
              <span>Next.js 16</span>
              <span>&middot;</span>
              <span>TypeScript</span>
              <span>&middot;</span>
              <span>Tailwind CSS 4</span>
              <span>&middot;</span>
              <span>React 19</span>
            </div>
          </div>
        </footer>
      </div>
      <LabChatbot />
    </div>
    </>
  );
}

export default function Home() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
