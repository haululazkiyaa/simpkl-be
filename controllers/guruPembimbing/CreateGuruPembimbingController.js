var Joi = require("joi")
var bcrypt = require("bcrypt")
// var cryptoRandomString = require('crypto-random-string');
const randomatic = require('randomatic');

const randomstring = require('randomstring');

var userService = require("../../services/Users")
var guruPembimbingService = require("../../services/GuruPembimbing")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        nip : Joi.string().max(50).required(),
        nama : Joi.string().max(100).required(),
        alamat : Joi.string().required(),
        no_hp : Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { nip, nama, alamat, no_hp } = value
    var role = "PEMBIMBING"

    const password = randomatic('Aa0!', 8);

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)

    var cekUsername = await userService.findUser({
        username : nip
    })

    if(cekUsername.success && cekUsername.data != null){
        result.success = false
        result.message = "NIP sudah digunakan..."
        return res.status(400).json(result)
    }

    var newUser = await userService.createUser({
        username : nip,
        password : hashPassword,
        temp_password : password,
        role,
        createdBy : req.username
    })

    if (!newUser.success) {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }

    var newGuruPembimbing = await guruPembimbingService.createNew({
        nip,
        nama,
        alamat,
        no_hp,
        createdBy : req.username
    })

    if (newGuruPembimbing.success) {
        result.message = "Guru pembimbing berhasil ditambahkan..."
        result.data = newGuruPembimbing.data
        res.json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler