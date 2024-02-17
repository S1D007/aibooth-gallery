"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';

type Data = {
    image: string;
    task_id: string;
  };
  
  const socket = io("https://socket-aibooth.gokapturehub.com");
  socket.on("connect", () => {
    console.log("connected");
  });
  

const Page = () => {
    const [data, setData] = useState<Data[]>([]);
    // const containerRef = useRef<HTMLDivElement>(null);
    // const [scrollInterval, setScrollInterval] = useState<any | null>(null);
    // const [deg, setDeg] = useState("90");
  
    socket.on("gallery", (msg) => {
      console.log(msg);
    });
  
    socket.onAny((eventName, ...args) => {
      const tmp = [...data];
      args.map((image: string) => {
        tmp.unshift({ image: image, task_id: "gallery" });
      });
      setData(tmp);
    });
  
    useEffect(() => {
      const getData = async () => {
        try {
          const response = await axios.get(
            "https://roop.gokapturehub.com/getImages"
          );
          const { data: newData } = response;
  
          // Check if the new data is different from the existing data
          if (JSON.stringify(newData) !== JSON.stringify(data)) {
            setData(newData.reverse());
          }
           
        //   console.log(data);
  
        //   startAutoScroll();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      getData();

    }, []);
  return (
    <div className=' w-full h-[100vh] flex justify-center items-center ' >
        <div
         className="chars
                    overflow-x-scroll 
                    gap-4
                    flex flex-row 
                    flex-wrap 
                    justify-center items-center rounded-[1rem] p-4 bg-[#ffff] h-[80%] w-[70%] "
        >
        {   
            data.map((item,id) => (
                <div key={id} className="  w-[14rem] h-[17rem] rounded-2xl overflow-hidden  " >
                    <img 
                      //  onClick={() => {
                      //   setSelected(char);
                      // }}
                      className=" h-full w-full object-cover "
                      src={item.image} 
                      alt="" 
                      // style={{  opacity: char === selected ? 1 : 0.7, }}
                    />
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default Page