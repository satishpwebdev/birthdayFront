import React, { useEffect, useState } from "react";
// import "./Typewriter.css"; // Optional CSS

export const Typewriter = ({
  texts = ["Happy Birthday!"],
  colors = ["text-purple-500"],
  speed = 100,
  eraseSpeed = 50,
  delay = 1000,
  loop = true
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timer;

    if (isTyping) {
      if (charIndex < texts[textIndex].length) {
        timer = setTimeout(() => {
          setDisplayedText((prev) => prev + texts[textIndex][charIndex]);
          setCharIndex(charIndex + 1);
        }, speed);
      } else {
        timer = setTimeout(() => setIsTyping(false), delay);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setCharIndex(charIndex - 1);
        }, eraseSpeed);
      } else {
        setIsTyping(true);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isTyping, textIndex, texts, speed, eraseSpeed, delay]);

  useEffect(() => {
    if (!loop && textIndex === texts.length - 1 && charIndex === texts[textIndex].length && !isTyping) {
      setIsTyping(false);
    }
  }, [loop, textIndex, charIndex, texts, isTyping]);

  const currentColor = colors[textIndex % colors.length] || "text-purple-500";

  return (
    <span className={`typewriter ${currentColor} font-semibold text-3xl`}>
      {displayedText}
      <span className="cursor">|</span>
    </span>
  );
};
