import { Router } from 'express'
import { body } from 'express-validator'
import { registration,
    login,
    logout,
    activate,
    refresh,
    getUsers,
    roleCreate } from '../controllers/user.controller'

import { roleMiddleware } from '../middlewares/role.middleware' 
 
    
const router = Router()

router.post('/registration',
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), 
    registration)

router.post('/login', login)
router.post('/logout', logout)
router.post('/role/:role', roleCreate)
router.get('/activate/:link', activate)
router.get('/refresh', refresh)
router.get('/users', roleMiddleware(["ADMIN"]), getUsers)

export default router