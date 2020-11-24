import { Request, Response, Router } from "express"
import { logError } from "../../lib/logging"
import { sendMessage } from "../../lib/slack/index"

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
  const errorMessage = err.errors ? err.errors[0].message : err
  res.status(400).send(errorMessage)
  logError(`${trace}: ${errorMessage}`)
  sendMessage({
    channel: "rnbot-alerts",
    message: `*${trace}:* ${errorMessage}`,
    ignoreHours: true,
  })
}
