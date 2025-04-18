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
            type:"EBackToCocktail"
        }
        |{
            type:"EGotoAlreadyHave"
        }|
        {
            type:"EGotoCockTail"
        }|
        {
            type:"EGotoBanquet"
        }|
        {
            type:"EGotoFinish"
        }
        
    }
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCcxQJawC5mQOgGUBRAWwEN0AbAYiICU4wsBtABgF1FQAHAe1nRZ0vAHZcQAD0QBGAGzSAzHgBM06a2UB2LbNYAWVrIA0IAJ4zlADml5WAVlWXWmzXYUBOBQF8vJ1BmxcQlIKGiIAMSpKEKo2TiQQPgEhUXEpBDl9PGllO307WU1rHM0TcwzpSztbd3dDN3d1NzsfPzRMHHxicipaAHFeLF4ABVxYUTJKOPEkwWExBPTpF1Y8TVk7bT1ZPWU9bTKLPXdsu3dleWsnSwUW3xB-DqDu0P7B3gBBSlQyCFMACTIADcwNMErMUgtQEsVmsNlsdnsDmYZHITnY9B49JZLJ5NBpWg92oEul8fn9ASDaAxYEwwTx+HNUosZLilLJLK53NYOecFMYURlnEozqwbrdWJ5ZLlCY8SYQyWBfgDgWA3kNIiJMAALemJRmQtKIVSePB6NzLXTSPQ2vSHCqyJTuXSbdx2BzyDGy4mdQijZDjESTamMFgcGYG+ZGjJsvAcrk83HKfn2nK1ONnBRqSzSsXub0BX0Ef2B4NEABCZAAxgBrAAqvBiU3D4MjzOhrMxeFu7nNBlY+kaClTHmq8j2Wj2iKqBaeXRLEzCkUolAXQeb8QZySjLIQylYCmUp0dijxu1KgpyyiPzvs2zObh20ln8uLY0X6t4ADV0MgsABXSY9QhHcOwyIpZDwC0swaaV8TtQV900E5FCcW5Kn2fRNBfIs1zLAYhmGbVTAEKsgJbLcmShSQZBcdkDG0RxFAg+0FAUPRbAHZxzRcVDLBw54fz-QCwhpOkKP1bd2xojJ+zwN0FH0Qx9HNOxUxuE58RuaV1GsN1ZAErohIAstK1rBs8I3CMpOopY5IUpTdBtd1U08Md5H2TRjlydDDMIYyRNoZdKAYchkBrWBgLbWyLGTbJdjURQ7BzZRuVc00Dx2axtlYaRkuw+45SLAL8PeOgCC-YYops6N1D0GwMQ2K4FBzZ01Mvdx8RUDwNmxZNXBlQqfWeIiSPQMjRNDaqqNqri405Fr8UKSxsXce18RsDZHTOWRPRyPQ-OLYjSNM6t6xGd912mw1d3UAd5s0RbDCKVbU1UapFNUTFGvNdjDtGk6lyiAHxvIzdJJm3cnCPC0ry0SoimkVMchsC5FIcG1JVuAyhsLEbjtBsICN4ABhXAwBIURTGu0CZLu1Z4ye5bXsFd1qn3LNe2TLNCmfXG5z9AmJs-EneHM0Iaek9JHUsbs6n2DExUerzkfNeTcV24pkx2-6hdKoZKxEABHf9xPBkCpZkObGc5Z6VtxVNDFlla6nkNQpQcQ6ydQSmRFMENaTDc3otq+y3EclSXNZw8zXWXa8sdLjvH519vYpqnaDM86QYmyWYqFA8oOlFqcsKd0BXKF01gPPZz00ZZUq98nff9iIolCshwsiiSLfzq9IKx-E9k2bYintPs1jyZwcWxSwtE2JufYzohifKyq89m+qoPvZrWo2e19yPXIB3xdHzRUr2xZrLBXnoKae5D3dpSP9irGFZ16pHZK1iKbRpG5NkXlL61hvr0CsZ0LJ6ysq2GqT9rzdV2E4R6H8kaXn-pBVa208p2F0snNoeMuiixAbfYK4ReC8AgF8SguAMBwA3ruXY1RrR3nOK4b6u03pdWWPXXEuVMIFGAdfEh7cKadwivQsCNolAc2cNBTq9cELlDUF5FQexhSJ35DjfBAsCBEKEWA1eFUqoP1gWBKwR455IMlC4DY7F2pKKzJoOMillhJQUEUQa2jXyGxNkwAOZtrKQzAsw1YDkDBOVUsjXIcIChsh7PYPBRICGEB8abLAQUohkIoVQmh6A6EmKCXTDmeAqjnAuKhWoWhHbYlsB4a01hrz8mtIdVJfi24rg7l3CRRTVDyVUPXZ6sg6gFHtG6I8YpdCHketDf+LSyDGzSRklcWSIAk21LwcaoICk3WCaoVYCMGKdSsBiSw9oqiQUUKlZYtx+Rz2UHMhZbSs6QLGrnbZtMlgDhFMXFaugy4jLQf-bsxwNA8lUKeB5vj0krzKkY7pnyt6NWSpUFqQz96XgxurSobgqj-w0Ikoqzw17DH8UHQJOyZLJlWF5SpNxnBaDnqmNF3VKgqUyLkLRSSdHEszhA3grSyUwMKekKlaxjjnDpdoDxTK1aPRRcrKZBUvFFh5eA8ypNm5U3hcaRSYraWKSlYywUh4lBcQSXPDkex+IpxVUY3l6q9F1glu8y2e5dU0olQahlygRwcmyIpRSmJaj5AOjaoldq1XnRKtAyiFKRXuvFVYL10rEKSlCRrFqdiSiHVVcTTUOptVuupYmyV3qzkNTNe4yxlRrXKuePm2A2pSWFsaasX66grDhMUBXRAnh9nWnntYeurCfD3BEBQuA4hCXIHJR8xAABaHtCBF2cTNWuk+fM61dCbLO11cg5C2GlJcHK2I5AjjnpxBwzo8qdUPJy6dCpvhKgpKqXd+cOZOITlmDw7jzzIx2GaF0yF3TlK9GG+cl1JhvujPuG02Rcoum0kMlqI44pDnjp1TqmVDrRug7dCcUE+HDM0WtVNppuRumdCtG03I7hbsFq8qDQq42IGyrHHY5d650VOZea8R993LVyPPRe6c-Z4d2THDwNx3bsQlIoxAbNq6c12GxOQ9dBGgMoOJmSPFOIuHCe9ZKpGHH139QefQHh5ZgfowQAV2mlja2yMB6jOLOQ+rQTUypaM8iFBPjmox9nEC7APsKPp1p8QDl7AvcDhAG3akC26rs5xKhWmsZEwUClgXOF2tyQoWY+Y+CAA */
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
                "EGotoFinish":{
                    target:"SFinish"
                }
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
                    target:"SVirtual",
                    actions:assign({
                        otherField:({context})=>({...context.otherField,online:true})
                    })
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
                        otherField:({event,context})=>{
                            return {
                            ...context.otherField,
                            ceremony:event.value.ceremony,
                            cocktail:event.value.cocktail,
                            banquet:event.value.banquet
                            }
                        }
                    })
                },
                "EGotoCeremony":{
                    target:"SCeremony"
                },
                "EGotoCockTail":{
                    target:"SCocktail"
                },
                "EGotoBanquet":{
                    target:"SBanquet"
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
                        otherField:({context})=>({...context.otherField,foodAllergies:""})
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
        SCocktail:{
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
                        otherField:({context})=>({...context.otherField,foodAllergies:""})
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
                "EGotoRSVP":{
                    target:"SRSVP"
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
                "EFillFoodChoice":{
                    actions:assign({
                        otherField:({event,context})=>({...context.otherField, foodChoice:event.value})
                    })
                },
                "EBackToPhysical":{
                    target:"SPhysical",
                    actions:assign({
                        otherField:({context})=>({...context.otherField,foodChoice:""})
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
                "EBackToCocktail":{
                    target:"SCocktail",
                },
                "EBackToVirtual":{
                    target:"SVirtual"
                },
                "EGotoFinish":{
                    target:"SFinish"
                }
            }
        },
        SFinish:{
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
        }
    },
    
})