"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [selectedModel, setSelectedModel] = useState("Choose Model");
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !email.trim() || !phone.trim() || selectedModel === "Choose Model") {
      setSubmitStatus("error");
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setSelectedModel("Choose Model");
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit form. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/voyah.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/17" />

      {/* Single left-aligned content container - all elements share same left edge */}
      <div 
        className="absolute flex flex-col"
        style={{
          left: '124px',
          right: '124px',
          top: '11.15%',
          bottom: '11.15%',
          gap: 0,
        }}
      >
        {/* Language Selector Button */}
        <div className="flex-none" style={{ marginBottom: 'auto' }}>
          <button 
            className="flex flex-row items-center justify-center box-border"
            style={{
              paddingTop: '6px',
              paddingRight: '18px',
              paddingBottom: '6px',
              paddingLeft: '18px',
              gap: '5px',
              width: 'clamp(100px, 8.13vw, 117px)',
              height: 'clamp(35px, 4.46vh, 40px)',
              background: 'rgba(151, 151, 151, 0.1)',
              border: '0.8px solid #ECECEC',
              borderRadius: '30px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Image
              src="/globe.svg"
              alt="Language"
              width={24}
              height={24}
              className="flex-none"
              style={{ width: 'clamp(20px, 1.67vw, 24px)', height: 'clamp(20px, 1.67vw, 24px)' }}
            />
            <span 
              className="text-[#F4F4F4] font-normal"
              style={{
                fontSize: 'clamp(14px, 1.25vw, 18px)',
                lineHeight: '155.56%',
              }}
            >
              Arabic
            </span>
          </button>
        </div>

        {/* Main content - Logo, COMING SOON, Description - all left aligned */}
        <div 
          className="flex flex-col flex-none"
          style={{
            width: '507px',
            gap: '7px',
            marginBottom: '31px',
          }}
        >
          {/* Logo */}
          <div className="flex-none" style={{ width: '158px', height: '56px' }}>
            <Image
              src="/logo.svg"
              alt="VOYAH Logo"
              width={158}
              height={56}
              className="w-full h-full"
              style={{ objectFit: 'contain', objectPosition: 'left top' }}
            />
          </div>

          {/* Coming Soon Section - Frame 1 */}
          <div
            className="flex flex-col flex-none"
            style={{
              width: '100%',
              gap: '4px',
            }}
          >
            {/* COMING SOON Heading */}
            <h1
              className="text-white font-normal uppercase whitespace-nowrap"
              style={{
                width: '100%',
                height: '60px',
                fontSize: '46px',
                lineHeight: '60px',
                letterSpacing: '4.76px',
                textAlign: 'left',
                fontFamily: 'Inter',
                fontWeight: 400,
                fontStyle: 'normal',
                color: 'rgba(255, 255, 255, 1)',
                margin: 0,
                padding: 0,
              }}
            >
              COMING SOON
            </h1>

            {/* Description Text */}
            <p 
              className="font-normal"
              style={{
                width: '100%',
                fontFamily: 'Inter',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '18px',
                lineHeight: '28px',
                letterSpacing: '0px',
                color: 'rgba(235, 235, 235, 1)',
                textAlign: 'left',
                margin: 0,
                padding: 0,
              }}
            >
              We&apos;re building something beautiful. Leave your details and be
              the first to know when we launch.
            </p>
          </div>
        </div>

        {/* Form Section - same left edge as content above */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[14px] flex-none"
          style={{
            width: '1152px',
          }}
        >
        {/* Container for inputs */}
        <div className="flex flex-row items-center gap-[14px]">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-none outline-none box-border"
            style={{
              width: '224px',
              height: '50px',
              borderRadius: '28px',
              borderWidth: '0.8px',
              paddingTop: '16px',
              paddingRight: '24px',
              paddingBottom: '16px',
              paddingLeft: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '0.8px solid rgba(170, 170, 170, 1)',
              fontFamily: 'Inter',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '-0.31px',
              color: 'rgba(255, 255, 255, 1)',
            }}
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-none outline-none box-border"
            style={{
              width: '224px',
              height: '50px',
              borderRadius: '28px',
              borderWidth: '0.8px',
              paddingTop: '16px',
              paddingRight: '24px',
              paddingBottom: '16px',
              paddingLeft: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '0.8px solid rgba(170, 170, 170, 1)',
              fontFamily: 'Inter',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '-0.31px',
              color: 'rgba(255, 255, 255, 1)',
            }}
          />

          {/* Phone Input */}
          <input
            type="tel"
            placeholder="Your Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="flex-none outline-none box-border"
            style={{
              width: '224px',
              height: '50px',
              borderRadius: '28px',
              borderWidth: '0.8px',
              paddingTop: '16px',
              paddingRight: '24px',
              paddingBottom: '16px',
              paddingLeft: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '0.8px solid rgba(170, 170, 170, 1)',
              fontFamily: 'Inter',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '-0.31px',
              color: 'rgba(255, 255, 255, 1)',
            }}
          />

          {/* Model Dropdown */}
          <div ref={dropdownRef} className="flex-none relative" style={{ width: '224px', height: '50px' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full h-full flex flex-row items-center justify-between outline-none box-border cursor-pointer transition-all duration-200"
              style={{
                borderRadius: '28px',
                borderWidth: '0.8px',
                paddingTop: '16px',
                paddingRight: '24px',
                paddingBottom: '16px',
                paddingLeft: '24px',
                background: showDropdown ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                border: '0.8px solid rgba(170, 170, 170, 1)',
                fontFamily: 'Inter',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '100%',
                letterSpacing: '-0.31px',
                color: 'rgba(255, 255, 255, 1)',
              }}
              onMouseEnter={(e) => {
                if (!showDropdown) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(200, 200, 200, 1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showDropdown) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(170, 170, 170, 1)';
                }
              }}
            >
              <span 
                className="flex-none transition-opacity duration-200"
                style={{ 
                  opacity: selectedModel === 'Choose Model' ? 0.7 : 1 
                }}
              >
                {selectedModel}
              </span>
              <ChevronDown
                className="flex-none transition-transform duration-200"
                style={{ 
                  width: '8px',
                  height: '16px',
                  transform: showDropdown ? 'rotate(270deg)' : 'rotate(90deg)',
                  opacity: 0.8,
                }}
              />
            </button>
            {showDropdown && (
              <div 
                className="absolute bottom-[54px] left-0 w-full z-20 overflow-hidden"
                style={{
                  background: 'rgba(20, 20, 20, 0.98)',
                  border: '0.8px solid rgba(170, 170, 170, 0.6)',
                  borderRadius: '12px',
                  boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                  backdropFilter: 'blur(20px)',
                  animation: 'dropdownFadeInUp 0.2s ease-out',
                }}
              >
                {["FREE", "DREAM"].map((model, index) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left transition-all duration-150 relative"
                    style={{
                      paddingTop: '14px',
                      paddingRight: '24px',
                      paddingBottom: '14px',
                      paddingLeft: '24px',
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '19px',
                      letterSpacing: '-0.31px',
                      color: selectedModel === model ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: index < 2 ? '0.8px solid rgba(170, 170, 170, 0.15)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = selectedModel === model ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)';
                    }}
                  >
                    {model}
                    {selectedModel === model && (
                      <span 
                        className="absolute right-[24px] top-1/2 -translate-y-1/2"
                        style={{
                          fontSize: '12px',
                          opacity: 0.6,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* NOTIFY ME Button */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex flex-row items-center justify-center flex-none box-border outline-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            paddingTop: '13px',
            paddingRight: '55px',
            paddingBottom: '13px',
            paddingLeft: '55px',
            gap: '10px',
            width: '212px',
            height: '50px',
            background: isSubmitting ? 'rgba(151, 151, 151, 0.3)' : 'rgba(151, 151, 151, 0.2)',
            border: '0.8px solid rgba(170, 170, 170, 1)',
            borderRadius: '80px',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = 'rgba(151, 151, 151, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(200, 200, 200, 1)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = 'rgba(151, 151, 151, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(170, 170, 170, 1)';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
          onMouseDown={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
        >
          <span 
            className="text-white font-medium text-center uppercase"
            style={{
              fontSize: 'clamp(14px, 1.25vw, 18px)',
              lineHeight: '133.33%'
            }}
          >
            {isSubmitting ? "SUBMITTING..." : "NOTIFY ME"}
          </span>
        </button>
        </div>

        {/* Status Messages */}
        {submitStatus && (
          <div 
            className="flex-none"
            style={{
              width: '100%',
              paddingTop: '12px',
              paddingLeft: '0px',
            }}
          >
            <div
              className="text-left"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                lineHeight: '20px',
                color: submitStatus === 'success' ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)',
              }}
            >
              {submitStatus === 'success' 
                ? '✓ Thank you! We\'ll notify you when we launch.'
                : `✗ ${errorMessage}`
              }
            </div>
          </div>
        )}
        </form>
      </div>
    </div>
  );
}
