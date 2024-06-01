import gsap from "gsap";
 import React from 'react'
 
export const scrollAimation = (position, target, onUpdate) => {
    const tl = gsap.timeline();

tl.to(position, {
        x: -3.38,
        y: -10.74,
        z: -5.93,
        ScrollTrigger: {
            trigget: '.sound-section',
            start: "top bottom ",
            end: "top top",
            scrub: 2,
            immediaRender: false
        },
    onUpdate  
    })
        .to(target, {
        x: 1.52,
        y: 0.77,
        z: -1.08,
        ScrollTrigger: {
            trigget: '.sound-section',
            start: "top bottom ",
            end: "top top",
            scrub: 2,
            immediaRender: false
        },
    })
 }
 

 