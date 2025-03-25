
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User.model'

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Email or Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    })

                    if (!user) {
                        throw new Error(
                            'No user found with this email or username.',
                        )
                    }

                    if (!user.isVerified) {
                        throw new Error(
                            'Please verify your account first before logging in.',
                        )
                    }

                    const isPasswordCorrect = bcrypt.compare(
                        credentials.password as string,
                        user.password as string,
                    )

                    if (!isPasswordCorrect) {
                        throw new Error('Invalid password. Please try again.')
                    }

                    return {
                        id: user._id.toString(),
                        name: user.username,
                        email: user.email,
                        isVerified: user.isVerified,
                    }
                } catch (error: any) {
                    throw new Error(error.message || 'Internal Server Error')
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string
                session.user.isVerified = token.isVerified as boolean
                session.user.username = token.username as string
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
                
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.username = user.username
                token.isAcceptingMessages = user.isAcceptingMessages
                
            }
            return token
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET,
})
