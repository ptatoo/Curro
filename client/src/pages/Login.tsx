import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../context/UserContext";

const Login = () => {
  const { login } = useAuth();
  const { jwtToken, profile } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-foreground mb-2">Welcome to RunTogether</h1>
          <p className="text-muted-foreground">Join the running community</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:opacity-90 transition-opacity"
            onClick={handleSubmit}
          >
            Sign In With Google
          </button>

          <div className="mt-4 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account? Jwt:{jwtToken} Profile:{" "}
              {JSON.stringify(profile)}
              <button className="text-primary hover:underline">Sign up</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
