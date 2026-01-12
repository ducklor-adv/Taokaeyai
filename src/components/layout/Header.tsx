import { Bell, User, Truck } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Logo */}
          <div className="lg:hidden w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg lg:text-2xl font-bold text-primary-700">เถ้าแก้ใหญ่</h1>
            <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">CEO Dashboard</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notification */}
          <button className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 lg:gap-3 lg:pl-4 lg:border-l lg:border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">คุณเถ้าแก้</p>
              <p className="text-xs text-gray-500">CEO</p>
            </div>
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
