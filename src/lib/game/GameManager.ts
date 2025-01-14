import { isNil } from "lodash"
import { clearAllWinners, findWinnerOfQuestion, getOverallScorePerUser, getQuestionById, registerCorrect } from "../mongo/actions/QuestionAction"
import { BehaviorSubject } from 'rxjs';
import GameManagerInst, { TZodGameManagerInstSchema } from '../mongo/schema/GameManagerInst';
import { queryAll,commitAdd, commitUpdate , findGameManagerInstByMongoId, deleteAllGameInst} from "../mongo/actions/GameManagerInstActions";
import { randomUUID } from "crypto";
import {ChangeStream, ChangeStreamDocument} from "mongodb"
// use db to keep singleton
export class GameManager{
    private static instance:GameManager|undefined
    private id:string|undefined = undefined
    private state:BehaviorSubject<"Prepare"|"Open"|"Calculate"|"Display"|"Overall"|"Undefined"|"End"> = new BehaviorSubject<"Prepare"|"Open"|"Calculate"|"Display"|"Overall"|"End"|"Undefined">("Undefined")
    private questionId:string | undefined = undefined
    private ready:boolean =false
    private sub:ChangeStream|undefined=undefined
    private constructor(){
        console.log("[Gm] construct start")
        // check if DB already have record if yes reconstruct else construct new
        console.log("[Gm] construct end")

    }
    public static async GetInstance(){
        if(isNil(GameManager.instance)){
            console.log("[Gm ] need to reconstruct")
            GameManager.instance=new GameManager()
        }
        await GameManager.instance.init()
        return GameManager.instance
    }
    public async init(){
        console.log("[gms] init start")
        const gms = await queryAll()
        if(gms.length===0){
            console.log(["[gms] construct and save to db"])
            this.state.next("Prepare")
            //construct new
            this.id=randomUUID()
            await commitAdd({
                id:this.id,
                state:"Prepare",
                questionId:undefined,
            })

        }else{
            console.log(["[gms] reconstruct from db"])
            //reconstruct
            this.id=gms[0].id
            this.state.next(gms[0].state)
            this.questionId=gms[0].questionId

        }

        this.sub = GameManagerInst.watch() as unknown as ChangeStream<Document, ChangeStreamDocument<Document>>
        this.sub.on("change",async (data)=>{
            console.log(data)
            if(data.operationType==="update"){
                const id = data.documentKey._id.toHexString()
                const latestData = await findGameManagerInstByMongoId(id)
                this.questionId=(latestData as TZodGameManagerInstSchema)?.questionId
                this.state.next((latestData as TZodGameManagerInstSchema)?.state)

            }
            if(data.operationType==="delete"){
                this.state.next("End")
                // destroy the instance, calling GetInstance will recreate
                this.sub?.close()
                GameManager.instance=undefined
            }
        })
        this.ready=true

        console.log("[gms] init end")

    }
    //state
    
   

    public getState(){
        return this.state
    }
    public async ActionChangeQuestion(questionId:string|undefined){
        console.log("[ActionChangeQuestion] start")
        this.questionId=questionId
        this.state.next("Prepare")
        await commitUpdate({id:this.id!, questionId:this.questionId!, state:"Prepare" })
        console.log("[ActionChangeQuestion] end")

    }

    public async getQuestion(){
        if(this.questionId){

            return await getQuestionById(this.questionId)
        }
        return null
    }
    public async ActionOpen(){
        console.log("[ActionOpen] start")
        // this.state.next("Open")
        await commitUpdate({id:this.id!, questionId:this.questionId!, state:"Open" })
        console.log("[ActionOpen] end")

    }
    public async RegisterCorrectUserId(userId:string){
        console.log("[RegisterCorrectUserId]: start" ,userId)
        if(this.state.getValue()==="Open"){
            console.log("[RegisterCorrectUserId]: registering ",this.questionId, userId)
            
            await registerCorrect(this.questionId!,userId)
        }
        console.log("[RegisterCorrectUserId]: end" ,userId)
        
    }
    public async ActionCalculate(){
        console.log("[ActionCalculate] start")
        //save all the winners and 
        await commitUpdate({id:this.id!, questionId:this.questionId!, state:"Calculate" })
        console.log("[ActionCalculate] end")

    }

    public async ActionDisplay(){
        console.log("[ActionDisplay] start")
        await commitUpdate({id:this.id!, questionId:this.questionId!, state:"Display" })
        console.log("[ActionDisplay] end")

    }

    public async GetWinners(){
        if(isNil(this.questionId)){
            return
        }
        return await findWinnerOfQuestion(this.questionId)
    }
    public async GetOverallScore(){
        return await getOverallScorePerUser()
    }
    public async ActionFinishSession(){
        console.log("[ActionFinishSession] start")
        await commitUpdate({id:this.id!, questionId:this.questionId!, state:"Overall" })
        console.log("[ActionFinishSession] end")

    }
    public async ActionReset(){
        console.log("[ActionReset] start")
        await deleteAllGameInst()
        // destroy the instance, calling GetInstance will recreate
        await clearAllWinners()
        console.log("[ActionReset] end")

    }

    public getCurrentState():"Prepare"|"Open"|"Calculate"|"Display"|"Overall"|"End"|"Undefined"{
        return this.state.getValue()
    }

}