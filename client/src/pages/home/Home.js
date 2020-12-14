import React,{useState,useEffect,Fragment} from 'react'
import{Row,Col,Button,Image} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {useAuthDispatch} from '../../context/auth'
import {useMessageDispatch} from '../../context/messages'
import {useAuthState} from '../../context/auth'
import {gql,useSubscription} from '@apollo/client'
import User from './User'
import Messages from './Messages'

const NEW_MESSAGE = gql`
subscription newMessage{
  newMessage{
    uuid to from content createdAt reaction
  }
}

`

const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      message {
        uuid
        from
        to
      }
    }
  }
`

export default function Home(props) {

  const authDispatch = useAuthDispatch()
  const messageDispatch = useMessageDispatch()
  
  
  const {user} = useAuthState()
  console.log(user)
  
  const {data:messagesData,error:messagesError} = useSubscription(NEW_MESSAGE)
  
  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION
  )

  useEffect(()=>{
    if(messagesData){
      const message = messagesData.newMessage
      const otherUser = user.username===message.from?message.to:message.from
      messageDispatch({type:'ADD_MESSAGE',payload:{
        username:otherUser,message:message,
      }})
    }
  },[messagesData,messagesError])

  useEffect(()=>{
    if(reactionData){
      const reaction = reactionData.newReaction
      const otherUser = user.username===reaction.message.from?reaction.message.to:reaction.message.from
      messageDispatch({type:'ADD_REACTION',payload:{
        username:otherUser,reaction
      }})
    }
  },[reactionData,reactionError])





    
    const logout=()=>{
        authDispatch({type:'LOGOUT'})
        window.location.href='/login'
    }

    

    return (
        <Fragment >
      <Row className="bg-white justify-content-around mb-1" >
             <Link to ="/login">
             <Button variant="link">
             Login
          </Button>
          </Link>
          <Link to ="/register">
             <Button variant="link">
            Register
          </Button>
          </Link>
             <Button variant='link' onClick={logout}>
             Logout
          </Button>
      </Row>

      <Row className="bg-white p-0"> 
          <User />
          <Messages />
         
      </Row>
      </Fragment>
    )
}


