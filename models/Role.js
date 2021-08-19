const {Schema, model} = require('mongoose')


const Role = new Schema({
    value: {default:"admin",type: String, unique: true, },
})

module.exports = model('Role', Role)