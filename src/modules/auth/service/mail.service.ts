import emailjs from '@emailjs/nodejs'

export const sendActivationMail = async (to: string, link: string) => {
    await emailjs.send(
        process.env.EMAIL_SERVICE,
        process.env.EMAIL_TEMPLATE,
        {
            from_name: 'Flixio Service',
            to_name: '',
            from_email: process.env.EMAIL_FROM,
            to_email: to,
            message: 'Для регистрации на сервисе Flixio перейдите по ссылке',
            link: link
        },
        {
            publicKey: process.env.EMAIL_PUBLIC_KEY,
            privateKey: process.env.EMAIL_PRIVATE_KEY
        }
    )  
} 