const router = require("express").Router()

export function createRoutes({ create, deleteFn, index, show, update }) {
  if (index) router.get("", index)
  if (show) router.get("/:id", show)
  if (create) router.post("", create)
  if (update) router.put("/:id", update)
  if (deleteFn) router.delete("/:id", deleteFn)

  return router
}
