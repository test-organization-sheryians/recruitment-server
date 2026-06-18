import express from "express"

import mongoProdRepository from "../repositories/implementations/mongoProdRepository.js"
import prodService from "../services/prod.service.js"
import prodController from "../controllers/prod.controller.js"

const router = express.Router()

const repository = new mongoProdRepository()
const service = new prodService(repository)
const controller = new prodController(service)

router.post("/", controller.createProd)

router.get("/", controller.getAllProds)

router.get("/:id", controller.getProdById)

router.put("/:id", controller.updateProd)

router.delete("/:id", controller.deleteProd)

export default router;