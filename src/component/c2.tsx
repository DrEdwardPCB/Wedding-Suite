/* eslint-disable react-hooks/rules-of-hooks */
//component2 that uses redux
'use client'

import { decrement, increment } from "@/lib/redux/features/counter/counterSlice"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hook"

export default function C2 (){
    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()
    return (
        <div className="flex items-center justify-center">
            <button onClick={()=>dispatch(increment())}>+</button>
            <button onClick={()=>dispatch(decrement())}>-</button>
            <p>{count}</p>
        </div>
    )
}