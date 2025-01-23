/* eslint-disable @next/next/no-img-element */
export default function RSVPLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[100vh] w-[100vw] from-[#F8F4E3] to bg-[#D4CDC3] bg-gradient-to-br relative p-2 flex flex-col items-stretch overflow-hidden relative flex flex-col justify-center items-center">
        <div className="absolute flex top-0 left-0 right-0 bottom-0 p-4">
            <div className="flex-1 relative">
                {/* Top border */}
                <div className="absolute top-0 right-0 left-[10%] h-0.5 bg-[#D59D77] width-auto" />
                
                {/* Right border */}
                <div className="absolute top-0 right-0 w-0.5 h-full bg-[#D59D77]" />
                
                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 h-0.5 w-full h-0.5 bg-[#D59D77]" />
                
                {/* Left border */}
                <div className="absolute bottom-0 left-0 w-0.5 bg-[#D59D77]" style={{ height: '90%' }} />
                
                {/* Diagonal border */}
                <div className="absolute top-0 bottom-[90%] left-0 right-[90%] bg-[#D59D77] [clip-path:polygon(0%_100%,0.125rem_100%,100%_0.125rem,100%_0%)]"/>
        </div>
    </div>
    <div className="absolute flex top-0 left-0 right-0 bottom-0 p-6">
            <div className="flex-1 relative">
                {/* Top border */}
                <div className="absolute top-0 right-0 left-0 h-0.5 bg-[#D59D77]" />
                
                {/* Right border */}
                <div className="absolute top-0 right-0 w-0.5 bottom-[10%]  bg-[#D59D77]" />
                
                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 h-0.5 right-[10%] bg-[#D59D77]" />
                
                {/* Left border */}
                <div className="absolute bottom-0 left-0 h-full w-0.5 bg-[#D59D77]" />
                
                {/* Diagonal border */}
                <div className="absolute top-[90%] bottom-0 right-0 left-[90%] bg-[#D59D77] " style={{clipPath:"polygon(0% 100%, 0% calc(100% - 2px), calc(100% - 2px) 0%, 100% 0%)"}}/>
        </div>
    </div>
    <div className="absolute flex top-0 bottom-0 left-0 right-0 bottom-0 ">
        <div className="h-full w-full relative">
            <img className="absolute right-[-25px] top-[-25px] sm:right-[-25px] sm:top-[-75px] w-32 sm:w-52 rotate-[180deg] aspect-square" src="/sprite/plantCorner2.png"></img>
            <img className="absolute left-[-5px] bottom-[-50px] sm:left-[-5px] sm:bottom-[-100px]  w-40 sm:w-72 rotate-[15deg] aspect-square" src="/sprite/plantCorner2.png"></img>
        </div>
    </div>
            <div className="flex-1">

                {children}
            </div>
    </div>
  );
}
