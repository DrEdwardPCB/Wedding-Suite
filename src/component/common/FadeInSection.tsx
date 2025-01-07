/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
import { isNil } from "lodash";
import { useRef, useState, useEffect } from "react";
export const FadeInSection = ({
    children, className,
    onClick
  }:{children:JSX.Element|JSX.Element[], className:string, onClick?:()=>void}) => {
    const domRef = useRef<JSX.Element>();
    
    const [isVisible, setVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(entries => {
        // In your case there's only one element to observe:     
        if (entries[0].isIntersecting) {
        
          // Not possible to set it back to false like this:
          setVisible(true);
          
          // No need to keep observing:
          //@ts-expect-error
          observer.unobserve(domRef.current);
        }
      });
        //@ts-expect-error
      observer.observe(domRef.current);
      
      return () => observer.disconnect();
    }, []);
          //@ts-expect-error
    return (<section onClick={()=>{if(isNil(onClick)){return}else{onClick()} }}ref={ domRef } className={ isVisible ? `is-visible ${className}` : `not-visible ${className}` }>{ children }</section>);
  };