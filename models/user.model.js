const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }
});

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

    profileTitle: {
        type: String,
        required: true,
        default: "",
    },

    bio: {
        type: String,
        required: false,
    },

    profileImg: {
        type: String,
        required: true,
        default: "profile.jpg",
    },

    links: [linkSchema],

    shops: [linkSchema],

    /*Appearance */
    layout: {
        type: String,
        required: true,
        enum: ["stack", "grid", "carousel"],
        default: "stack"
    },

    fill: {
        type: Boolean,
        required: true,
        default: false
    },

    shadow: {
        type: String,
        required: true,
        enum: ["hard", "soft", "none"],
        default: "none"
    },

    outline: {
        type: String,
        required: true,
        default: "2rem"
    },

    buttonColor: {
        type: String,
        required: true,
        default: '#D9D9D9'
    },

    buttonFontColor: {
        type: String,
        required: true,
        default: "Black"
    },

    font: {
        type: String,
        required: true,
        default: "Poppins"
    },

    fontColor: {
        type: String,
        required: true,
        default: "white"
    },

    Theme: {
        type: String,
        required: true,
        default: "#E0E2D9"
    }

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