"use client"
import React from 'react';
import VideoBackground from '../../features/login/components/VideoBackground'
import LoginForm from '../../features/login/components/LoginForm';

export default function LoginPage() {
    const handleFormSubmit = (data: { email: string; password: string; keepLoggedIn: boolean; isSignIn: boolean }) => {
        console.log('Form submitted:', data);
    };

    const handleGoogleSignIn = () => {
        console.log('Google sign in clicked');
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');

    };

    const handlePrivacyClick = () => {
        console.log('Privacy clicked');
    };

    const handleTermsClick = () => {
        console.log('Terms clicked');
    };

    const handleAboutClick = () => {
        console.log('About clicked');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #2E3649 0%, #1a1f2e 100%)' }}>
            <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex" style={{ backgroundColor: '#313A4B' }}>
                <VideoBackground videoSrc="/dama1.mp4" />
                <LoginForm
                    onSubmit={handleFormSubmit}
                    onGoogleSignIn={handleGoogleSignIn}
                    onForgotPassword={handleForgotPassword}
                    onPrivacyClick={handlePrivacyClick}
                    onTermsClick={handleTermsClick}
                    onAboutClick={handleAboutClick}
                />
            </div>
        </div>
    );
}