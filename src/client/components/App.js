import Alerts, {AlertPropType} from './Alerts.js'
import * as constants from '../constants.js'
import Input from './Input.js'
import Notifications, {NotificationPropTypes} from './Notifications.js'
import PropTypes from 'prop-types'
import React from 'react'
import Video, {StreamPropType} from './Video.js'
import _ from 'underscore'

export default class App extends React.PureComponent {
  static propTypes = {
    active: PropTypes.string,
    alerts: PropTypes.arrayOf(AlertPropType).isRequired,
    dismissAlert: PropTypes.func.isRequired,
    init: PropTypes.func.isRequired,
    notifications: PropTypes.objectOf(NotificationPropTypes).isRequired,
    notify: PropTypes.func.isRequired,
    peers: PropTypes.object.isRequired,
    sendMessage: PropTypes.func.isRequired,
    streams: PropTypes.objectOf(StreamPropType).isRequired,
    toggleActive: PropTypes.func.isRequired
  }

  componentDidMount () {
    const {init} = this.props
    init()
  }

  render () {
    const {
      active,
      alerts,
      dismissAlert,
      notifications,
      notify,
      peers,
      sendMessage,
      toggleActive,
      streams
    } = this.props

    let first = _.first(peers)
    // let first = constants.ME
    let firstPeerVideo = ''
    if (first !== undefined) {
      firstPeerVideo = <div className="col-md-6"><Video
        active={first === active}
        key={first}
        onClick={toggleActive}
        stream={streams[first]}
        userId={first}
      /></div>
    }

    let tailPeers = _.rest(peers)
    let n = 2
    let lists = _.groupBy(tailPeers, function (element, index) {
      return Math.floor(index / n)
    })
    lists = _.toArray(lists)

    return (<div className="app">
      {/* <Alerts alerts={alerts} dismiss={dismissAlert} /> */}
      {/* <Notifications notifications={notifications} /> */}
      {/* <Input notify={notify} sendMessage={sendMessage} /> */}
      <div className="videos container">
        <div className="row justify-content-md-center">
          <div className="col-md-6">
            <Video
              active={active === constants.ME}
              onClick={toggleActive}
              stream={streams[constants.ME]}
              userId={constants.ME}
            />
          </div>
          {firstPeerVideo}

        </div>

        {_.map(lists, (group) => (
          <div className="row justify-content-md-center">
            {_.map(group, (userId) =>
              <div className="col-md-6">
                <Video
                  active={active === userId}
                  onClick={toggleActive}
                  stream={streams[userId]}
                  userId={userId}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>)
  }
}
