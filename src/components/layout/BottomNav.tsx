import { Home, Network, Database } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'หน้าหลัก', path: '/' },
  { icon: <Database className="w-5 h-5" />, label: 'ข้อมูล', path: '/data' },
  { icon: <Network className="w-5 h-5" />, label: 'ผังองค์กร', path: '/organization' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:left-64">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
