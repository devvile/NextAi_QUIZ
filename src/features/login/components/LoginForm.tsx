"use client"
import React, { useState } from 'react';
import InputField from './InputField';
import PasswordField from './PasswordField';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string; keepLoggedIn: boolean; isSignIn: boolean }) => void;
  onGoogleSignIn: () => void;
  onForgotPassword: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onAboutClick?: () => void;
}

export default function LoginForm({
  onSubmit,
  onGoogleSignIn,
  onForgotPassword,
  onPrivacyClick,
  onTermsClick,
  onAboutClick
}: LoginFormProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, keepLoggedIn, isSignIn });
  };

  return (
    <div className="w-full lg:w-1/3 flex items-center justify-center p-8" style={{ backgroundColor: '#313A4B' }}>
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="email"
            label="Your email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="bob.888@gmail.com"
            required
          />

          <PasswordField
            id="password"
            label="Your password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />
        </form>
      </div>
    </div>
  );
}