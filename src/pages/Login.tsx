import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

interface LoginProps {
  onNavigateRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigateRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            TY
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Todofy
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <button
            onClick={onNavigateRegister}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@example.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
