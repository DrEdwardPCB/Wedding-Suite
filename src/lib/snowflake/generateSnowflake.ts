"use server"
import Snowflakify, {
    TimestampFragment,
    NetworkFragment,
    SequenceFragment,
  } from 'snowflakify';
  
  const CUSTOM_EPOCH = 1262304001000;
  
const snowflakify = new Snowflakify({
    fragmentArray: [
      new TimestampFragment(42, CUSTOM_EPOCH),
      new NetworkFragment(10, 'ipv4'),
      new SequenceFragment(12),
    ],
  });

  export const newSnowflakeId = async ()=>{
    return snowflakify.nextId().toString()
  }