"use client"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './style.css';

// import required modules
import {  Pagination,Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { AlbumPhotoCarouselItem } from './AlbumPhotoCarouselItem';
import { TZodPhotoSchema } from '@/lib/mongo/schema/Photo';

export interface IAlbumCarouselProps{
    photos:(TZodPhotoSchema&{_id:string,album?:string})[]
}
export function AlbumCarousel({photos}:IAlbumCarouselProps) {
  

  return (
    <>
      <Swiper
        effect={'fade'}
        grabCursor={true}
        centeredSlides={true}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        slidesPerView={'auto'}
        loop={true}
        autoplay={{
          delay: 5,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Pagination, Autoplay , Navigation]}
        className="mySwiper p-0"
      >{
        photos.map(e=>(<SwiperSlide key={e._id}>
          <AlbumPhotoCarouselItem photo={e}/>
        </SwiperSlide>))
      }
      </Swiper>
    </>
  );
}
