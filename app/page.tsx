'use client'

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";


type Data = {
  image: string;
  task_id: string;
};

const Page = () => {
  const [data, setData] = useState<Data[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollInterval, setScrollInterval] = useState<any | null>(null);
  const [deg, setDeg] = useState('90');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "https://roop.gokapturehub.com/getImages"
        );
        const { data: newData } = response;

        // Check if the new data is different from the existing data
        if (JSON.stringify(newData) !== JSON.stringify(data)) {
          setData(newData);
        }

        startAutoScroll();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();

    const interval = setInterval(getData, 10000); // Increased interval to 10 seconds
    return () => clearInterval(interval);
  }, [data]); // Added data as a dependency to useEffect

  const startAutoScroll = () => {
    if (!scrollInterval && containerRef.current) {
      const container = containerRef.current;
      const interval = setInterval(() => {
        container.scrollLeft += 1; // Reduced scroll speed
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }, 20); // Increased interval duration

      setScrollInterval(interval);
    }
  };

  const stopAutoScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  const rotatePage = () => {
    if (containerRef.current) {
      containerRef.current.style.transform = `rotate(${deg}deg)`;
      const container = containerRef.current;
      if (deg === '90')
        setDeg('0');
      else
        setDeg('90')
    }
  };

  return (
    <>
      <div className="w-screen h-full p-2" onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
        <img src={'/logo.png'} alt="logo" className="h-14" />
        <div
          className="w-full flex gap-4 p-2 overflow-hidden h-full"
          ref={containerRef}
          style={{ whiteSpace: "nowrap" }}
        >
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center min-w-[250px]">
              <img
                src={item.image}
                className="h-96 object-cover rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        style={{
          color: 'white',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: '999',
        }}
        onClick={rotatePage}
      >
        Rotate
      </button>
    </>
  );
};

export default Page;