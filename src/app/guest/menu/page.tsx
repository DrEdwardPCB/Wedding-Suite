import { getSession } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
export default async function MenuPage(){
    const session = await getSession();
            if(!session.userid||session.isAdmin||!session.isLoggedIn){
                redirect("/guest/auth/signin")
            }
    const renderFood = (foodSection:Record<string,any>)=>{
        return(
            <div className="pt-10">
                <h1 className="uppercase text-base font-zapfino">
                    {foodSection.name}
                </h1>
                {foodSection.food.map((e:Record<string,any>,i:number,arr:any[])=>{
                    return(
                        <div key={e.name} className="font-bevietnam mt-2">
                            <h2 className="text-base font-bold">{e.name}</h2>
                            <p className=" text-xs italic"> {e.description}</p>
                            {(i<(arr.length-1))?<p className="text-xs font-thin">{foodSection.relationship}</p>:<></>}
                        </div>
                    )
                })}
                {foodSection.remarks?<p className="text-xs font-sans font-bold italic p-2 ">{`*${foodSection.remarks}`}</p>:<></>}
            </div>
        )
    }
    const renderDrinks = (drinks:Record<string,any>)=>{
        return(
            <div className="pt-8">
                <h1 className="uppercase text-base font-bevietnam font-bold">
                    {drinks.type}
                </h1>
                {drinks.choice.map((e:string)=>{
                    return(
                        <div key={e} className="font-bevietnam mt-2">
                            <h2 className="text-xs">{e}</h2>
                        </div>
                    )
                })}
            </div>
        )
    }
    return(
    <div className="h-[80vh] overflow-y-auto overflow-x-hidden my-4">

        <div className="flex flex-col text-center">
            <div>
                    <h2 className="text-base pb-2">AUG 03 . 2025</h2>
                <hr className="border-themeReg mx-16"/>
                    <h1 className="font-modelsignature text-6xl p-4">Menu</h1>
                <hr className="border-themeReg mx-16"/>
            </div>
            <div className="flex flex-col">
                {FoodMenu.section.map(e=>{return(
                    <>{renderFood(e)}</>
                )})}
            </div>
            <hr className="border-themeReg mx-16 mt-3"/>
            <h1 className="font-modelsignature text-6xl p-4">Drinks</h1>
            <hr className="border-themeReg mx-16"/>
            <div className="flex flex-col grid grid-cols-2">
                {DrinkMenu.map(e=>{
                    return(
                        <>{renderDrinks(e)}</>
                    )
                })}
            </div>
        </div>
    </div>
    )
}

const FoodMenu = {
    section:[
        {
            name: "Hors D'oeuvres",
            relationship:"and",
            food:[
                {
                    name: "Mini Beef Wellington",
                    description:"Braised Beef Folded With Mushrooms And Wrapped In Puff Pastry",
                    label:[]
                },
                {
                    name: "Smoked Salmon Tart",
                    description:"Smoked Salmon With Chive And Garlic Cream Cheese in A Crispy Tart Shell",
                    label:[]
                },
                {
                    name: "Brie Bites",
                    description:"Flaky Puff Pastry Filled With Cranberry And Brie",
                    label:["VE"],
                },
                {
                    name: "Maple Dates",
                    description:"Goat Cheese Stuffed Dates Wrapped With Bacon And Glazed With Maple Syrup",
                    label:["GF"],
                }
            ],
            remarks:null,
        },
        {
            name: "Appetizer",
            relationship:"and",
            food:[
                {
                    name: "Caesar Salad",
                    description:"Hearts of Romaine, Shaved Parmesan, Bacon, Herbed Croutons And Creamy Garlic Dressing",
                    label:[]
                },
                
            ],
            remarks:null,
        },
        {
            name: "Palate Cleansers",
            relationship:"and",
            food:[
                {
                    name: "Raspberry Sorbet",
                    description:null,
                    label:[]
                },
            ],
            remarks:null,
        },
        {
            name: "Entrée",
            relationship:"or",
            food:[
                {
                    name: "Surf & Turf",
                    description:"Panko Crusted Cod Loin With Grilled Shrimp And Lobster Sauce",
                    label:[]
                },
                {
                    name: "Short Rib",
                    description:"Slow Braised Beef Short Rib In A Red Wine Sauce",
                    label:[]
                },
                {
                    name: "Parmigiana",
                    description:"Breaded Eggplant Layered With Tomato Sauce And Mozzarella Nestled On Soft Polenta",
                    label:["VG"]
                },
                
            ],
            remarks:"All Entrée are served with Roast Potatoes and Vegetables Medley",
        },
        {
            name: "Dessert",
            relationship:"and",
            food:[
                {
                    name: "Chocolate Mousse",
                    description:"French Stule Dessert Made Of Layers Of Silky White Milk And Dark Chocolate Mousse",
                    label:[]
                },
                
            ],
            remarks:null,
        },
        {
            name: "Late night stations",
            relationship:"and",
            food:[
                {
                    name: "Porchetta Station",
                    description:"Traditional Italian Porchetta Served With Rapini Aglio Olio, Fried Onions, Grilled Red Peppers, Ciabatta Buns And LaBomba Sauce",
                    label:[]
                },
                
            ],
            remarks:null,
        },
        
    ]
}
const DrinkMenu=[
    
    {
        type:"Wine",
        choice:[
            "Holland Marsh Baco/Gamay",
            "Holland Marsh Pinot Grigio",
            "Holland Marsh Gamay Noir",
            "Holland Marsh Vidal" ,
            "Holland Marsh Sauvignon Blanc",
            "Holland Marsh Cabernet/Baco"
        ],
    },
    {
        type:"Standard Brand",
        choice:[
            "Tanqueray Gin",
            "Crown Royal",
            "Johnnie Walker Red Label",
            "Flyte Vodka" ,
            "Bacardi White Bailey's Irish Cream",
            "Amaretto"
        ],
    },
    {
        type:"Juice",
        choice:[
            "Bar lime",
            "Clamato",
            "Cranberry",
            "Orange" ,
        ],
    },
    {
        type:"Beer",
        choice:[
            "Coors Light",
            "Canadian",
            "Stella Artois",
            "1 Local Craft Beer"
        ]
    },
    {
        type:"Other Drinks",
        choice:[
            "Gingerale",
            "Coke",
            "Diet Coke",
            "Sprite" ,
            "Soda Water",
            "Tonic Water",
            "Water"
        ],
    },
]