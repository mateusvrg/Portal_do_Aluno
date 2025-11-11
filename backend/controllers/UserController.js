import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Logger from "../db/logger.js";
import createUserToken from "../helpers/create-user-token.js";
import getToken from '../helpers/get-token.js';
import jwt from 'jsonwebtoken';
import getUserByToken from '../helpers/get-user-by-token.js';


export default class UserController {
    static async register(req, res) {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        const typeUser = req.body.typeuser;

        // validations
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        }

        if (!email) {
            res.status(422).json({ message: "O e-mail é obrigatório!" });
            return;
        }

        if (!password) {
            res.status(422).json({ message: "A senha é obrigatória!" });
            return;
        }

        if (!confirmpassword) {
            res
                .status(422)
                .json({ message: "A confirmação de senha é obrigatória!" });
            return;
        }

        if (!typeUser) {
            res.status(422).json({ message: "O tipo de usuário é obrigatório" });
            return;
        }

        if (password != confirmpassword) {
            res
                .status(422)
                .json({ message: "A senha e a confirmação precisam ser iguais!" });
            return;
        }

        // check if user exists
        const userExists = await User.findOne({ where: { email: email } });

        if (userExists) {
            res.status(422).json({
                message: "Por favor, utilize outro e-mail. Este já foi cadastrado!",
            });
            return;
        }

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const user = new User({
            email: email,
            senha_hash: passwordHash,
            nome: name,
            tipo: typeUser,
        });

        try {
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        } catch (error) {
            Logger.error(`Erro ao criar user no banco: ${error}`);
            res.status(500).json({ message: error });
        }
    }

    static async login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        if (!email) {
            res.status(422).json({ message: "O e-mail é obrigatório!" });
            return;
        }

        if (!password) {
            res.status(422).json({ message: "A senha é obrigatória!" });
            return;
        }

        // check if user exists
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res
                .status(422)
                .json({ message: "Não há usuário cadastrado com este e-mail!" });
        }

        // check if password match
        const checkPassword = await bcrypt.compare(password, user.senha_hash);

        if (!checkPassword) {
            return res.status(422).json({ message: "Senha inválida" });
        }

        await createUserToken(user, req, res);
    }

    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            currentUser = await User.findOne({ where: { email: decoded.id } })
            currentUser.senha_hash = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findOne({ where: { email: id } })
        user.senha_hash = undefined

        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const token = getToken(req)

        const user = await getUserByToken(token)

        console.log(user);

        const nome = req.body.nome
        console.log(nome)
        const senha_hash = req.body.senha
        const senha_hash_rep = req.body.senhaconfirm
        const tipo = req.body.tipo

        // validations
        if (!nome) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }

        user.nome = nome

        if (!senha_hash) {
            res.status(422).json({ message: 'A senha é obrigatório!' })
            return
        }

        if (!senha_hash_rep) {
            res
                .status(422)
                .json({ message: "A confirmação de senha é obrigatória!" });
            return;
        }

        if (!tipo) {
            res.status(422).json({ message: "O tipo de usuário é obrigatório" });
            return;
        }

        user.tipo = tipo

        if (senha_hash != senha_hash_rep) {
            res
                .status(422)
                .json({ message: "A senha e a confirmação precisam ser iguais!" });
            return;
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha_hash, salt);
        
        user.senha_hash = passwordHash

        try {
            const updateUser = await User.update(
                {
                    nome: user.nome,
                    senha_hash: user.senha_hash,
                    tipo: user.tipo,
                },
                {
                    where: { email: user.email }, // IMPORTANTE: Atualiza pelo id do usuário
                }
            )
            res.json({
                message: 'Usuário atualizado com sucesso!',
                data: updateUser,
            })
        } catch (error) {
            Logger.error(`Erro ao atualizar user no banco: ${error}`)
            res.status(500).json({ message: error })
        }
    }
}
