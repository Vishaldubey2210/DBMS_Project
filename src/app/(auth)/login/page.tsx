// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">MIMS</h1>
          <p className="text-gray-400 text-sm mt-1">
            Military Inventory Management System
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Indian Army Logistics Platform
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
