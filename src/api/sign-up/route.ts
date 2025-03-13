import dbConnect from '@/lib/dbConnect'

import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import UserModel from '@/model/User.model'
import { todo } from 'node:test'

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })

        const verifyCode = Math.floor(
            100000 + Math.random() * 999999,
        ).toString()

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 },
            )
        }

        const existingUserByEmail = await UserModel.findOne({ email })

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified)
                return Response.json(
                    {
                        success: false,
                        message: 'User already exist with this email',
                    },
                    { status: 400 },
                )
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                // TODO: Check Hour
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })

            await newUser.save()
        }
        // send email
        const sendEmailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )

        if (!sendEmailResponse) {
            return Response.json({
                success: false,
                message: "Failed in sending email"
            }, {status: 500})
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your email!',
            },
            { status: 201 },
        )






    } catch (error) {
        console.log('Error in registering User!', error)
        return Response.json(
            {
                success: false,
                message: 'Error in registering User',
            },
            {
                status: 500,
            },
        )
    }
}
