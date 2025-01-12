import { isNil } from "lodash"
import  { TZodQuestionSchema } from "../mongo/schema/QuestionSchema"
import { findWinnerOfQuestion, getOverallScorePerUser, getQuestionById, registerCorrect } from "../mongo/actions/QuestionAction"
import { lastValueFrom, Subject } from 'rxjs';
export class GameManager{
    private static instance:GameManager|undefined
    private constructor(){
    }
    public static GetInstance(){
        if(isNil(GameManager.instance)){
            GameManager.instance=new GameManager()
        }
        return GameManager.instance
    }
    //state
    private state:Subject<"Prepare"|"Open"|"Calculate"|"Display"|"Overall"> = new Subject()
    private questionId:string | undefined = undefined
    private question:TZodQuestionSchema | undefined = undefined
    private correctUserId:string[] = []
    private overallResult:Record<string,number> = {}


    public getState(){
        return this.state
    }
    public async ActionChangeQuestion(questionId:string|undefined){
        this.questionId=questionId
        if(questionId!==undefined){
            await this.LoadQuestionFromDatabase()
        }
        this.correctUserId=[]
        this.state.next("Prepare")
    }

    private async LoadQuestionFromDatabase(){
        if(!this.questionId){
            return
        }
        this.question= await getQuestionById(this.questionId)
        return 
    }
    public getQuestion(){
        return this.question
    }
    public ActionOpen(){
        this.state.next("Open")
    }
    public RegisterCorrectUserId(userId:string){
        this.correctUserId.push(userId)
        return
    }
    public async ActionCalculate(){
        //save all the winners and 
        this.state.next("Calculate")
        await Promise.all(this.correctUserId.map(e=>registerCorrect(this.questionId as string,e)))
    }

    public async ActionDisplay(){
        this.state.next("Display")
    }

    public async GetWinners(){
        if(isNil(this.questionId)){
            return
        }
        return await findWinnerOfQuestion(this.questionId)
    }
    public async GetOverallScore(){
        if(isNil(this.overallResult)){
            this.overallResult=await getOverallScorePerUser()
        }
        return this.overallResult
    }
    public ActionFinishSession(){
        this.state.next("Overall")
    }
    public async ActionReset(){
        // destroy the instance, calling GetInstance will recreate
        GameManager.instance=undefined
    }

    public async getCurrentState():Promise<"Prepare"|"Open"|"Calculate"|"Display"|"Overall">{
        const currentState = await lastValueFrom(this.state.asObservable())
        return currentState
    }

}