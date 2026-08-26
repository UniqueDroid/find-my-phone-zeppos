// Watch UI: one big button -> Side Service -> ntfy -> phone rings.
// Layout/styling mirrors the other example apps in this set (PikeW,
// BUTTON widgets, status TEXT, double-tap-to-confirm so a stray tap
// doesn't set off the alarm).
import * as hmUI from '@zos/ui'
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '../utils/config/device'
import { METHOD_FIND_PHONE, ERR_NO_TOPIC, ERR_NETWORK, ERR_TIMEOUT } from '../shared/protocol'

const ERROR_LABELS = {}
ERROR_LABELS[ERR_NO_TOPIC] = 'No topic - set one in the companion app'
ERROR_LABELS[ERR_NETWORK] = 'Phone has no network'
ERROR_LABELS[ERR_TIMEOUT] = 'Timed out'

Page({
  state: {},
  build() {
    try {
      this.buildUi()
    } catch (e) {
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 10,
        y: 10,
        w: DEVICE_WIDTH - 20,
        h: DEVICE_HEIGHT - 20,
        color: 0xff5555,
        text_size: 22,
        text_style: hmUI.text_style.WRAP,
        text: 'build() error:\n' + (e && (e.stack || e.message) || String(e)),
      })
    }
  },

  buildUi() {
    this.messageBuilder = getApp()._options.globalData.messageBuilder

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 20,
      y: 35,
      w: DEVICE_WIDTH - 40,
      h: 50,
      color: 0xffffff,
      text_size: 32,
      align_h: hmUI.align.CENTER_H,
      text: 'Find My Phone',
    })

    this.statusText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 20,
      y: 95,
      w: DEVICE_WIDTH - 40,
      h: 90,
      color: 0xcccccc,
      text_size: 26,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.WRAP,
      text: 'Tap to ring your phone.',
    })

    this.makeButton('Ring phone', 195, () => this.sendFindRequest())
  },

  makeButton(label, y, onClick) {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: (DEVICE_WIDTH - 300) / 2,
      y: y,
      w: 300,
      h: 64,
      radius: 12,
      normal_color: 0x3a3a3a,
      press_color: 0x555555,
      text_size: 28,
      color: 0xffffff,
      text: label,
      click_func: onClick,
    })
  },

  showText(text, color) {
    this.statusText.setProperty(hmUI.prop.TEXT, text)
    if (color != null) this.statusText.setProperty(hmUI.prop.COLOR, color)
  },

  // Double-tap-to-confirm: first tap arms a 3s window, second tap on the
  // same action within that window actually fires. Prevents an accidental
  // tap from blaring the phone across the room.
  sendFindRequest() {
    if (this.pendingConfirm) {
      clearTimeout(this.confirmTimer)
      this.pendingConfirm = false
      this.showText('Ringing...', 0x00ff66)
      this.messageBuilder
        .request({ method: METHOD_FIND_PHONE })
        .then((res) => this.renderResult(res))
        .catch(() => this.showText('BLE request failed', 0xff5555))
      return
    }

    this.pendingConfirm = true
    clearTimeout(this.confirmTimer)
    this.confirmTimer = setTimeout(() => {
      this.pendingConfirm = false
      this.showText('Tap to ring your phone.', 0xcccccc)
    }, 3000)
    this.showText('Tap again to confirm', 0xffb300)
  },

  renderResult(res) {
    if (res.error) {
      this.showText(ERROR_LABELS[res.error] || res.error, 0xff5555)
      return
    }
    this.showText('Sent! Check your phone.', 0x00ff66)
  },
})
