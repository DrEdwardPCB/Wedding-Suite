"use server"
import { isNil } from "lodash"
import  { TZodQuestionSchema } from "../mongo/schema/QuestionSchema"
import { findWinnerOfQuestion, getOverallScorePerUser, getQuestionById, registerCorrect } from "../mongo/actions/QuestionAction"
export class GameManager{
    private static instance:GameManager|undefined
    private constructor(){
        if (isNil(GameManager.instance)){
            GameManager.instance= new GameManager()
        }
    }
    public static GetInstance(){
        return GameManager.instance
    }
    //state
    private state:"Prepare"|"Open"|"Calculate"|"Display"|"Overall" = "Prepare"
    private questionId:string | undefined
    private question:TZodQuestionSchema | undefined
    private correctUserId:string[]=[]
    private overallResult:Record<string,number> = {}


    public ActionChangeQuestion(questionId:string){
        this.state = "Prepare"
        this.questionId=questionId
        this.LoadQuestionFromDatabase()
        this.correctUserId=[]
    }

    private async LoadQuestionFromDatabase(){
        if(!this.questionId){
            return
        }
        this.question = await getQuestionById(this.questionId)
    }
    public getQuestion(){
        return this.question
    }
    public ActionOpen(){
        this.state="Open"
    }
    public RegisterCorrectUserId(userId:string){
        if(this.state==="Open"){
            this.correctUserId.push(userId)
        }
        return
    }
    public async ActionCalculate(){
        //save all the winners and 
        this.state="Calculate"
        await Promise.all(this.correctUserId.map(e=>registerCorrect(this.questionId as string,e)))
    }

    public async ActionDisplay(){
        this.state="Display"
    }

    public async GetWinners(){
        if(this.state!=="Display"||isNil(this.questionId)){
            return
        }
        return await findWinnerOfQuestion(this.questionId)
    }
    public async GetOverallScore(){
        if(this.state!=="Overall"){
            return
        }
        if(isNil(this.overallResult)){
            this.overallResult=await getOverallScorePerUser()
        }
        return this.overallResult
    }
    public ActionFinishSession(){
        this.state="Overall"
    }
    public async ActionReset(){
        // destroy the instance, calling GetInstance will recreate
        GameManager.instance=undefined
    }

}