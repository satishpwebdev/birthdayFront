"use client";

import React, { useState, useEffect } from "react";
import { birthdayList } from "./list";
import RibbonOne from "../../../../public/celefloat.png";
import RibbonTwo from "../../../../public/celefloat2.png";
import Image from "next/image";
import axios from "axios";
import { liveUrl } from "@/constants/url";

const BirthdayList = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [currentMonthBirthdays, setCurrentMonthBirthdays] = useState([]);
  const [nextMonthBirthdays, setNextMonthBirthdays] = useState([]);

  const getDataFromApi = async () => {
    try {
      const res = await axios.get(`${liveUrl}/tasks`, {headers: {'x-api-key': 'NEXT_PUBLIC_API_KEY'}
});
      const apiRes = await res.data;
      setBirthdays(apiRes);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    getDataFromApi();
  }, []);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const nextMonth = (currentMonth + 1) % 12;
    const todayString = today.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit"
    });

    // Today's Birthdays

    const todays = birthdays.filter((birthday) => {
      const birthDateString = `${birthday.birthDate} ${today.getFullYear()}`; 
      const birthDate = new Date(birthDateString); 
      return (
        birthDate.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit"
        }) === todayString
      );
    });

    // Current Month Birthdays

    const currentMonthList = birthdays.filter((birthday) => {
      const birthDateString = `${birthday.birthDate} ${today.getFullYear()}`; 
      const birthDate = new Date(birthDateString);
      return birthDate.getMonth() === currentMonth && birthDate >= today; 
    });

    // Next Month Birthdays
    const nextMonthList = birthdays.filter((birthday) => {
      const birthDateString = `${birthday.birthDate} ${today.getFullYear()}`;
      const birthDate = new Date(birthDateString);
      return birthDate.getMonth() === nextMonth; // Check if birthday is in the next month
    });

    // Set the state with filtered birthdays
    setTodaysBirthdays(todays);
    setCurrentMonthBirthdays(currentMonthList);
    setNextMonthBirthdays(nextMonthList);

  }, [birthdays]);


  //Formatting Date to show the users 
  const formatDate = (birthDate) => {
    const [month, day] = birthDate.split(" "); // Split "10 04" into ["10", "04"]
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = parseInt(month, 10) - 1; // Convert "10" to 9 for indexing months
  
    // Convert day to integer for further formatting
    const dayOfMonth = parseInt(day, 10);
  
    // Adding ordinal suffix (st, nd, rd, th)
    let suffix = "th";
    if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) suffix = "st";
    else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) suffix = "nd";
    else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) suffix = "rd";
  
    return `${dayOfMonth}${suffix} ${monthNames[monthIndex]}`; // "4th October"
  };

  return (
    <div className="relative px-4 sm:px-6 lg:px-8" id="birthday-section">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>

      <div className="hidden md:block ribbon absolute top-10 left-10">
        <Image width={160} height={150} src={RibbonOne} alt="Ribbon One" />
      </div>
      <div className="hidden md:block ribbon absolute top-10 right-10">
        <Image width={160} height={150} src={RibbonTwo} alt="Ribbon Two" />
      </div>
      <div className="relative pt-10 sm:pt-18 lg:w-full mx-auto min-h-screen">
        <h1 className="text-gray-900 dark:text-white font-bold text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-center">
          Birthday Reminders
        </h1>
        <p className="mt-4 sm:mt-8 text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl text-center">
          Stay on top of special days with your birthday tracker!
        </p>

        <div className=" relative mt-8 sm:mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 ">
          {/* Today's Birthdays */}
          <div className="p-6 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-md font-semibold text-gray-900 dark:text-white mb-4">
              Today's Birthdays
            </h2>
            <ul>
              {todaysBirthdays.length > 0 ? (
                todaysBirthdays.map((birthday, index) => (
                  <li key={index} className="text-base sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                    🎉 {birthday.firstName} - {formatDate(birthday.birthDate)}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No birthdays today.</li>
              )}
            </ul>
          </div>

          {/* Current Month Birthdays */}
          <div className="p-6 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ">
            <h2 className="text-xl sm:text-md font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Birthdays
            </h2>
            <ul>
              {currentMonthBirthdays.length > 0 ? (
                currentMonthBirthdays.map((birthday, index) => (
                  <li key={index} className="text-base sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                    🎂 {birthday.firstName} {birthday.lastName} - {formatDate(birthday.birthDate)}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No more birthdays this month.</li>
              )}
            </ul>
          </div>

          {/* Next Month Birthdays */}
          <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-md font-semibold text-gray-900 dark:text-white mb-4">
              Next Month Birthdays
            </h2>
            <ul>
              {nextMonthBirthdays.length > 0 ? (
                nextMonthBirthdays.map((birthday, index) => (
                  <li key={index} className="text-base sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                    🎂 {birthday.firstName} {birthday.lastName} - {formatDate(birthday.birthDate)}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No birthdays next month.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayList;
