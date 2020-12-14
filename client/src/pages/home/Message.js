import React,{useState} from 'react'
import {useAuthState} from '../../context/auth'
import classnames from 'classnames'

import moment from 'moment'
import { OverlayTrigger, Tooltip,Button, Popover} from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client'

const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      uuid
    }
  }
`

export default function Message({message}) {
    const {user} = useAuthState()
    const sent = message.from === user.username
    const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
    const received = !sent
    const [showPopover, setShowPopover] = useState(false)
    const reactionIcon= [...new Set((message.reactions.map((r)=>(r.content))))]
    const reactionButton = <Button className="smile-div" variant="link">
      <i className="far fa-smile"></i>
    </Button>

const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
  onError: (err) => console.log(err),
  onCompleted: (data) => setShowPopover(false),
})


    const react=(reaction)=>{
      reactToMessage({ variables: { uuid: message.uuid, content: reaction } })
    }
    return (
      <OverlayTrigger trigger="click" placement="top" show={showPopover} onToggle={setShowPopover} transition={false} rootClose overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="d-flex align-items-center pop-reaction py-3 px-0">
            {reactions.map((reaction)=>(
              <Button className="reaction-div"variant='link' key={reaction} onClick={()=>react(reaction)}>{reaction}</Button>
            ))}
          </Popover.Content>
        </Popover>

      }>
      <div className={classnames("d-flex my-3",{"ml-auto":sent,"mr-auto":received
    })}>
       {sent && reactionButton}
      
        {/* <OverlayTrigger
      placement={sent ? 'right' : 'left'}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format('MMMM DD YYYY,@ h:mm a')}
        </Tooltip>
      }
      transition={false}
    > */}
       
         
        <div className="content-div">
          <div className={classnames(" px-3 py-2",{"bg-primary text-white":sent,"bg-secondary text-black":received})}>
          <div className="moment-div font-italic font-text-light">
            {moment(message.createdAt).format('MMMM DD YYYY,@ h:mm a')}
            </div>
  <p>{message.content}</p> 
            </div>
            {message.reactions.length >0 && (<div className="reactions-div rounded-pill bg-white">
              {reactionIcon}{reactionIcon.length}
            </div>)
            } 
        </div>
        {/* </OverlayTrigger> */}
        {received && reactionButton}
        </div>
        </OverlayTrigger>
    )
}
