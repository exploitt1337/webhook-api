const express = require("express");
const app = express();
const { hooks } = require("./config.json");
const { WebhookClient, MessageAttachment } = require("discord.js")

app.use(express.json());

app.get("/", (req, res) => {
  res.send("idk whoami")
})
app.post(["/hook1", "/hook2", "/hook3", "/hook4", "/hook5"], async (req, res) => {
  try {
    const { payload } = req.body;
    if (payload?.content && (payload?.content.includes("@everyone") || payload?.content.includes("@here"))) return res.sendStatus(200);

    const { files = [], ...leftover_payload } = payload;
    
    const hook = new WebhookClient({ url: hooks[req.url?.slice(1)] || hooks.hook1 })

    const __files = files.map(f => {
      const file = Buffer.from(f.type == "base64" ? f.file : Buffer.from(f.file, "utf-8").toString("base64"), "base64");
      return new MessageAttachment(file, f.name);
    })

    console.log(__files)

    await hook.send({ files: __files, ...leftover_payload })
    
    res.sendStatus(200)
  } catch (err) {
    console.log(err.toString())
    console.log(err.resonse?.data)
    // res.status(500).json({ code: 0, msg: `500: ${err}` })
    res.sendStatus(200)
  }
})

app.listen(8080, () => {
  console.log(`API Started on PORT 8080`)
})
