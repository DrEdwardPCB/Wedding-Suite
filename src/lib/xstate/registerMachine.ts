import {setup,assign} from 'xstate'
import { z } from 'zod'
import { ZodRegisterEmailEntry, ZodRegisterPersonalDetail, ZodRegisterRemaining, DefaultZodRegisterEmailEntry, DefaultZodRegisterPersonalDetail, DefaultZodRegisterRemaining } from './registerHelper'

// zod schema and default


export const registerMachine = setup({
    types:{
        context:{} as {
            emailField: z.infer<typeof ZodRegisterEmailEntry>
            personalField: z.infer<typeof ZodRegisterPersonalDetail>
            otherField:z.infer<typeof ZodRegisterRemaining>

        },
        events:{} as 
        |{
            type:"EReset"
        }
        |{
            type:"EFillEmail"
            value:z.infer<typeof ZodRegisterEmailEntry>
        }
        |{
            type:"EGotoPersonal"
        }
        |{
            type:"EFillPersonal"
            value:z.infer<typeof ZodRegisterPersonalDetail>
        }
        |{
            type:"EGotoVirtual"
        }
        |{
            type:"EGotoPhysical"
        }
        |{
            type:"EFillPhysical"
            value:{
                ceremony:boolean,
                cocktail:boolean,
                banquet:boolean
            }
        }
        |{
            type:"EGotoCeremony"
        }
        |{
            type:"EFillRemarks"
            value:string
        }
        |{
            type:"EFillFoodAllergies"
            value:string
        }
        |{
            type:"EFillFoodChoice"
            value: "beef"|"fish&shrimp"|"vegetarian"
        }
        |{
            type:"EGotoRSVP"
        }
        |{
            type:"EBackToEmail"
        }
        |{
            type:"EBackToPersonal"
        }
        |{
            type:"EBackToVirtual"
        }
        |{
            type:"EBackToPhysical"
        }
        |{
            type:"EBackToBanquet"
        }
        |{
            type:"EBackToCeremony"
        }
        |{
            type:"EBackToCockTailBanquet"
        }
        |{
            type:"EBackToBanquet"
        }
        |{
            type:"EBackToBanquet"
        }
        |{
            type:"EGotoAlreadyHave"
        }
    }
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCcxQJawC5mQOgGUBRAWwEN0AbAYiICU4wsBtABgF1FQAHAe1nRZ0vAHZcQAD0QBGAKwB2AGx5ZAZgCcrACyzp6xevUAOADQgAnjOmt1edfPlGNWgExG36rQF8vZ1BmxcQlIKGiIAMSpKEKo2TiQQPgEhUXEpBDlFeTwdVWsXQ0U3bTNLDNZpLTxWFy15GqN5VSyXaR8-NEwcfGJyKloAcV4sXgAFXFhRMko48STBYTEE9Ol6qptVeRcXRT1rdVVSmVZZVjxGorl1aUUjV1V2kH8uoIJx5EmRadoGWCZZhLzFJLUArdzZCqyXabdyqVStI4ZazSPCbIpaTZaYysJyPZ6BHrvT7fIgAITIAGMANYAFV4MRmHDm-AWqWWMgcylu8jq6M0NRciOkemy8IORlYqm0rjUeM6BMIRKmYUilEoSq+jPiPBZwLSMnUslkOTuqixrElW0UhwsiC00hcKm0qiMqzq2JcD18T3l3UVE2Vg2GvAAauhkFgAK7TAE65KLfUZeR6c6yA4Y1ouC3qQW2hC6FE5+zWTasRTaRSyOUBP1vAOaoMjUYAC3MAgpMaZgN1CfZSbLdm50nhkrcGkRrqdFpOaiMWU0Xo6NdeYYj0bCv3+XbjrJBkiscnOGJ5RnstWa8kR1sd862rkaOIc1ZePVXUZJ5OpdI1ne1iR7bKggexqmieZ4YlkiJmsaVqyI0TS1PUsrevitZvuutCqpQDDkMgVKwLG-7xoB+4IEWeC1K0PKqFCWLSKYeaKIoVSrPY+haO4Y5GM+CoEOhJJDCMdB8aMhFAr2QFIoeoEceBF6Ig4tjDm4RhzjyWQnDxtYtm26AdhujAsNuRG7omTG2KwjjClCShwjmE4OHgmRmrCo7yOoWmvDp7YfpStJjPWv7MsRe7pOZ1RWZktkaLmZRZo6LinBUnhGjceguJ5hKtj5KpRN5elBd2IWJuaditKerg5jsDpCjijr5HOllaJKDqLj6y5Zbp+mNrwADCuBgCQojmGJAGhYg4WWa6UXWjFQoitURqGgU8IGB5KG+l52UFWEgl9bwX6hOSIgAI6Rluf7iSR6Q7MoZa1K67haLcOJaPNA7uOKBSrFmzGZYQ-WoENIjmD8hmjcVfbCtJx6yXe8l5sKjR4GsLqeC6lSGv9BCA4Nw20J+-n5fpEOmX2TQovszQnFmrrjojyJOQ0NwwnV2O48DoMRFEOFkHhBHGVd41ka0KNYoYcKWYaDFlPsSkNBxUJZsO3gbR1AMDZzPXCSGomC2NibQyBsOnvDkGIzUZzXtclaWda1rswdVJYEdZCnedWBg38RmXQbfa3dU6KPbUL13EK5aU2a1jMRxmwuo71Iu1Qx1nUwBN+d+20k-rkOSQH90cfRIcSmHDMKKiBT2pZpw-arS4vgDTtJ5QKce5hUThLwvAQAAgmquAYHApN6n2OgmhBmY7EYuiXojpxGHY1e3LstwOooCfO677tp9zaq8-zw8SaR1oqM909wvacHyEaQr2o6hpaBm916FCG-N63O97R-PvBWTedMYHB6Rcz6vVvlkaoNhkRMShHIbG38vYXV-iPSSRsjyYlNuec2ssdDZErNfDGyYyyyDru1BuBB4G70oJ3buvVmy8D0mAQ+11EDXBRM1IocEKjNTyLPWWzQLJLTPJ4IsbVUKvAoYTOkvUnY0i3qnH+RU-7HwMBFaaNlZr2URlKM4Eo0zuRqCeNoasyEUL2jrPWvtc6kVQTJDBEFeEyBolyBQHFEonGHGabG5iEEKJ3Mg6xGIF7GHsQ4Dic4bSy2lBRFwjhWg3FekY+uvFvFkgzrwb+TDhbCgKCjJKzhp5qG2LfSyTkFC6ElC6GwOYvEiXTl+PqmthqZMNtZNBYEzYOPKMmJyYpH5mjLDUURm0egpMkaGcM74tRIKPisSojp3CukfPkT0nStgL2vI1O4qxtDyB8N6EQ3c4DiDEcgaZzCEAAFpHS6ChDCBweRY4nERBc40hg3nvI+UM9WvRQhnKyQoWwGgBlX2uEoTpDprB2ClPYNMn0yyJNIbxH8lA-mG30NkSqLQ4J6DyBExAuhVA5DKfRKUiUzzY34iixR-j0ieHWZCLEMS5DXxlogJQxplIHClPwi03FjFIqztMVFfZTjzKyPRKEc41CnDegzJwi00xCMZQcdmjSQbCskjmBeJxnropuJfIUWYzgzmMAWJiUoSEnMbonORHsNWkTqOHGw5xyxIVWHM-QcC3byPtbS5oqJgnwm4UaDit96gQOuHCO4D8Hb8trOY31jiaIUTNGiPQdQri1XAToR+lkkJ6L5T4IAA */
    id:"register",
    initial:"SEmail",
    context:{
        emailField:structuredClone(DefaultZodRegisterEmailEntry),
        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
        otherField:structuredClone(DefaultZodRegisterRemaining)
    },
    states:{
        SEmail:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EFillEmail":{
                    actions:assign({
                        emailField:({event})=>event.value
                    })
                },
                "EGotoPersonal":{
                    guard:({context})=>{
                        return ZodRegisterEmailEntry.safeParse(context.emailField).success
                    },
                    target:"SPersonal"
                },
                "EGotoAlreadyHave":{
                    target:"SAlreadyHave"
                }
            }
        },
        SAlreadyHave:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
            }
        },
        SPersonal:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EBackToEmail":{
                    target:"SEmail",
                    actions:assign({
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                    })
                },
                "EFillPersonal":{
                    actions:assign({
                        personalField:({event})=>event.value
                    })
                },
                "EGotoVirtual":{
                    guard:({context})=>{
                        return ZodRegisterPersonalDetail.safeParse(context.personalField).success
                    },
                    target:"SVirtual"
                },
                "EGotoPhysical":{
                    guard:({context})=>{
                        return ZodRegisterPersonalDetail.safeParse(context.personalField).success
                    },
                    target:"SPhysical"
                }
            }

        },
        SVirtual:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EBackToPersonal":{
                    target:"SPersonal",
                    actions:assign({
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EFillRemarks":{
                    actions:assign({
                        otherField:({event,context})=>({...context.otherField,remarks:event.value})
                    })
                },
                "EGotoRSVP":{
                    target:"SRSVP"
                }
            }

        },
        SPhysical:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EBackToPersonal":{
                    target:"SPersonal",
                    actions:assign({
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EFillPhysical":{
                    actions:assign({
                        otherField:({event,context})=>({
                            ...context.otherField,
                            ceremony:event.value.ceremony,
                            cocktail:event.value.cocktail,
                            banquet:event.value.ceremony
                        })
                    })
                },
                "EGotoCeremony":{
                    target:"SCeremony"
                },
                "EGotoCockTailBanquet":{
                    target:"SCocktailBanquet"
                },
            }

        },
        SCeremony:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EBackToPhysical":{
                    target:"SPhysical",
                    actions:assign({
                        otherField:({context})=>({
                            ...context.otherField
                        })
                    })
                },
                "EFillRemarks":{
                    actions:assign({
                        otherField:({event,context})=>({...context.otherField,remarks:event.value})
                    })
                },
                "EGotoRSVP":{
                    target:"SRSVP"
                }
            }

        },
        SCocktailBanquet:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EBackToPhysical":{
                    target:"SPhysical",
                    actions:assign({
                        otherField:({context})=>({...context.otherField,foodAllergies:"",remarks:""})
                    })
                },
                "EFillFoodAllergies":{
                    actions:assign({
                        otherField:({event,context})=>({...context.otherField,foodAllergies:event.value})
                    })
                },
                "EFillRemarks":{
                    actions:assign({
                        otherField:({event,context})=>({...context.otherField,remarks:event.value})
                    })
                },
                "EGotoBanquet":{
                    target:"SBanquet"
                }
            }

        },
        SBanquet:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EFillFoodChoice":{
                    actions:assign({
                        otherField:({event,context})=>({...context.otherField, foodChoice:event.value})
                    })
                },
                "EBackToCockTailBanquet":{
                    target:"SCocktailBanquet",
                    actions:assign({
                        otherField:({context})=>({...context.otherField, foodChoice:"" as const})
                    })
                },
                "EGotoRSVP":{
                    target:"SRSVP"
                }

            }

        },
        SRSVP:{
            on:{
                "EReset":{
                    target:"SEmail",
                    actions:assign({
                        emailField:structuredClone(DefaultZodRegisterEmailEntry),
                        personalField:structuredClone(DefaultZodRegisterPersonalDetail),
                        otherField:structuredClone(DefaultZodRegisterRemaining)
                    })
                },
                "EBackToBanquet":{
                    target:"SBanquet"
                },
                "EBackToCeremony":{
                    target:"SCeremony"
                },
                "EBackToVirtual":{
                    target:"SVirtual"
                }
            }
        }
    },
    
})