import React, { useState } from "react";
import { Button } from "../../components/student/button";
import { Input } from "../../components/student/input";
import { Label } from '../../components/student/label';
import { User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  onLogin: () => void;
  onPageChange?: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onPageChange }) => {
  const [loginData, setLoginData] = useState({ userId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage('');
  if (!loginData.userId || !loginData.password) {
    setErrorMessage('Please fill in all required fields');
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch(`http://localhost:8080/api/students/login?email=${encodeURIComponent(loginData.userId)}&password=${encodeURIComponent(loginData.password)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      setErrorMessage('Invalid email or password. Please check your credentials and try again.');
      setIsLoading(false);
      return;
    }

    toast.success('Login successful! Redirecting...');
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);

  } catch (error) {
    setErrorMessage('Login error. Please try again later.');
    setIsLoading(false);
  }
};


  const handleForgotPassword = () => {
    toast('Password recovery flow coming soon!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden p-8">

        {onPageChange && (
          <div className="flex justify-start mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange('landing')}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Student Login</h2>
          <p className="text-gray-600 mt-1">Enter your credentials to access your dashboard</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID / Roll Number</Label>
            <Input
              id="userId"
              type="text"
              placeholder="Enter your user ID"
              value={loginData.userId}
              onChange={(e) => setLoginData({ ...loginData, userId: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            className={`w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
};
