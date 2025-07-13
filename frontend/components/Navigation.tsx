'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/patients', label: 'Patients', icon: '👥' },
    { href: '/medications', label: 'Medications', icon: '💊' },
    { href: '/assignments', label: 'Assignments', icon: '📋' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🏥 Health Management
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
