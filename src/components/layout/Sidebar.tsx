import {
  LayoutDashboard,
  Truck,
  Users,
  DollarSign,
  FileText,
  Wrench,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'ภาพรวม', active: true },
  { icon: <Truck className="w-5 h-5" />, label: 'การขนส่ง' },
  { icon: <DollarSign className="w-5 h-5" />, label: 'การเงิน' },
  { icon: <FileText className="w-5 h-5" />, label: 'บัญชี' },
  { icon: <Users className="w-5 h-5" />, label: 'HR' },
  { icon: <Wrench className="w-5 h-5" />, label: 'ซ่อมบำรุง' },
  { icon: <TrendingUp className="w-5 h-5" />, label: 'การตลาด' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'รายงาน' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">TKY Transport</h2>
            <p className="text-xs text-gray-500">ระบบบริหารจัดการ</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                item.active
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-gray-200">
        <div className="bg-primary-50 rounded-lg p-4">
          <p className="text-sm font-medium text-primary-700">สุขภาพบริษัท</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '76%' }}></div>
            </div>
            <span className="text-sm font-bold text-primary-700">76%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
