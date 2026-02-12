import express from 'express'
import ClientController from '../controllers/client.controller.js'

const router = express.Router()

router.post('/',ClientController.register)
router.get('/',ClientController.getAllClients)
router.get('/:id',ClientController.getSingleClient)
router.put('/:id',ClientController.updateClient)
router.delete('/:id',ClientController.deleteClient)
export default router