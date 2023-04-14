import emailjs from '@emailjs/nodejs'

export const sendActivationMail = async (to: string, link: string) => {
    await emailjs.send(
        'service_owwboma',
        'template_4dlqo1h',
        {
            from_name: 'Flixio Service',
            to_name: '',
            from_email: 'flixioservice@gmail.com',
            to_email: to,
            message: 'Для регистрации на сервисе Flixio перейдите по ссылке',
            link: link
        },
        {
            publicKey: 'aVmG8NFFdQl8I1UaV',
            privateKey: 'GDLtrGj3FWDWqOVaUpuyy'
        }
    )  
} 