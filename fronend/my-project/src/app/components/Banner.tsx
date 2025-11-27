'use client'

import React from 'react'
import Image from 'next/image'

export default function Banner() {
    return (
        <div className="relative w-full h-[300px] rounded-b-[20px] overflow-hidden shadow-2xl">
            {/* Banner Image */}
            <Image
                src="/img/curtain-image.jpg" // Ensure this path is correct
                alt="Banner Image"
                layout="fill" // Makes the image cover the entire container
                objectFit="cover" // Ensures the image covers the container without distortion
                priority // Optimizes loading for the banner
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            {/* Text Overlay */}
            <div className="absolute top-1/2 left-5 transform -translate-y-1/2 text-white text-left">
                <div className="text-3xl font-bold drop-shadow-lg">
                    Embedded Systems Project
                </div>
                <div className="text-base font-normal mt-2 drop-shadow-md">
                    To control a curtain system via a web interface
                </div>
            </div>
        </div>
    )
}