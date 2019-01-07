const express = require("express");
const router = express.Router();

const hashtag_controller = require("../controllers/hashtag.controller");

router.post("/create", hashtag_controller.hashtag_create);
router.get("/", hashtag_controller.hashtags_list);
router.get("/:id", hashtag_controller.hashtag_details);
router.put("/:id/update", hashtag_controller.hashtag_update);
router.delete("/:id/delete", hashtag_controller.hashtag_delete);

module.exports = router;
