"use client"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './style.css';

// import required modules
import { EffectCoverflow, Pagination,Autoplay } from 'swiper/modules';
import { AlbumPhotoCarouselItem } from './AlbumPhotoCarouselItem';
import { TZodPhotoSchema } from '@/lib/mongo/schema/Photo';

export interface IAlbumCarouselProps{
    photos:(TZodPhotoSchema&{_id:string,album?:string})[]
}
export function AlbumCarousel({photos}:IAlbumCarouselProps) {
  

  return (
    <>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >{
        photos.map(e=>(<SwiperSlide key={e._id}>
          <AlbumPhotoCarouselItem photo={e}/>
        </SwiperSlide>))
      }
      </Swiper>
    </>
  );
}
