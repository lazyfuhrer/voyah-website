"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

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
  const isMobile = useMobile();

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

    if (!name.trim() || !email.trim() || !phone.trim() || selectedModel === "Choose Model") {
      setSubmitStatus("error");
      setErrorMessage("Please fill in all fields");
      return;
    }

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
        setName("");
        setEmail("");
        setPhone("");
        setSelectedModel("Choose Model");
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit form. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile layout – 430×932 Figma artboard (English)
  if (isMobile) {
    // Pixel-perfect positions from Figma artboard (430×932)
    const frame1Top = 466;
    const formTop = 650;

    return (
      <div
        className="relative bg-black overflow-x-hidden mobile-coming-soon"
        style={{ width: "100%", minHeight: "100vh" }}
      >
        {/* Background video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/voyah-mobile.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Top and bottom gradients */}
        <div
          className="absolute left-0 top-0 w-full"
          style={{
            height: 391,
            background:
              "linear-gradient(217.36deg, #000000 -42.1%, rgba(0, 0, 0, 0.659361) 14.01%, rgba(0, 0, 0, 0) 55.58%)",
          }}
        />
        <div
          className="absolute left-0 w-full"
          style={{
            height: 391,
            bottom: -28,
            background:
              "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.659361) 54.27%, rgba(0, 0, 0, 0) 100%)",
            transform: "matrix(1, 0, 0, -1, 0, 0)",
          }}
        />

        {/* 430×932 content frame */}
        <div
          className="relative z-10"
          style={{
            width: 430,
            maxWidth: "100%",
            height: 932,
            margin: "0 auto",
          }}
        >
          {/* Language pill */}
          <Link
            href="/ar"
            className="absolute flex flex-row items-center justify-center box-border"
            style={{
              width: 99,
              height: 35,
              left: 297,
              top: 58,
              padding: "6px 18px",
              gap: 5,
              background: "rgba(255, 255, 255, 0.1)",
              border: "0.8px solid #ECECEC",
              borderRadius: 30,
            }}
          >
            <Image
              src="/globe.svg"
              alt="Language"
              width={18}
              height={18}
            />
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "23px",
                letterSpacing: -0.449219,
                color: "#F4F4F4",
              }}
            >
              Arabic
            </span>
          </Link>

          {/* Frame 1 – logo + heading + copy */}
          <div
            className="absolute flex flex-col items-center"
            style={{
              width: 361,
              height: 160,
              left: 35,
              top: frame1Top,
              gap: 8,
            }}
          >
            <div style={{ width: 143, height: 50 }}>
              <Image
                src="/logo.svg"
                alt="VOYAH Logo"
                width={143}
                height={50}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div
              className="flex flex-col items-center"
              style={{ width: 361, height: 103 }}
            >
              <h1
                className="text-white uppercase"
                style={{
                  width: 312,
                  height: 60,
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: 36,
                  lineHeight: "60px",
                  letterSpacing: 4.76,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  margin: "-2px 0 6px",
                }}
              >
                COMING SOON
              </h1>
              <p
                style={{
                  width: 361,
                  height: 48,
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "24px",
                  textAlign: "center",
                  color: "#EBEBEB",
                }}
              >
                We&apos;re building something beautiful. Leave your details and
                be the first to know when we launch.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="absolute flex flex-col"
            style={{
              width: 305,
              height: 231,
              left: 62,
              top: formTop,
              gap: 12,
            }}
          >
            <div
              className="flex flex-col"
              style={{ width: 305, height: 180, gap: 8 }}
            >
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="outline-none box-border w-full"
                style={{
                  height: 39,
                  padding: "12px 24px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "0.8px solid #AAAAAA",
                  borderRadius: 28,
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: "15px",
                  letterSpacing: -0.3125,
                  color: "#FFFFFF",
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="outline-none box-border w-full"
                style={{
                  height: 39,
                  padding: "12px 24px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "0.8px solid #AAAAAA",
                  borderRadius: 28,
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: "15px",
                  letterSpacing: -0.3125,
                  color: "#FFFFFF",
                }}
              />
              <input
                type="tel"
                placeholder="Your Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="outline-none box-border w-full"
                style={{
                  height: 39,
                  padding: "12px 24px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "0.8px solid #AAAAAA",
                  borderRadius: 28,
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: "15px",
                  letterSpacing: -0.3125,
                  color: "#FFFFFF",
                }}
              />
              <div
                ref={dropdownRef}
                className="relative w-full"
                style={{ height: 39 }}
              >
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full h-full flex flex-row justify-between items-center outline-none box-border cursor-pointer"
                  style={{
                    padding: "12px 24px",
                    gap: 26,
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "0.8px solid #AAAAAA",
                    borderRadius: 28,
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: 12,
                    lineHeight: "15px",
                    letterSpacing: -0.3125,
                    color: "#FFFFFF",
                  }}
                >
                  <span style={{ margin: "0 auto" }}>{selectedModel}</span>
                  <ChevronDown
                    style={{
                      width: 8,
                      height: 16,
                      transform: showDropdown ? "rotate(270deg)" : "rotate(90deg)",
                    }}
                  />
                </button>
                {showDropdown && (
                  <div
                    className="absolute left-0 w-full z-20 overflow-hidden"
                    style={{
                      bottom: 44,
                      background: "rgba(20, 20, 20, 0.98)",
                      border: "0.8px solid rgba(170, 170, 170, 0.6)",
                      borderRadius: 12,
                      boxShadow:
                        "0 -8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {["FREE", "DREAM"].map((model, index) => (
                      <button
                        key={model}
                        type="button"
                        onClick={() => {
                          setSelectedModel(model);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left relative"
                        style={{
                          paddingTop: 14,
                          paddingRight: 24,
                          paddingBottom: 14,
                          paddingLeft: 24,
                          fontFamily: "Inter",
                          fontWeight: 400,
                          fontSize: 12,
                          lineHeight: "19px",
                          letterSpacing: -0.3125,
                          color:
                            selectedModel === model
                              ? "rgba(255, 255, 255, 1)"
                              : "rgba(255, 255, 255, 0.9)",
                          background: "transparent",
                          border: "none",
                          borderBottom:
                            index < 2
                              ? "0.8px solid rgba(170, 170, 170, 0.15)"
                              : "none",
                        }}
                      >
                        {model}
                        {selectedModel === model && (
                          <span
                            className="absolute"
                            style={{
                              right: 24,
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: 12,
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
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-row justify-center items-center outline-none cursor-pointer disabled:opacity-50 w-full"
              style={{
                height: 39,
                padding: "12px 55px",
                gap: 10,
                background: "rgba(13, 14, 15, 0.2)",
                borderRadius: 80,
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: 12,
                lineHeight: "15px",
                textAlign: "center",
                letterSpacing: 0.4875,
                color: "#FFFFFF",
              }}
            >
              {isSubmitting ? "SUBMITTING..." : "NOTIFY ME"}
            </button>

            {submitStatus && (
              <div
                className="text-center"
                style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  lineHeight: "20px",
                  color:
                    submitStatus === "success"
                      ? "rgba(76, 175, 80, 1)"
                      : "rgba(244, 67, 54, 1)",
                }}
              >
                {submitStatus === "success"
                  ? "Thank you! We'll notify you when we launch."
                  : errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Desktop layout – original design (unchanged)
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
          left: "124px",
          right: "124px",
          top: "11.15%",
          bottom: "11.15%",
          gap: 0,
        }}
      >
        {/* Language Selector Button */}
        <div className="flex-none" style={{ marginBottom: "auto" }}>
          <Link
            href="/ar"
            className="flex flex-row items-center justify-center box-border"
            style={{
              paddingTop: 6,
              paddingRight: 18,
              paddingBottom: 6,
              paddingLeft: 18,
              gap: 5,
              width: "clamp(100px, 8.13vw, 117px)",
              height: "clamp(35px, 4.46vh, 40px)",
              background: "rgba(151, 151, 151, 0.1)",
              border: "0.8px solid #ECECEC",
              borderRadius: 30,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <Image
              src="/globe.svg"
              alt="Language"
              width={24}
              height={24}
              style={{
                width: "clamp(20px, 1.67vw, 24px)",
                height: "clamp(20px, 1.67vw, 24px)",
              }}
            />
            <span
              className="text-[#F4F4F4] font-normal"
              style={{
                fontSize: "clamp(14px, 1.25vw, 18px)",
                lineHeight: "155.56%",
              }}
            >
              Arabic
            </span>
          </Link>
        </div>

        {/* Main content - Logo, COMING SOON, Description - all left aligned */}
        <div
          className="flex flex-col flex-none"
          style={{
            width: 507,
            gap: 7,
            marginBottom: 31,
          }}
        >
          {/* Logo */}
          <div className="flex-none" style={{ width: 158, height: 56 }}>
            <Image
              src="/logo.svg"
              alt="VOYAH Logo"
              width={158}
              height={56}
              className="w-full h-full"
              style={{ objectFit: "contain", objectPosition: "left top" }}
            />
          </div>

          {/* Coming Soon Section - Frame 1 */}
          <div
            className="flex flex-col flex-none"
            style={{
              width: "100%",
              gap: 4,
            }}
          >
            {/* COMING SOON Heading */}
            <h1
              className="text-white font-normal uppercase whitespace-nowrap"
              style={{
                width: "100%",
                height: 60,
                fontSize: 46,
                lineHeight: "60px",
                letterSpacing: 4.76,
                textAlign: "left",
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                color: "rgba(255, 255, 255, 1)",
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
                width: "100%",
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: 18,
                lineHeight: "28px",
                letterSpacing: 0,
                color: "rgba(235, 235, 235, 1)",
                textAlign: "left",
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
            width: 1152,
          }}
        >
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
                width: 224,
                height: 50,
                borderRadius: 28,
                borderWidth: 0.8,
                paddingTop: 16,
                paddingRight: 24,
                paddingBottom: 16,
                paddingLeft: 24,
                background: "rgba(255, 255, 255, 0.1)",
                border: "0.8px solid rgba(170, 170, 170, 1)",
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: 16,
                lineHeight: "100%",
                letterSpacing: -0.31,
                color: "rgba(255, 255, 255, 1)",
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
                width: 224,
                height: 50,
                borderRadius: 28,
                borderWidth: 0.8,
                paddingTop: 16,
                paddingRight: 24,
                paddingBottom: 16,
                paddingLeft: 24,
                background: "rgba(255, 255, 255, 0.1)",
                border: "0.8px solid rgba(170, 170, 170, 1)",
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: 16,
                lineHeight: "100%",
                letterSpacing: -0.31,
                color: "rgba(255, 255, 255, 1)",
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
                width: 224,
                height: 50,
                borderRadius: 28,
                borderWidth: 0.8,
                paddingTop: 16,
                paddingRight: 24,
                paddingBottom: 16,
                paddingLeft: 24,
                background: "rgba(255, 255, 255, 0.1)",
                border: "0.8px solid rgba(170, 170, 170, 1)",
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: 16,
                lineHeight: "100%",
                letterSpacing: -0.31,
                color: "rgba(255, 255, 255, 1)",
              }}
            />

            {/* Model Dropdown */}
            <div
              ref={dropdownRef}
              className="flex-none relative"
              style={{ width: 224, height: 50 }}
            >
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full h-full flex flex-row items-center justify-between outline-none box-border cursor-pointer transition-all duration-200"
                style={{
                  borderRadius: 28,
                  borderWidth: 0.8,
                  paddingTop: 16,
                  paddingRight: 24,
                  paddingBottom: 16,
                  paddingLeft: 24,
                  background: showDropdown
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.1)",
                  border: "0.8px solid rgba(170, 170, 170, 1)",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: 16,
                  lineHeight: "100%",
                  letterSpacing: -0.31,
                  color: "rgba(255, 255, 255, 1)",
                }}
              >
                <span
                  className="flex-none"
                  style={{
                    opacity: selectedModel === "Choose Model" ? 0.7 : 1,
                  }}
                >
                  {selectedModel}
                </span>
                <ChevronDown
                  className="flex-none"
                  style={{
                    width: 8,
                    height: 16,
                    transform: showDropdown ? "rotate(270deg)" : "rotate(90deg)",
                    opacity: 0.8,
                  }}
                />
              </button>
              {showDropdown && (
                <div
                  className="absolute bottom-[54px] left-0 w-full z-20 overflow-hidden"
                  style={{
                    background: "rgba(20, 20, 20, 0.98)",
                    border: "0.8px solid rgba(170, 170, 170, 0.6)",
                    borderRadius: 12,
                    boxShadow:
                      "0 -8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {["FREE", "DREAM"].map((model, index) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left relative"
                      style={{
                        paddingTop: 14,
                        paddingRight: 24,
                        paddingBottom: 14,
                        paddingLeft: 24,
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: "19px",
                        letterSpacing: -0.31,
                        color:
                          selectedModel === model
                            ? "rgba(255, 255, 255, 1)"
                            : "rgba(255, 255, 255, 0.9)",
                        background: "transparent",
                        border: "none",
                        borderBottom:
                          index < 2
                            ? "0.8px solid rgba(170, 170, 170, 0.15)"
                            : "none",
                      }}
                    >
                      {model}
                      {selectedModel === model && (
                        <span
                          className="absolute"
                          style={{
                            right: 24,
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: 12,
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
                paddingTop: 13,
                paddingRight: 55,
                paddingBottom: 13,
                paddingLeft: 55,
                gap: 10,
                width: 212,
                height: 50,
                background: isSubmitting
                  ? "rgba(151, 151, 151, 0.3)"
                  : "rgba(151, 151, 151, 0.2)",
                border: "0.8px solid rgba(170, 170, 170, 1)",
                borderRadius: 80,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <span
                className="text-white font-medium text-center uppercase"
                style={{
                  fontSize: "clamp(14px, 1.25vw, 18px)",
                  lineHeight: "133.33%",
                }}
              >
                {isSubmitting ? "SUBMITTING..." : "NOTIFY ME"}
              </span>
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus && (
            <div
              style={{
                width: "100%",
                paddingTop: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  lineHeight: "20px",
                  color:
                    submitStatus === "success"
                      ? "rgba(76, 175, 80, 1)"
                      : "rgba(244, 67, 54, 1)",
                }}
              >
                {submitStatus === "success"
                  ? "✓ Thank you! We'll notify you when we launch."
                  : `✗ ${errorMessage}`}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

