import {Schema, model, Types} from 'mongoose'

const BingoSchema = new Schema({
    row1:[Number],
    row2:[Number],
    row3:[Number],
    row4:[Number],
    row5:[Number],
    line1:[Number],
    line2:[Number],
    line3:[Number],
    line4:[Number],
    line5:[Number],
    line6:[Number],
    line7:[Number],
    line8:[Number],
    line9:[Number],
    line10:[Number],
    line11:[Number],
    line12:[Number],
    bingoNumber:[Number],
    User:{type: Types.ObjectId,ref:"User"}
})

export default model('Bingo', BingoSchema)