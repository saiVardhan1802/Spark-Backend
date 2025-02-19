const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    /*
    createdJobs: {
        type: [Schema.Types.ObjectId],
        ref: "Job",
        required: false,
    },
    appliedJobs: {
        type: [Schema.Types.ObjectId],
        ref: "Application",
        required: false,
    },
    savedJobs: {
        type: [Schema.Types.ObjectId],
        ref: "Job",
        required: false,
    }, 
    */
});
module.exports = mongoose.model("User", userSchema);