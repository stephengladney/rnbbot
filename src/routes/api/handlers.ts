import { Request, Response, Router } from "express"
import { logError } from "../../lib/logging"

export type Handler = (req: Request, res: Response) => void
type Handlers = {
  index?: Handler
  show?: Handler
  create?: Handler
  update?: Handler
  deleteFn?: Handler
  extendRouter?: (router: Router) => void
}

export function createRoutes(handlers: Handlers) {
  const express = require("express")
  let router = express.Router()

  if (handlers.index) router.get("", handlers.index)
  if (handlers.show) router.get("/:id", handlers.show)
  if (handlers.create) router.post("", handlers.create)
  if (handlers.update) router.put("/:id", handlers.update)
  if (handlers.deleteFn) router.delete("/:id", handlers.deleteFn)

  if (handlers.extendRouter) handlers.extendRouter(router)

  return router
}

export function handleError({
  err,
  res,
  trace,
}: {
  err: any
  res: Response
  trace: string
}) {
  res.status(500).send()
  logError(`${trace}: ${err}`)
}
