import { MessageBuilder } from '../shared/message-side'
import { METHOD_FIND_PHONE, ERR_NO_TOPIC, ERR_NETWORK, ERR_TIMEOUT } from '../shared/protocol'
import { ringPhone } from './ntfy-backend'

const messageBuilder = new MessageBuilder()

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    messageBuilder.on('request', (ctx) => {
      const payload = messageBuilder.buf2Json(ctx.request.payload)
      if (payload.method === METHOD_FIND_PHONE) {
        return handleFindPhone(ctx)
      }
    })
  },

  onRun() {},

  onDestroy() {},
})

async function handleFindPhone(ctx) {
  const { error } = await ringPhone()
  if (error) {
    return ctx.response({ data: { error: error } })
  }
  ctx.response({ data: { result: 'SENT' } })
}
