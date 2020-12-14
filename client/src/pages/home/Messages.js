import React,{useEffect,Fragment,useState} from 'react'
import{Col,Form} from 'react-bootstrap'
import {gql,useLazyQuery, useMutation} from '@apollo/client'
import {useMessageDispatch,useMessageState} from '../../context/messages'
import Message from './Message'
const GET_MESSAGES = gql`
  query getMessages($from:String!){
    getMessages(from:$from)
      {
      from to uuid content createdAt reactions{
        uuid content
      }
    }
  }
  `
  const SEND_MESSAGE =  gql`
  mutation sendMessage($to:String!,$content:String!){
    sendMessage(to:$to,content:$content)
      {
      from to uuid content createdAt
    }
  }
  `

export default function Messages() {
    const {users} = useMessageState()
    const dispatch = useMessageDispatch()
    const [addMessage,setAddMessage] = useState('')
    
    
   


    const selectedUser = users?.find((u)=>u.selected===true)
    const messages = selectedUser?.messages
    
    const[getMessages,{loading:messagesLoading,data:messagesData}] =useLazyQuery(GET_MESSAGES)

    const[addTheMessage] =useMutation(SEND_MESSAGE,{
      onCompleted(data){
       

      },
      onError(err){

      }
    })

    useEffect(()=>{
      if(selectedUser && !selectedUser.messages){
        getMessages({variables:{from:selectedUser.username}})
      }
 
    },[selectedUser])
    useEffect(()=>{
        if(messagesData){
         
            dispatch({type:'SET_SELECTED_USER_MESSAGES',payload:{
                username:selectedUser.username,messages:messagesData.getMessages
            }})
        }
   
      },[messagesData])

      
      const addUserMessage = (e)=>{
        e.preventDefault()

        if(addMessage.trim('')==='' || !selectedUser) return
        setAddMessage("")
        addTheMessage({variables:{to:selectedUser.username,content:addMessage}})
      }

      let selectedChatMarkup
      if (!messages && !messagesLoading) {
        selectedChatMarkup = <p className="info-text">Select a friend</p>
      } else if (messagesLoading) {
        selectedChatMarkup = <p className="info-text">Loading..</p>
      } else if (messages.length > 0) {
        selectedChatMarkup = messages.map((message, index) => (
            <Fragment key={message.uuid}>
              <Message message={message} />
              {index === messages.length - 1 && (
                <div className="invisible">
                  <hr className="m-0" />
                </div>
              )}
            </Fragment>
          ))
      } else if (messages.length === 0) {
        selectedChatMarkup = <p className="info-text">You are now connected! send your first message!</p>
      }
    
     
      
      return  ( <Col xs={9} md={8} className="p-0" >
        <div className="message-div d-flex flex-column-reverse p-4">
        {selectedChatMarkup}
        </div>
      <div className="px-4 py-2">
        <Form onSubmit={addUserMessage}>
          <Form.Group className="d-flex align-items-center m-0">
            <Form.Control type="text" className="addmessage-div rounded-pill bg-secondary border-0" placeholder="Type your message..." value={addMessage} onChange={(e)=>setAddMessage(e.target.value)} />
            <i className="fa fa-paper-plane fa-2x text-primary ml-2" onClick={addUserMessage} aria-hidden="true" role="button"></i>
          </Form.Group>
        </Form>
        
      </div>
      </Col>
      )
    }
    