import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Logger from "../db/logger.js";
import createUserToken from '../helpers/create-user-token.js';


export default class UserController {
    static async register(req, res) {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
        const typeUser = req.body.typeuser

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
            return
        }

        if (!typeUser) {
            res.status(422).json({ message: 'O tipo de usuário é obrigatório' })
            return
        }

        if (password != confirmpassword) {
            res
                .status(422)
                .json({ message: 'A senha e a confirmação precisam ser iguais!' })
            return
        }

        // check if user exists
        const userExists = await User.findOne({ where: { email: email } })

        if (userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail. Este já foi cadastrado!' })
            return
        }

        // create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const user = new User({
            email: email,
            senha_hash: passwordHash,
            nome: name,
            tipo: typeUser
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            Logger.error(`Erro ao criar user no banco: ${error}`)
            res.status(500).json({ message: error })
        }
    }
}