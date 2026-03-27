//login.tsx
import React, { useState } from "react";
import { Button } from "../../components/admin/button";
import { Input } from "../../components/admin/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/admin/card";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: () => void;
  onPageChange: (page: string) => void;
}

export function AdminLogin({
  onLogin,
  onPageChange,
}: AdminLoginProps) {
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginData.userId || !loginData.password) {
      setErrorMessage('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (loginData.userId === 'admin' && loginData.password === 'admin123') {
        toast.success('Login successful! Welcome to Admin Dashboard');
        onLogin();
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
        toast.error('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-bounce"></div>
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange("landing")}
        className="absolute top-6 left-6 z-20 text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 group rounded-xl backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
        Back to Home
      </Button>

      {/* Main Content - Centered */}
      <div className="relative z-10 max-w-lg w-full mx-auto">
        <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border border-gray-100 rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:30px_30px] animate-pulse"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold mb-3">
                Admin Access
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-10">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="userId"
                  className="text-gray-800 font-semibold text-lg"
                >
                  Admin User ID
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Enter admin user ID"
                    value={loginData.userId}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        userId: e.target.value,
                      })
                    }
                    className="pl-12 h-14 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="password"
                  className="text-gray-800 font-semibold text-lg"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                    className="pl-12 pr-12 h-14 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 hover:from-slate-800 hover:via-blue-800 hover:to-indigo-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg font-semibold mt-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5" />
                    <span>Access Dashboard</span>
                  </div>
                )}
              </Button>

              <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-100">
                <p className="font-medium">
                  Secure admin portal access
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}