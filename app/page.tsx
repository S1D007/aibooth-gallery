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


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "https://roop.gokapturehub.com/getImages"
        );
        const { data } = response;
        setData(data);
        startAutoScroll();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
    const interval = setInterval(getData, 1000);
    return () => clearInterval(interval);
  }, []);

  const startAutoScroll = () => {
    if (!scrollInterval && containerRef.current) {
      const container = containerRef.current;
      const interval = setInterval(() => {
        container.scrollLeft += 2;
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }, 20); // Adjust scroll speed as needed

      setScrollInterval(interval);
    }
  };

  const stopAutoScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  return (
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
  );
};

export default Page;