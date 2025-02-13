import dayjs from "dayjs"
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
// import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
// import WineBarIcon from '@mui/icons-material/WineBar';
// import { GiDiamondRing } from "react-icons/gi";
// import { FaPhotoVideo } from "react-icons/fa";
// import { MdDinnerDining } from "react-icons/md";
// import { SlSpeech } from "react-icons/sl";
// import { GiStairsCake } from "react-icons/gi";

dayjs.extend(CustomParseFormat)
export default async function RundownPage(){
    return <div></div>
}

// const Rundown = [
//     {
//         time:dayjs("2025-08-03,15:00:00","YYYY-MM-DD,HH:mm:ss"),
//         icon:
//         title:"Immediate Family Photo",
//         details:null
//     },
//     {
//         time:
//         icon:""
//         title:"Ceremony"
//         details:null
//     }
// ]