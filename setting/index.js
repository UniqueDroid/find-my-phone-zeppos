// Settings App: configure the ntfy topic. The topic is the secret that
// identifies YOUR phone - pick a long random string, e.g. generated at
// https://ntfy.sh and stored only on this device. Plain text fields saved
// to settingsStorage and read by the Side Service.
AppSettingsPage({
  state: {
    props: {},
    topic: '',
  },
  setState(props) {
    this.state.props = props
    this.state.topic = props.settingsStorage.getItem('ntfyTopic') || ''
  },
  build(props) {
    this.setState(props)

    return View(
      {
        style: {
          padding: '12px',
        },
      },
      [
        View(
          {
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '6px',
            },
          },
          ['ntfy topic'],
        ),
        TextInput({
          value: this.state.topic,
          placeholder: 'e.g. a7f3-long-random-string',
          onChange: (val) => {
            this.state.topic = val
            this.state.props.settingsStorage.setItem('ntfyTopic', val)
          },
        }),
        View(
          {
            style: {
              fontSize: '11px',
              color: '#888',
              marginTop: '18px',
            },
          },
          [
            'Install the ntfy app on your phone and subscribe to this ' +
              'topic. When you tap "Ring phone" on the watch, the Side ' +
              'Service posts a high-priority ntfy message that makes your ' +
              'phone ring - even in Do-Not-Disturb mode.',
          ],
        ),
      ],
    )
  },
})
